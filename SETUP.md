# Twilio Messaging App Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Twilio Account
1. Go to [Twilio Console](https://console.twilio.com/)
2. Sign up or log in to your account
3. Buy a phone number (required for sending SMS)
4. Get your Account SID and Auth Token from the console

### 3. Configure Environment Variables
Update the `.env.local` file with your real Twilio credentials:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_actual_account_sid
TWILIO_AUTH_TOKEN=your_actual_auth_token  
TWILIO_PHONE_NUMBER=your_actual_twilio_phone_number
```

### 4. Set Up Database
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Application
```bash
npm run dev
```

Visit `http://localhost:3000` to access the dashboard.

## ✅ Features

- 📱 SMS messaging with Twilio integration
- 📇 Contact management
- 📝 Message templates with variables
- 📊 Analytics dashboard
- 🎨 Modern UI with dark/light themes
- 📱 Fully responsive design

## 🛠 Troubleshooting

### "From phone number is not a Twilio phone number"
- Make sure you've purchased a phone number from your Twilio console
- Verify the phone number in `.env.local` matches exactly what's in your Twilio console

### Messages not sending
- Check your Twilio account balance
- Ensure the recipient phone number is in E.164 format (e.g., +1234567890)
- For trial accounts, you can only send to verified phone numbers

### Build errors
- Run `npm run build` to check for TypeScript errors
- Run `npm run lint` to check for linting issues

## 📝 Notes

- This app uses Next.js 15 with the App Router
- Database is SQLite with Prisma ORM
- UI components from Radix UI and Tailwind CSS
- Real-time message status updates via Twilio webhooks