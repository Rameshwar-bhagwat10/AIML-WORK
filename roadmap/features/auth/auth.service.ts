import { createClient as createBrowserClient } from '@/lib/supabase/client';

/**
 * Resolves the correct Supabase client depending on the execution context.
 */
async function getSupabase() {
  if (typeof window === 'undefined') {
    const { createClient } = await import('@/lib/supabase/server');
    return createClient();
  } else {
    return createBrowserClient();
  }
}

export const AuthService = {
  /**
   * Logs a user in using Supabase signInWithPassword.
   */
  async login(email: string, password: string) {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return {
      user: data.user,
      session: data.session,
      error,
    };
  },

  /**
   * Logs a user out using Supabase signOut.
   */
  async logout() {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  /**
   * Fetches the current logged in user from Supabase.
   */
  async getCurrentUser() {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  /**
   * Synchronizes Supabase auth.users with public.users table.
   * If a profile does not exist, it inserts one.
   */
  async syncUser(user: any) {
    const supabase = await getSupabase();

    // Check if user exists in public.users
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (fetchError) {
      throw new Error(`Database error verifying user: ${fetchError.message}`);
    }

    if (!existingUser) {
      // Insert new profile
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || '',
          role: 'member',
        });

      if (insertError) {
        throw new Error(`Database error creating user profile: ${insertError.message}`);
      }
    }
  }
};
