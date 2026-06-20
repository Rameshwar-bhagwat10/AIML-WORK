import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: Fetch notifications
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check user role
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const isAdmin = profile?.role === 'admin';

    if (isAdmin) {
      // Admins: Fetch all sent notifications including recipient details
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select(`
          id,
          title,
          message,
          is_read,
          created_at,
          user_id,
          users:user_id (name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json(notifications || []);
    } else {
      // Members: Fetch personal notifications
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json(notifications || []);
    }
  } catch (err: any) {
    console.error('Notifications GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Send notification (Admin Only)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin privileges
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, message, recipientType, recipientId } = await request.json();

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }

    if (recipientType === 'all') {
      // Fetch all member users
      const { data: members, error: mError } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'member');

      if (mError) throw mError;
      if (!members || members.length === 0) {
        return NextResponse.json({ success: true, count: 0, message: 'No members to send to' });
      }

      // Bulk insert notifications
      const rows = members.map((m) => ({
        user_id: m.id,
        title,
        message,
        is_read: false
      }));

      const { error: insError } = await supabase
        .from('notifications')
        .insert(rows);

      if (insError) throw insError;
      return NextResponse.json({ success: true, count: rows.length });
    } else if (recipientType === 'single') {
      if (!recipientId) {
        return NextResponse.json({ error: 'Recipient ID is required for single delivery' }, { status: 400 });
      }

      const { error: insError } = await supabase
        .from('notifications')
        .insert({
          user_id: recipientId,
          title,
          message,
          is_read: false
        });

      if (insError) throw insError;
      return NextResponse.json({ success: true, count: 1 });
    }

    return NextResponse.json({ error: 'Invalid recipient type' }, { status: 400 });
  } catch (err: any) {
    console.error('Notifications POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Mark notifications as read
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, id } = await request.json();

    if (action === 'read_all') {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id);

      if (error) throw error;
      return NextResponse.json({ success: true });
    } else if (action === 'read_single') {
      if (!id) {
        return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
      }

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Notifications PATCH error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
