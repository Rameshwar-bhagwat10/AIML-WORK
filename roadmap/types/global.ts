export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  month: string; // e.g. "october"
  week: string;  // e.g. "week-1"
  topics: string[];
  resources: { title: string; url: string }[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Task {
  id: string;
  roadmapItemId: string;
  title: string;
  description?: string;
  isCompleted: boolean;
}

export interface UserProgress {
  userId: string;
  roadmapItemId: string;
  completedTasksCount: number;
  totalTasksCount: number;
  updatedAt: string;
}
