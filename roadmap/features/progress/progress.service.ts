import { createClient } from '@/lib/supabase/server';
import { Progress, UserCompletionDetails, UserProgressOverview, GroupProgressMetric, UserDetailedModuleProgress } from './progress.types';

export const ProgressService = {
  /**
   * Fetches all task progress logs for a specific user.
   */
  async getUserProgress(userId: string): Promise<Progress[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Database error fetching progress logs: ${error.message}`);
    }

    return (data || []) as Progress[];
  },

  /**
   * Toggles task completion status for a user.
   * If a progress row exists for (userId, taskId), its completed status is toggled.
   * If not, a new progress row is created with completed = true.
   */
  async toggleTask(userId: string, taskId: string): Promise<Progress> {
    const supabase = await createClient();

    // 1. Look up existing progress record
    const { data: existing, error: fetchError } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .eq('task_id', taskId)
      .maybeSingle();

    if (fetchError) {
      throw new Error(`Database error searching task progress: ${fetchError.message}`);
    }

    if (existing) {
      // Toggle
      const { data, error } = await supabase
        .from('progress')
        .update({
          completed: !existing.completed,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error updating task progress: ${error.message}`);
      }

      return data as Progress;
    } else {
      // Create new progress record as completed = true
      const { data, error } = await supabase
        .from('progress')
        .insert({
          user_id: userId,
          task_id: taskId,
          completed: true
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Database error inserting task progress: ${error.message}`);
      }

      return data as Progress;
    }
  },

  /**
   * Calculates overall learning track completion details for a user.
   */
  async getUserCompletion(userId: string): Promise<UserCompletionDetails> {
    const supabase = await createClient();

    // Get total task count
    const { count: totalTasks, error: totalError } = await supabase
      .from('roadmap_tasks')
      .select('*', { count: 'exact', head: true });

    if (totalError) {
      throw new Error(`Database error querying total roadmap tasks: ${totalError.message}`);
    }

    // Get completed task count
    const { count: completedTasks, error: completedError } = await supabase
      .from('progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true);

    if (completedError) {
      throw new Error(`Database error querying completed tasks: ${completedError.message}`);
    }

    const total = totalTasks || 0;
    const completed = completedTasks || 0;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      completedTasks: completed,
      totalTasks: total,
      percentage
    };
  },

  /**
   * Fetches progress summary for all users in the cohort.
   * Optimized: Avoids N+1 query loop using bulk load and map checks.
   */
  async getGroupProgress(): Promise<UserProgressOverview[]> {
    const supabase = await createClient();

    // Fetch cohort members only, excluding system administrators
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'member')
      .order('created_at', { ascending: true });

    if (userError) {
      throw new Error(`Database error fetching users for leaderboard: ${userError.message}`);
    }

    // Get total task count (1 global query)
    const { count: totalTasks, error: totalError } = await supabase
      .from('roadmap_tasks')
      .select('*', { count: 'exact', head: true });

    if (totalError) {
      throw new Error(`Database error querying total roadmap tasks: ${totalError.message}`);
    }
    const total = totalTasks || 0;

    // Get all completed progress records for all users (1 bulk query)
    const { data: progressCounts, error: progressError } = await supabase
      .from('progress')
      .select('user_id')
      .eq('completed', true);

    if (progressError) {
      throw new Error(`Database error querying completed progress counts: ${progressError.message}`);
    }

    // Map user_id -> completed count
    const completedMap = new Map<string, number>();
    (progressCounts || []).forEach(p => {
      completedMap.set(p.user_id, (completedMap.get(p.user_id) || 0) + 1);
    });

    return (users || []).map((u) => {
      const completed = completedMap.get(u.id) || 0;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        userId: u.id,
        userName: u.name || u.email,
        completionRate: percentage,
        completedMilestones: completed,
        totalMilestones: total,
        role: u.role as 'admin' | 'member'
      };
    });
  },

  /**
   * Aggregates completion averages for each month/week module across the cohort,
   * as well as individual completion rates per user.
   * Optimized: Uses bulk queries and Map lookups instead of inner loops.
   */
  async getGroupMetrics(): Promise<GroupProgressMetric[]> {
    const supabase = await createClient();

    // Get all tasks (1 narrow query)
    const { data: tasks, error: tasksError } = await supabase
      .from('roadmap_tasks')
      .select('id, month, week');

    if (tasksError) {
      throw new Error(`Database error fetching roadmap tasks: ${tasksError.message}`);
    }

    const allTasks = tasks || [];

    // Map task_id -> "month-week" key, and track total tasks per week key
    const taskToWeekMap = new Map<string, string>();
    const weekTasksCountMap = new Map<string, number>();
    allTasks.forEach(t => {
      const key = `${t.month}-${t.week}`;
      taskToWeekMap.set(t.id, key);
      weekTasksCountMap.set(key, (weekTasksCountMap.get(key) || 0) + 1);
    });

    // Get all active member cohort users (1 query)
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('role', 'member')
      .order('created_at', { ascending: true });

    if (userError) {
      throw new Error(`Database error fetching users: ${userError.message}`);
    }

    const cohortUsers = users || [];

    // Get all completed progress records for all users (1 query)
    const { data: progress, error: progressError } = await supabase
      .from('progress')
      .select('user_id, task_id')
      .eq('completed', true);

    if (progressError) {
      throw new Error(`Database error fetching completed progress records: ${progressError.message}`);
    }

    // Map "userId-month-week" key -> count of total completed tasks by this user
    const userWeekCompletedMap = new Map<string, number>();
    // Map "month-week" key -> count of total completed tasks by all users
    const weekCompletedMap = new Map<string, number>();

    (progress || []).forEach(p => {
      const key = taskToWeekMap.get(p.task_id);
      if (key) {
        // Increment global week count
        weekCompletedMap.set(key, (weekCompletedMap.get(key) || 0) + 1);
        
        // Increment user-specific week count
        const userWeekKey = `${p.user_id}-${key}`;
        userWeekCompletedMap.set(userWeekKey, (userWeekCompletedMap.get(userWeekKey) || 0) + 1);
      }
    });

    const totalUsers = cohortUsers.length || 1;

    const metrics: GroupProgressMetric[] = [];
    weekTasksCountMap.forEach((taskCount, key) => {
      const [month, week] = key.split('-');
      const completedForWeek = weekCompletedMap.get(key) || 0;
      const totalPossible = taskCount * totalUsers;
      const avgRate = totalPossible > 0 ? Math.round((completedForWeek / totalPossible) * 100) : 0;

      // Calculate rates per user for this week
      const userRates = cohortUsers.map(u => {
        const userWeekKey = `${u.id}-${key}`;
        const completed = userWeekCompletedMap.get(userWeekKey) || 0;
        const rate = taskCount > 0 ? Math.round((completed / taskCount) * 100) : 0;
        return {
          userId: u.id,
          userName: u.name || u.email.split('@')[0],
          completionRate: rate
        };
      });

      metrics.push({
        month: `month-${month}`,
        week: `week-${week}`,
        averageCompletionRate: avgRate,
        userRates
      });
    });

    // Sort metrics by month and week order
    return metrics.sort((a, b) => {
      const aMonthNum = parseInt(a.month.split('-')[1], 10);
      const bMonthNum = parseInt(b.month.split('-')[1], 10);
      if (aMonthNum !== bMonthNum) {
        return aMonthNum - bMonthNum;
      }
      const aWeekNum = parseInt(a.week.split('-')[1], 10);
      const bWeekNum = parseInt(b.week.split('-')[1], 10);
      return aWeekNum - bWeekNum;
    });
  },

  /**
   * Generates a detailed month/week progress checklist status for a user.
   */
  async getUserDetailedBreakdown(userId: string): Promise<UserDetailedModuleProgress[]> {
    const { RoadmapService } = require('../roadmap/roadmap.service');
    const milestones = await RoadmapService.getMilestones(userId);

    const breakdown: UserDetailedModuleProgress[] = [];
    (milestones || []).forEach((m: any) => {
      const monthTitle = m.month.split(': ')[1] || m.month;
      m.weeks.forEach((w: any) => {
        let status: 'Complete' | 'In Progress' | 'Not Started' = 'Not Started';
        let statusColor = 'var(--text-muted)';

        if (w.completed) {
          status = 'Complete';
          statusColor = 'var(--success)';
        } else if (w.completedTasksCount > 0) {
          status = 'In Progress';
          statusColor = 'var(--warning)';
        }

        const title = `${monthTitle} - Week ${w.week.split('-')[1]}`;
        breakdown.push({
          title,
          status,
          statusColor
        });
      });
    });

    return breakdown;
  }
};
