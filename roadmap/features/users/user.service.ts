import { createClient } from '@/lib/supabase/server';
import { User } from './user.types';

export const UserService = {
  /**
   * Fetches all users from the database.
   */
  async getAllUsers(): Promise<User[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Database error fetching users: ${error.message}`);
    }

    return (data || []) as User[];
  },

  /**
   * Fetches a single user profile from the database by ID.
   */
  async getUserById(id: string): Promise<User | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Database error fetching user by ID ${id}: ${error.message}`);
    }

    return data as User | null;
  }
};
