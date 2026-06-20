import { createClient } from '@/lib/supabase/server';
import { Task, DayGroupedTasks, MilestoneGroup, MilestoneWeek, WeekDetail, WeekMetadata } from './roadmap.types';

export const RoadmapService = {
  /**
   * Fetches all global roadmap tasks ordered by month, week, day, and task order.
   */
  async getAllTasks(): Promise<Task[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('roadmap_tasks')
      .select('*')
      .order('month', { ascending: true })
      .order('week', { ascending: true })
      .order('day', { ascending: true })
      .order('task_order', { ascending: true });

    if (error) {
      throw new Error(`Database error fetching all tasks: ${error.message}`);
    }

    return (data || []) as Task[];
  },

  /**
   * Fetches all tasks for a specific month and week, grouped by day.
   */
  async getTasksByWeek(month: number, week: number): Promise<DayGroupedTasks[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('roadmap_tasks')
      .select('*')
      .eq('month', month)
      .eq('week', week)
      .order('day', { ascending: true })
      .order('task_order', { ascending: true });

    if (error) {
      throw new Error(`Database error fetching tasks for Month ${month} Week ${week}: ${error.message}`);
    }

    const tasks = (data || []) as Task[];

    // Group tasks by day
    const groupedMap = new Map<number, Task[]>();
    tasks.forEach((task) => {
      if (!groupedMap.has(task.day)) {
        groupedMap.set(task.day, []);
      }
      groupedMap.get(task.day)!.push(task);
    });

    // Convert map to a structured array sorted by day
    const result: DayGroupedTasks[] = [];
    groupedMap.forEach((tasksForDay, day) => {
      result.push({
        day,
        tasks: tasksForDay,
      });
    });

    return result.sort((a, b) => a.day - b.day);
  },

  /**
   * Aggregates database tasks into milestones for frontend rendering compatibility,
   * querying 'roadmap_months' to get actual subject names.
   * Can accept a userId to determine true task completion count per week.
   */
  async getMilestones(userId?: string): Promise<MilestoneGroup[]> {
    const supabase = await createClient();

    // Fetch months title, tasks, and progress concurrently
    const [monthsRes, tasksRes, progressRes] = await Promise.all([
      supabase.from('roadmap_months').select('*').order('month', { ascending: true }),
      supabase.from('roadmap_tasks').select('*').order('month', { ascending: true }).order('week', { ascending: true }).order('day', { ascending: true }).order('task_order', { ascending: true }),
      userId ? supabase.from('progress').select('task_id').eq('user_id', userId).eq('completed', true) : Promise.resolve({ data: null, error: null })
    ]);

    if (monthsRes.error) {
      throw new Error(`Database error fetching roadmap months: ${monthsRes.error.message}`);
    }
    if (tasksRes.error) {
      throw new Error(`Database error fetching roadmap tasks: ${tasksRes.error.message}`);
    }

    const monthsTitleMap = new Map<number, string>();
    (monthsRes.data || []).forEach((m) => {
      monthsTitleMap.set(m.month, m.title);
    });

    const tasks = (tasksRes.data || []) as Task[];

    // Fetch user progress if userId is provided
    const completedTasksSet = new Set<string>();
    if (userId && progressRes.data) {
      progressRes.data.forEach((p) => completedTasksSet.add(p.task_id));
    }

    // Group tasks by month, then by week, tracking total and completed counts
    const monthsMap = new Map<number, Map<number, { total: number; completed: number }>>();
    tasks.forEach((t) => {
      if (!monthsMap.has(t.month)) {
        monthsMap.set(t.month, new Map<number, { total: number; completed: number }>());
      }
      const weeksMap = monthsMap.get(t.month)!;
      if (!weeksMap.has(t.week)) {
        weeksMap.set(t.week, { total: 0, completed: 0 });
      }
      const counts = weeksMap.get(t.week)!;
      counts.total++;
      if (completedTasksSet.has(t.id)) {
        counts.completed++;
      }
    });

    const milestones: MilestoneGroup[] = [];
    monthsMap.forEach((weeksMap, monthNum) => {
      const weeks: MilestoneWeek[] = [];
      weeksMap.forEach((counts, weekNum) => {
        const isCompleted = counts.total > 0 && counts.completed === counts.total;
        weeks.push({
          week: `week-${weekNum}`,
          title: `Month ${monthNum} Week ${weekNum} Curriculum`,
          completed: isCompleted,
          tasksCount: counts.total,
          completedTasksCount: counts.completed,
        });
      });
      // Sort weeks
      weeks.sort((a, b) => {
        const aNum = parseInt(a.week.split('-')[1], 10);
        const bNum = parseInt(b.week.split('-')[1], 10);
        return aNum - bNum;
      });

      const monthTitle = monthsTitleMap.get(monthNum) || `Month ${monthNum}`;
      milestones.push({
        month: `Month ${monthNum}: ${monthTitle}`,
        weeks,
      });
    });

    // Sort months
    return milestones.sort((a, b) => {
      const aNum = parseInt(a.month.split(':')[0], 10);
      const bNum = parseInt(b.month.split(':')[0], 10);
      return aNum - bNum;
    });
  },

  /**
   * Fetches detailed week syllabus and associated tasks for compatibility,
   * joining with week metadata.
   * Can accept a userId to determine true task checklist checkbox state.
   */
  async getWeekDetail(monthStr: string, weekStr: string, userId?: string): Promise<WeekDetail | null> {
    const month = parseInt(monthStr.replace(/\D/g, ''), 10) || 1;
    const week = parseInt(weekStr.replace(/\D/g, ''), 10) || 1;

    const supabase = await createClient();

    // Fetch all details concurrently
    const [monthRes, weekRes, tasksRes, progressRes] = await Promise.all([
      supabase.from('roadmap_months').select('title').eq('month', month).maybeSingle(),
      supabase.from('roadmap_weeks').select('*').eq('month', month).eq('week', week).maybeSingle(),
      supabase.from('roadmap_tasks').select('*').eq('month', month).eq('week', week).order('day', { ascending: true }).order('task_order', { ascending: true }),
      userId ? supabase.from('progress').select('task_id').eq('user_id', userId).eq('completed', true) : Promise.resolve({ data: null, error: null })
    ]);

    if (tasksRes.error) {
      throw new Error(`Database error fetching details: ${tasksRes.error.message}`);
    }

    const monthTitle = monthRes.data?.title || `Month ${month}`;
    const weekData = weekRes.data;
    const taskList = tasksRes.data || [];
    
    if (taskList.length === 0 && !weekData) return null;

    // Fetch user progress if userId is provided
    const completedTasksSet = new Set<string>();
    if (userId && progressRes.data) {
      progressRes.data.forEach((p) => completedTasksSet.add(p.task_id));
    }

    const typedWeekData = weekData as WeekMetadata | null;

    return {
      id: `${month}-${week}`,
      title: `${monthTitle} - Week ${week}`,
      description: typedWeekData?.daily_practice 
        ? `Daily practice: ${typedWeekData.daily_practice}`
        : `Detailed task checklist for ${monthTitle} Week ${week}`,
      month: monthStr,
      week: weekStr,
      difficulty: typedWeekData?.difficulty || 'intermediate',
      topics: typedWeekData?.topics || [
        `Syllabus elements for ${monthTitle} Week ${week}`
      ],
      resources: typedWeekData?.resources || [
        { title: "Supabase Documentation", url: "https://supabase.com/docs" }
      ],
      tasks: taskList.map((t: any) => ({
        id: t.id,
        title: t.title,
        isCompleted: completedTasksSet.has(t.id)
      })),
      // Metadata extensions
      tools: typedWeekData?.tools,
      dailyPractice: typedWeekData?.daily_practice,
      project: typedWeekData?.project,
      tip: typedWeekData?.tip
    };
  }
};
