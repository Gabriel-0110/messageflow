import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: { signIn: '/signin' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = String(credentials.email).toLowerCase().trim();
        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, email: true, name: true, role: true, passwordHash: true }
        });
        if (!user?.passwordHash) return null;
        const valid = await bcrypt.compare(String(credentials.password), user.passwordHash);
        if (!valid) return null;
        const role = user.role === 'admin' ? 'admin' : 'user';
        return { id: user.id, email: user.email, name: user.name, role };
      }
    })
  ],
  callbacks: {
    // Allow unauthenticated access to NextAuth endpoints and Twilio webhook in middleware
    async authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname.startsWith('/api/auth')) return true;
      if (pathname.startsWith('/api/twilio/webhook')) return true;
      // Protect everything else under matcher
      return !!auth;
    },
    async jwt({ token, user }) {
      type Token = typeof token & { id?: string; role?: 'admin' | 'user' };
      const t = token as Token;
      if (user) {
        t.id = (user as { id?: string }).id;
        t.role = ((user as { role?: 'admin' | 'user' }).role) ?? 'user';
        t.name = user.name ?? t.name;
        t.email = user.email ?? t.email;
      }
      return t;
    },
    async session({ session, token }) {
      type Token = typeof token & { id?: string; role?: 'admin' | 'user' };
      const t = token as Token;
      if (session.user) {
        (session.user as { id?: string; role?: 'admin' | 'user' }).id = t.id;
        (session.user as { id?: string; role?: 'admin' | 'user' }).role = t.role ?? 'user';
      }
      return session;
    },
  }
});
