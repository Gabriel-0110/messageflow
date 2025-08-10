export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
    // Allow unauthenticated for auth endpoints and public Twilio webhook
    '/((?!api/auth|api/twilio/webhook).*)'
  ]
};
