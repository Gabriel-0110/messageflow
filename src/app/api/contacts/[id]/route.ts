import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TwilioService } from '@/lib/twilio';

const updateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phoneNumber: z.string().refine(TwilioService.validatePhoneNumber, {
    message: 'Phone number must be in E.164 format',
  }).optional(),
  email: z.string().email().optional().or(z.literal('')).transform(v => (v === '' ? undefined : v)).optional(),
  tags: z.array(z.string()).optional(),
  customFields: z.record(z.string()).optional(),
});

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = user.id;

    const body = await request.json();
    const data = updateSchema.parse(body);

    const updated = await prisma.contact.updateMany({
      where: { id: params.id, userId },
      data: {
        ...('firstName' in data ? { firstName: data.firstName } : {}),
        ...('lastName' in data ? { lastName: data.lastName } : {}),
        ...('phoneNumber' in data ? { phoneNumber: data.phoneNumber } : {}),
        ...('email' in data ? { email: data.email } : {}),
        ...('tags' in data ? { tags: JSON.stringify(data.tags) } : {}),
        ...('customFields' in data ? { customFields: JSON.stringify(data.customFields) } : {}),
      },
    });

    if (updated.count === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const contact = await prisma.contact.findFirst({ where: { id: params.id, userId } });
    return NextResponse.json({ success: true, data: contact });
  } catch (err) {
    if (isZodError(err)) {
      return NextResponse.json({ error: 'Invalid request data', details: err.errors }, { status: 400 });
    }
    console.error('Contacts PUT error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = user.id;

    const deleted = await prisma.contact.deleteMany({ where: { id: params.id, userId } });
    if (deleted.count === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contacts DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

type ZodLike = { name: string; errors?: unknown };
function isZodError(err: unknown): err is { name: 'ZodError'; errors: unknown } {
  if (!err || typeof err !== 'object') return false;
  const e = err as ZodLike;
  return e.name === 'ZodError' && 'errors' in e;
}
