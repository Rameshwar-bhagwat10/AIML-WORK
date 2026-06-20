import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // Auth check
  const isAuthRoute = pathname.startsWith('/login');
  const isApiRoute = pathname.startsWith('/api');

  if (!user) {
    if (isApiRoute) {
      return NextResponse.json(
        { error: 'Unauthorized. Active session not found.' },
        { status: 401 }
      );
    }
    if (!isAuthRoute) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return response;
  }

  // User is authenticated, fetch role from database
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const role = profile?.role || 'member';

  // Global API route authorization
  if (isApiRoute) {
    if (pathname.startsWith('/api/admin') && role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Admin privileges required.' },
        { status: 403 }
      );
    }
    return response;
  }

  if (role === 'admin') {
    // Admin routing rules
    if (pathname === '/' || pathname === '/dashboard' || isAuthRoute) {
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
    // Block admins from member-specific learning views
    if (pathname.startsWith('/roadmap') || pathname.startsWith('/progress')) {
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
  } else {
    // Member routing rules
    if (pathname.startsWith('/admin')) {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    if (isAuthRoute) {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    if (pathname === '/') {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    if (pathname === '/dashboard') {
      url.pathname = '/';
      return NextResponse.rewrite(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

