export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'member';
  created_at: string;
}
