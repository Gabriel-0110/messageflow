import { NextRequest, NextResponse } from 'next/server';
import { twilioService, TwilioService } from '@/lib/twilio';
import { z } from 'zod';

const sendSMSSchema = z.object({
  to: z.string().min(10, 'Phone number is required'),
  body: z.string().min(1, 'Message body is required'),
  from: z.string().optional(),
  mediaUrl: z.array(z.string().url()).optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, body: messageBody, from, mediaUrl } = sendSMSSchema.parse(body);

    // Let Twilio handle phone number validation server-side
    const result = await twilioService.sendSMS({
      to,
      body: messageBody,
      from,
      mediaUrl
    });

    return NextResponse.json({
      success: true,
      message: 'SMS sent successfully',
      data: result
    });

  } catch (error: any) {
    console.error('SMS sending error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send SMS', details: error.message },
      { status: 500 }
    );
  }
}