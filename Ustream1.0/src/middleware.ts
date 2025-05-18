// middleware.ts
import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  '/',
  '/connect',
  '/api/auth',
  // Add other public paths here
];

export async function middleware(request: NextRequest) {
  // Check if the path should be public
  if (PUBLIC_PATHS.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for wallet connection from cookie
  const walletConnected = request.cookies.get('wallet-connected');
  
  if (!walletConnected?.value) {
    const connectUrl = new URL('/', request.url);
    // Preserve the original URL to redirect back after connection
    connectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    // Add a query parameter to trigger the toast
    connectUrl.searchParams.set('showConnectWallet', 'true');
    return NextResponse.redirect(connectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};