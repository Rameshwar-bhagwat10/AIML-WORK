export interface Task {
  id: string;
  month: number;
  week: number;
  day: number;
  title: string;
  task_order: number;
  created_at: string;
}

// Grouped structure return helper
export interface DayGroupedTasks {
  day: number;
  tasks: Task[];
}

export interface MilestoneWeek {
  week: string;
  title: string;
  completed: boolean;
  tasksCount: number;
  completedTasksCount: number;
  isUnlocked?: boolean;
  isStudying?: boolean;
}

export interface MilestoneGroup {
  month: string;
  weeks: MilestoneWeek[];
}

export interface WeekMetadata {
  month: number;
  week: number;
  topics: string[];
  tools: string[];
  daily_practice: string;
  project: string;
  tip: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  resources: { title: string; url: string }[];
}

export interface WeekDetail {
  id: string;
  title: string;
  description: string;
  month: string;
  week: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  resources: { title: string; url: string }[];
  tasks: { id: string; title: string; isCompleted: boolean }[];
  // Metadata extensions
  tools?: string[];
  dailyPractice?: string;
  project?: string;
  tip?: string;
}
