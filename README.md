# MessageFlow - Modern SMS & RCS Messaging Platform

> 🚧 **This project is currently under active development** - Some features are still being implemented

A beautiful, modern web application for business messaging that serves as a comprehensive alternative to traditional RCS messaging platforms. Built with cutting-edge technologies including Next.js 15, TypeScript, Tailwind CSS, and Prisma ORM, this platform provides businesses with a powerful solution for customer communication.

## 🎯 Purpose & Vision

MessageFlow was created as a **modern alternative to RCS messaging** platforms, providing businesses with:
- **Enhanced messaging capabilities** beyond traditional SMS limitations
- **Rich interactive features** without requiring carrier RCS support
- **Complete control** over messaging infrastructure and data
- **Cost-effective solution** for businesses of all sizes
- **Developer-friendly** architecture for custom integrations

Perfect for **portfolio demonstrations** and **production business use**.

## Features

### ✨ Core Features
- **SMS & RCS Messaging** - Send both traditional SMS and rich RCS messages
- **Contact Management** - Organize contacts with tags, groups, and custom fields
- **Message Templates** - Create reusable templates with dynamic variables
- **Campaign Management** - Send bulk messages to targeted contact groups
- **Real-time Analytics** - Track delivery rates, read rates, and engagement
- **Webhook Integration** - Real-time status updates and delivery receipts

### 🎨 Modern UI/UX
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme** - Toggle between themes with smooth transitions
- **Beautiful Components** - Built with Radix UI and Tailwind CSS
- **Interactive Dashboard** - Real-time metrics and visualizations
- **Mobile-First** - Optimized for mobile messaging workflows

### 🚀 Advanced Capabilities
- **RCS Rich Features** - Interactive buttons, carousels, and media
- **Template Variables** - Dynamic personalization with {{variable}} syntax
- **Bulk Messaging** - Send to thousands with queue management
- **Message Scheduling** - Schedule messages for optimal delivery times
- **Contact Segmentation** - Target specific groups with advanced filtering
- **Analytics Dashboard** - Track performance with detailed metrics

## 🚧 Development Status

This project showcases modern web development practices and serves as a comprehensive portfolio piece. Current implementation status:

### ✅ Completed
- **Modern UI/UX Design** - Fully responsive with dark/light themes
- **Component Architecture** - Professional React components with TypeScript
- **Database Schema** - Complete Prisma schema with all necessary models  
- **Twilio Integration** - Basic SMS sending functionality
- **API Structure** - RESTful endpoints for core features
- **Professional Layout** - Dashboard, sidebar navigation, and responsive design

### 🔄 In Progress  
- **Authentication System** - User registration and login
- **Database Integration** - Connecting frontend to Prisma backend
- **Contact Management** - CRUD operations with database persistence
- **Template System** - Dynamic template creation and management
- **Campaign Features** - Bulk messaging and scheduling

### 📋 Planned Features
- **RCS Rich Messaging** - Interactive buttons, carousels, and media
- **Advanced Analytics** - Real-time reporting and engagement metrics
- **Webhook Integration** - Message status updates and delivery tracking
- **Enterprise Features** - Role-based access, team management, API limits

This project demonstrates **full-stack development capabilities** with modern technologies and professional code organization.

## Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- Twilio Account with SMS/RCS enabled
- SQLite (included) or PostgreSQL for production

### 1. Clone & Install
```bash
git clone https://github.com/Gabriel-0110/messageflow.git
cd messageflow
npm install
```

### 2. Environment Setup
Copy the example environment file and configure your credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your Twilio credentials:

```env
# Twilio Configuration (Get from https://console.twilio.com/)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here  
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secure_secret_here

# App Configuration
APP_NAME="MessageFlow"
APP_URL=http://localhost:3000
```

> ⚠️ **Important**: Never commit your `.env.local` file with real credentials

### 3. Database Setup
```bash
npx prisma generate
npx prisma db push
npx prisma db seed  # Optional: seed with sample data
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Twilio Setup

### 1. Create Twilio Account
1. Sign up at [Twilio Console](https://console.twilio.com/)
2. Get your Account SID and Auth Token
3. Purchase a phone number with SMS/RCS capabilities

### 2. Configure Webhooks
Set up webhooks in Twilio Console:
- **Webhook URL**: `https://yourdomain.com/api/twilio/webhook`
- **HTTP Method**: POST
- **Events**: Message Status, Incoming Messages

### 3. RCS Setup (Optional)
1. Apply for RCS access in Twilio Console
2. Create RCS Content Templates
3. Configure rich messaging features

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard pages
│   │   ├── page.tsx      # Main dashboard
│   │   ├── contacts/     # Contact management
│   │   ├── templates/    # Message templates
│   │   └── analytics/    # Analytics dashboard
│   └── api/              # API routes
│       └── twilio/       # Twilio integration
├── components/            # React components
│   ├── ui/               # Base UI components (Radix + Tailwind)
│   ├── dashboard/        # Dashboard-specific components
│   ├── contacts/         # Contact management components
│   ├── templates/        # Template components
│   └── analytics/        # Analytics components
├── lib/                  # Utilities and configurations
│   ├── twilio.ts        # Twilio service integration
│   ├── prisma.ts        # Database client
│   └── utils.ts         # Common utilities
├── types/               # TypeScript type definitions
└── hooks/              # Custom React hooks
```

## API Endpoints

### Twilio Integration
- `POST /api/twilio/send-sms` - Send SMS message
- `POST /api/twilio/send-rcs` - Send RCS message
- `POST /api/twilio/webhook` - Handle delivery status webhooks

### Contact Management
- `GET /api/contacts` - List contacts
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Template Management
- `GET /api/templates` - List templates
- `POST /api/templates` - Create template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template

## Database Schema

Built with Prisma ORM supporting SQLite (development) and PostgreSQL (production):

- **Users** - User accounts and authentication
- **Contacts** - Contact information with custom fields
- **MessageTemplates** - Reusable message templates
- **Messages** - Individual message records
- **Campaigns** - Bulk messaging campaigns
- **Analytics** - Message performance data

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically on push

### Docker
```bash
docker build -t messageflow .
docker run -p 3000:3000 messageflow
```

### Manual Deployment
1. Build the application: `npm run build`
2. Start production server: `npm run start`
3. Configure reverse proxy (nginx/Apache)

## Configuration

### Twilio Features
- **SMS Capabilities**: Standard text messaging
- **RCS Features**: Rich cards, buttons, carousels
- **Media Messages**: Images, videos, documents
- **Message Status**: Real-time delivery tracking
- **Two-way Messaging**: Handle incoming messages

### Customization
- **Branding**: Update colors, logos, and styling
- **Templates**: Create custom message templates
- **Workflows**: Add custom business logic
- **Integrations**: Connect with CRM systems

## 🛠 Tech Stack

**Frontend:**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Lucide React** - Beautiful icons

**Backend:**
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database access
- **SQLite/PostgreSQL** - Database options
- **Twilio SDK** - Messaging infrastructure

**Development:**
- **ESLint & Prettier** - Code formatting
- **Husky** - Git hooks
- **TypeScript** - Static type checking

## Contributing

This is a portfolio project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`  
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📫 Contact

For questions about this project or collaboration opportunities:

- 🐛 **Issues**: [GitHub Issues](https://github.com/Gabriel-0110/messageflow/issues)
- 💼 **LinkedIn**: [Gabriel Chiappa LinkedIn Profile](https://www.linkedin.com/in/chiappagabe/)
- 📧 **Email**: gabriel.chiappa@outlook.com

## Acknowledgments

- [Twilio](https://twilio.com) for messaging infrastructure
- [Next.js](https://nextjs.org) for the React framework  
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Radix UI](https://radix-ui.com) for accessible components
- [Prisma](https://prisma.io) for database management

---

**🚀 Built as a modern alternative to RCS messaging platforms**

This project showcases full-stack development capabilities with cutting-edge technologies. Perfect for portfolio demonstrations and real-world business messaging needs.

*Developed with ❤️ for modern business communication*
