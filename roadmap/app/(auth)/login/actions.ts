'use server';

import { AuthService } from '@/features/auth/auth.service';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  let userRole = 'member';

  try {
    const { user, error } = await AuthService.login(email, password);

    if (error) {
      return { error: error.message };
    }

    if (user) {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      
      // Fetch user role directly to save redundant token verification requests
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile) {
        // Fallback: only sync if the public.users record is missing (usually trigger does it)
        await AuthService.syncUser(user);
      } else if (profile.role) {
        userRole = profile.role;
      }
    }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred during login.' };
  }

  const redirectUrl = userRole === 'admin' 
    ? '/admin/dashboard?login=success' 
    : '/dashboard?login=success';

  redirect(redirectUrl);
}

