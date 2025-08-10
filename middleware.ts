export { default } from 'next-auth/middleware';

// Protect dashboard and all API routes except NextAuth and public Twilio webhook
export const config = {
  matcher: [
    '/dashboard/:path*',
  // Exclude /api/auth and /api/twilio/webhook using negative lookahead
  '/api/(?!auth|twilio/webhook).*',
  ],
};
