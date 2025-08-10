import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Map Twilio status to database status
function mapTwilioStatusToDb(twilioStatus: string | null): string {
  switch (twilioStatus) {
    case 'sent':
      return 'sent';
    case 'delivered':
      return 'delivered';
    case 'failed':
    case 'undelivered':
      return 'failed';
    case 'read':
      return 'read';
    default:
      return 'pending';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);

    // Extract Twilio webhook data
    const webhookData = {
      messageSid: params.get('MessageSid'),
      messageStatus: params.get('MessageStatus'),
      to: params.get('To'),
      from: params.get('From'),
      body: params.get('Body'),
      errorCode: params.get('ErrorCode'),
      errorMessage: params.get('ErrorMessage'),
      timestamp: new Date().toISOString()
    };

    console.log('Twilio webhook received:', webhookData);

    // Update message status in database
    if (webhookData.messageSid) {
      try {
        const updateData: any = {
          status: mapTwilioStatusToDb(webhookData.messageStatus),
          updatedAt: new Date()
        };

        // Add timestamp based on status
        switch (webhookData.messageStatus) {
          case 'sent':
            updateData.sentAt = new Date();
            break;
          case 'delivered':
            updateData.deliveredAt = new Date();
            break;
          case 'read':
            updateData.readAt = new Date();
            break;
          case 'failed':
          case 'undelivered':
            updateData.errorMessage = webhookData.errorMessage || 'Message delivery failed';
            break;
        }

        await prisma.message.updateMany({
          where: { twilioSid: webhookData.messageSid },
          data: updateData
        });

        console.log(`Updated message ${webhookData.messageSid} status to ${webhookData.messageStatus}`);
      } catch (dbError) {
        console.error('Database update error:', dbError);
        // Continue processing even if DB update fails
      }
    }

    // Handle different message statuses
    switch (webhookData.messageStatus) {
      case 'sent':
        console.log(`Message ${webhookData.messageSid} was sent`);
        break;
      case 'delivered':
        console.log(`Message ${webhookData.messageSid} was delivered`);
        break;
      case 'failed':
        console.log(`Message ${webhookData.messageSid} failed: ${webhookData.errorMessage}`);
        break;
      case 'undelivered':
        console.log(`Message ${webhookData.messageSid} was undelivered`);
        break;
      case 'read':
        console.log(`Message ${webhookData.messageSid} was read`);
        break;
      default:
        console.log(`Unknown status for message ${webhookData.messageSid}: ${webhookData.messageStatus}`);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

// Handle incoming messages
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Twilio webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}