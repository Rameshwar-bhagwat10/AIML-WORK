import { NextRequest, NextResponse } from 'next/server';
import { RoadmapService } from '@/features/roadmap/roadmap.service';
import { createClient } from '@/lib/supabase/server';

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

    const searchParams = request.nextUrl.searchParams;
    const monthStr = searchParams.get('month');
    const weekStr = searchParams.get('week');

    // If any filter parameter is provided, validate and fetch filtered week tasks
    if (monthStr !== null || weekStr !== null) {
      if (monthStr === null || weekStr === null) {
        return NextResponse.json(
          { error: 'Both "month" and "week" query parameters are required to filter by week.' },
          { status: 400 }
        );
      }

      const month = parseInt(monthStr, 10);
      const week = parseInt(weekStr, 10);

      if (isNaN(month) || isNaN(week) || month <= 0 || week <= 0) {
        return NextResponse.json(
          { error: 'Query parameters "month" and "week" must be valid positive integers.' },
          { status: 400 }
        );
      }

      // 1. Fetch metadata from roadmap_weeks
      const { data: weekData, error: weekError } = await supabase
        .from('roadmap_weeks')
        .select('topics, tools, project, tip')
        .eq('month', month)
        .eq('week', week)
        .maybeSingle();

      if (weekError) {
        throw new Error(`Database error fetching week metadata: ${weekError.message}`);
      }

      // 2. Fetch tasks grouped by day
      const groupedTasks = await RoadmapService.getTasksByWeek(month, week);

      // 3. Format days array
      const days = groupedTasks.map(g => ({
        day: g.day,
        tasks: g.tasks.map(t => ({
          id: t.id,
          title: t.title
        }))
      }));

      // 4. Construct final payload
      const payload = {
        month,
        week,
        topics: weekData?.topics || [],
        tools: weekData?.tools || [],
        project: weekData?.project || '',
        tip: weekData?.tip || '',
        days
      };

      return NextResponse.json(payload);
    }

    // Default to return all tasks
    const allTasks = await RoadmapService.getAllTasks();
    return NextResponse.json({ tasks: allTasks });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
