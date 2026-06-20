import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { UserService } from '@/features/users/user.service';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Authenticate the request
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Active session user not found.' },
        { status: 401 }
      );
    }

    const cohortUsers = await UserService.getAllUsers();
    return NextResponse.json({ users: cohortUsers });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
