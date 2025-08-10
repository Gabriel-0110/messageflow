import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TwilioService } from '@/lib/twilio';

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['createdAt', 'firstName', 'lastName']).optional().default('createdAt'),
  sortDir: z.enum(['asc', 'desc']).optional().default('desc'),
  name: z.string().optional(),
  phone: z.string().optional(),
  tags: z.string().optional(), // comma-separated
});

const upsertSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().refine(TwilioService.validatePhoneNumber, {
    message: 'Phone number must be in E.164 format',
  }),
  email: z.string().email().optional().or(z.literal('')).transform(v => (v === '' ? undefined : v)),
  tags: z.array(z.string()).optional().default([]),
  customFields: z.record(z.string()).optional().default({}),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = user.id;

    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const q = querySchema.parse(params);

    type Where = {
      userId: string;
      OR?: Array<{ firstName?: { contains: string; mode: 'insensitive' }; lastName?: { contains: string; mode: 'insensitive' } }>;
      phoneNumber?: { contains: string };
      tags?: { contains: string };
    };
    const where: Where = { userId };
    if (q.name) {
      where.OR = [
        { firstName: { contains: q.name, mode: 'insensitive' } },
        { lastName: { contains: q.name, mode: 'insensitive' } },
      ];
    }
    if (q.phone) where.phoneNumber = { contains: q.phone };
    if (q.tags) where.tags = { contains: q.tags.split(',').map(t => t.trim()).filter(Boolean)[0] ?? '' };

    const total = await prisma.contact.count({ where });
    const data = await prisma.contact.findMany({
      where,
      orderBy: { [q.sortBy!]: q.sortDir },
      skip: (q.page - 1) * q.pageSize,
      take: q.pageSize,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        email: true,
        tags: true,
        customFields: true,
        createdAt: true,
      },
    });

    const normalized = data.map((c) => ({
      ...c,
      tags: safeParseJsonArray(c.tags),
      customFields: safeParseJsonObject(c.customFields),
    }));
    return NextResponse.json({ success: true, data: normalized, page: q.page, pageSize: q.pageSize, total });
  } catch (err) {
    if (isZodError(err)) {
      return NextResponse.json({ error: 'Invalid query', details: err.errors }, { status: 400 });
    }
    console.error('Contacts GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = user.id;

    const json = await request.json();
    const body = upsertSchema.parse(json);

    // Deduplicate per user by phone number
    const existing = await prisma.contact.findFirst({ where: { userId, phoneNumber: body.phoneNumber } });
    if (existing) {
      const normalizedExisting = {
        ...existing,
        tags: safeParseJsonArray(existing.tags),
        customFields: safeParseJsonObject(existing.customFields),
      };
      return NextResponse.json({ success: true, data: normalizedExisting, message: 'Contact already exists' }, { status: 200 });
    }

    const created = await prisma.contact.create({
      data: {
        userId,
        firstName: body.firstName,
        lastName: body.lastName,
        phoneNumber: body.phoneNumber,
        email: body.email,
        tags: JSON.stringify(body.tags ?? []),
        customFields: JSON.stringify(body.customFields ?? {}),
      },
      select: { id: true, firstName: true, lastName: true, phoneNumber: true, email: true, tags: true, customFields: true, createdAt: true },
    });

    const normalizedCreated = {
      ...created,
      tags: safeParseJsonArray(created.tags),
      customFields: safeParseJsonObject(created.customFields),
    };
    return NextResponse.json({ success: true, data: normalizedCreated });
  } catch (err) {
    if (isZodError(err)) {
      return NextResponse.json({ error: 'Invalid request data', details: err.errors }, { status: 400 });
    }
    console.error('Contacts POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function safeParseJsonArray(value: string | null): string[] {
  try {
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeParseJsonObject(value: string | null): Record<string, string> {
  try {
    const parsed = value ? JSON.parse(value) : {};
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

type ZodLike = { name: string; errors?: unknown };
function isZodError(err: unknown): err is { name: 'ZodError'; errors: unknown } {
  if (!err || typeof err !== 'object') return false;
  const e = err as ZodLike;
  return e.name === 'ZodError' && 'errors' in e;
}
