import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    if (q.trim().length < 2) {
      return NextResponse.json([]);
    }

    const supabase = await createClient();

    // 1. Search months
    const { data: months } = await supabase
      .from('roadmap_months')
      .select('month, title')
      .ilike('title', `%${q}%`);

    // 2. Search weeks in memory (very fast for 24 rows, resolves Postgres text[] filtering complexity)
    const { data: weeks } = await supabase
      .from('roadmap_weeks')
      .select('month, week, topics');

    // 3. Search tasks
    const { data: tasks } = await supabase
      .from('roadmap_tasks')
      .select('id, month, week, day, title')
      .ilike('title', `%${q}%`)
      .limit(10);

    const results: any[] = [];

    // Format months matches
    (months || []).forEach((m) => {
      results.push({
        type: 'month',
        title: `Month ${m.month}: ${m.title}`,
        subtitle: 'Main Syllabus Month',
        url: `/roadmap`
      });
    });

    // Format weeks matches
    (weeks || []).forEach((w) => {
      const matchText = w.topics.some((t: string) => t.toLowerCase().includes(q.toLowerCase()));
      if (matchText) {
        results.push({
          type: 'week',
          title: `Month ${w.month} Week ${w.week} syllabus`,
          subtitle: w.topics.slice(0, 3).join(', ') + (w.topics.length > 3 ? '...' : ''),
          url: `/roadmap/${w.month}/${w.week}`
        });
      }
    });

    // Format tasks matches
    (tasks || []).forEach((t) => {
      results.push({
        type: 'task',
        title: t.title,
        subtitle: `Month ${t.month} Week ${t.week} - Day ${t.day} checkpoint`,
        url: `/roadmap/${t.month}/${t.week}#task-${t.id}`
      });
    });

    return NextResponse.json(results.slice(0, 8));
  } catch (err: any) {
    console.error('Search API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
