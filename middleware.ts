export { auth as middleware } from '@/lib/auth';

// Protect dashboard and all API routes; exclusions are handled in callbacks.authorized
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
  ],
};
