import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Instantiate the Supabase Admin Client using the admin service key
const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // service_role equivalent anon key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    // 1. Authenticate Request
    const supabase = await createClient();
    const { data: { user: sessionUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !sessionUser) {
      return NextResponse.json(
        { error: 'Unauthorized. Active session not found.' },
        { status: 401 }
      );
    }

    // 2. Authorize Role (Admin Only)
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', sessionUser.id)
      .maybeSingle();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Admin privileges required.' },
        { status: 403 }
      );
    }

    // Prevent admin from deleting themselves
    if (sessionUser.id === id) {
      return NextResponse.json(
        { error: 'Conflict. Admins cannot delete their own active account.' },
        { status: 409 }
      );
    }

    // 3. Delete user in auth DB (Postgres cascades delete to public.users and progress tables)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message || 'Failed to delete user from Auth system.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User successfully deleted.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
