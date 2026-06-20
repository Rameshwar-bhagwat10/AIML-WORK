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

export async function POST(request: NextRequest) {
  try {
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

    // 3. Parse and Validate Request Body
    const body = await request.json().catch(() => ({}));
    const { email, password, name, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Parameter "email" and "password" are required.' },
        { status: 400 }
      );
    }

    if (role && role !== 'member' && role !== 'admin') {
      return NextResponse.json(
        { error: 'Invalid role. Must be "member" or "admin".' },
        { status: 400 }
      );
    }

    // 4. Create User in Auth Database
    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm user email
      user_metadata: {
        name: name || email.split('@')[0],
      },
    });

    if (createError || !authData.user) {
      return NextResponse.json(
        { error: createError?.message || 'Failed to create user in Auth system.' },
        { status: 500 }
      );
    }

    // 5. Update database role if it differs from default 'member'
    const targetRole = role || 'member';
    if (targetRole !== 'member') {
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ role: targetRole })
        .eq('id', authData.user.id);

      if (updateError) {
        console.error('Failed to update created user role in public.users:', updateError);
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name || null,
        role: targetRole,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
