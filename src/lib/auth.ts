import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { NextAuthOptions, Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
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
          where: { email: credentials.email },
          select: { id: true, email: true, name: true, image: true, role: true, passwordHash: true }
        });
        if (!user?.passwordHash) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role } as any;
      }
    })
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session.user && user) {
        (session.user as any).id = user.id;
        (session.user as any).role = (user as any).role ?? 'user';
      }
      return session;
    }
  }
};

export async function assertSession(session: Session | null) {
  if (!session?.user) throw new Error('Unauthorized');
  return session;
}
