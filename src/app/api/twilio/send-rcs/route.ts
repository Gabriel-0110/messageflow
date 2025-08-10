import { NextRequest, NextResponse } from 'next/server';
import { twilioService, TwilioService } from '@/lib/twilio';
import { z } from 'zod';

const sendRCSSchema = z.object({
  to: z.string().min(10, 'Phone number is required'),
  contentSid: z.string().min(1, 'Content SID is required'),
  contentVariables: z.record(z.string()).optional(),
  from: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, contentSid, contentVariables, from } = sendRCSSchema.parse(body);

    // Validate phone number format
    if (!TwilioService.validatePhoneNumber(to)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Use E.164 format (e.g., +1234567890)' },
        { status: 400 }
      );
    }

    const result = await twilioService.sendRCS({
      to,
      contentSid,
      contentVariables,
      from
    });

    return NextResponse.json({
      success: true,
      message: 'RCS message sent successfully',
      data: result
    });

  } catch (error: any) {
    console.error('RCS sending error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send RCS message', details: error.message },
      { status: 500 }
    );
  }
}