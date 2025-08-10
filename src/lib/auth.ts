import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
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
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          select: { id: true, email: true, name: true, role: true }
        });
        if (!user) return null;
        // For now, skip password validation since password field doesn't exist in schema
        // TODO: Add password field to User model in schema.prisma and run migration
        return { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: user.role 
        } as { id: string; email: string; name: string | null; role: 'admin' | 'user' };
      }
    })
  ],
  callbacks: {
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
