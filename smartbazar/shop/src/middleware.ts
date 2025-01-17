/* eslint-disable @next/next/no-server-import-in-page */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  if (url.pathname === '/') {
    url.pathname = '/chat';
    return NextResponse.redirect(url);
  }
}
