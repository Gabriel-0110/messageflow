import { NextRequest, NextResponse } from "next/server";

// Temporary pass-through middleware until NextAuth is wired up
export function middleware(_request: NextRequest): NextResponse {
  void _request;
  return NextResponse.next();
}

// Protect dashboard and all API routes except NextAuth and public Twilio webhook
export const config = {
  matcher: [
    '/dashboard/:path*',
  // Exclude /api/auth and /api/twilio/webhook using negative lookahead
  '/api/(?!auth|twilio/webhook).*',
  ],
};
