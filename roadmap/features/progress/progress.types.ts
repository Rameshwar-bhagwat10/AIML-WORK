export interface Progress {
  id: string;
  user_id: string;
  task_id: string;
  completed: boolean;
  updated_at: string;
}

export interface UserCompletionDetails {
  completedTasks: number;
  totalTasks: number;
  percentage: number;
}

export interface UserProgressOverview {
  userId: string;
  userName: string;
  avatarUrl?: string;
  completionRate: number;
  completedMilestones: number;
  totalMilestones: number;
  role?: 'admin' | 'member';
}

export interface UserRate {
  userId: string;
  userName: string;
  completionRate: number;
}

export interface GroupProgressMetric {
  month: string;
  week: string;
  averageCompletionRate: number;
  userRates?: UserRate[];
}

export interface UserDetailedModuleProgress {
  title: string;
  status: 'Complete' | 'In Progress' | 'Not Started';
  statusColor: string;
}
