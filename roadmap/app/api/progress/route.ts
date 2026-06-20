import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ProgressService } from '@/features/progress/progress.service';

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

    // Retrieve user progress and completion stats
    const progressList = await ProgressService.getUserProgress(user.id);
    const completionStats = await ProgressService.getUserCompletion(user.id);

    return NextResponse.json({
      progress: progressList,
      completion: completionStats
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json().catch(() => ({}));
    const { taskId } = body;

    // Validate parameters
    if (!taskId) {
      return NextResponse.json(
        { error: 'Parameter "taskId" is required inside the JSON body.' },
        { status: 400 }
      );
    }

    const progressRecord = await ProgressService.toggleTask(user.id, taskId);

    return NextResponse.json({
      success: true,
      progress: progressRecord
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
