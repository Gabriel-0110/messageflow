export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/contacts/:path*',
    '/api/templates/:path*',
    '/api/campaigns/:path*',
    '/api/messages/:path*',
  ]
};
