import twilio from 'twilio';

// Validate environment variables
function validateEnvVars() {
  const requiredVars = {
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      'Please check your .env.local file.'
    );
  }

  return requiredVars as { [K in keyof typeof requiredVars]: string };
}

// Initialize Twilio client with validation
const envVars = validateEnvVars();
const client = twilio(envVars.TWILIO_ACCOUNT_SID, envVars.TWILIO_AUTH_TOKEN);

export interface SMSMessage {
  to: string;
  body: string;
  from?: string;
  mediaUrl?: string[];
}

export interface RCSMessage {
  to: string;
  contentSid: string;
  contentVariables?: Record<string, string>;
  from?: string;
}

export interface MessageResponse {
  sid: string;
  status: string;
  to: string;
  from: string;
  body: string;
  dateCreated: Date;
  dateSent?: Date;
  errorCode?: string;
  errorMessage?: string;
}

export class TwilioService {
  private client = client;
  private defaultFrom = envVars.TWILIO_PHONE_NUMBER;

  // Send SMS message
  async sendSMS({
    to,
    body,
    from = this.defaultFrom,
    mediaUrl
  }: SMSMessage): Promise<MessageResponse> {
    try {
      // Let Twilio handle phone number validation
      const message = await this.client.messages.create({
        body,
        from,
        to,
        mediaUrl: mediaUrl?.length ? mediaUrl : undefined
      });

      return {
        sid: message.sid,
        status: message.status,
        to: message.to,
        from: message.from,
        body: message.body || '',
        dateCreated: message.dateCreated,
        dateSent: message.dateSent || undefined,
        errorCode: message.errorCode?.toString() || undefined,
        errorMessage: message.errorMessage || undefined
      };
    } catch (error: any) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  // Send RCS message using Content Templates
  async sendRCS({
    to,
    contentSid,
    contentVariables,
    from = this.defaultFrom
  }: RCSMessage): Promise<MessageResponse> {
    try {
      const message = await this.client.messages.create({
        contentSid,
        contentVariables: contentVariables ? JSON.stringify(contentVariables) : undefined,
        from,
        to
      });

      return {
        sid: message.sid,
        status: message.status,
        to: message.to,
        from: message.from,
        body: 'RCS Message', // RCS messages don't have traditional body
        dateCreated: message.dateCreated,
        dateSent: message.dateSent || undefined,
        errorCode: message.errorCode?.toString() || undefined,
        errorMessage: message.errorMessage || undefined
      };
    } catch (error: any) {
      throw new Error(`Failed to send RCS: ${error.message}`);
    }
  }

  // Get message status
  async getMessageStatus(messageSid: string): Promise<MessageResponse> {
    try {
      const message = await this.client.messages(messageSid).fetch();
      
      return {
        sid: message.sid,
        status: message.status,
        to: message.to,
        from: message.from,
        body: message.body || '',
        dateCreated: message.dateCreated,
        dateSent: message.dateSent || undefined,
        errorCode: message.errorCode?.toString() || undefined,
        errorMessage: message.errorMessage || undefined
      };
    } catch (error: any) {
      throw new Error(`Failed to get message status: ${error.message}`);
    }
  }

  // Send bulk SMS messages
  async sendBulkSMS(messages: SMSMessage[]): Promise<MessageResponse[]> {
    const results = await Promise.allSettled(
      messages.map(msg => this.sendSMS(msg))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          sid: `error-${index}`,
          status: 'failed',
          to: messages[index].to,
          from: messages[index].from || this.defaultFrom,
          body: messages[index].body,
          dateCreated: new Date(),
          errorMessage: result.reason.message
        };
      }
    });
  }

  // Create RCS Content Template
  async createContentTemplate(
    friendlyName: string,
    types: any,
    language: string = 'en'
  ) {
    try {
      const content = await this.client.content.v1.contents.create({
        friendly_name: friendlyName,
        types,
        language
      });

      return content;
    } catch (error: any) {
      throw new Error(`Failed to create content template: ${error.message}`);
    }
  }

  // List content templates
  async listContentTemplates() {
    try {
      const contents = await this.client.content.v1.contents.list();
      return contents;
    } catch (error: any) {
      throw new Error(`Failed to list content templates: ${error.message}`);
    }
  }

  // Validate phone number format
  static validatePhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }

  // Format phone number for display
  static formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
    
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    
    return phoneNumber;
  }
}

export const twilioService = new TwilioService();