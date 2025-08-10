import { MessageSquare, Users, FileText, BarChart3, Send, Smartphone } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <MessageSquare className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              TwilioMessage
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Modern SMS & RCS messaging platform for business. Send rich messages, manage contacts, and track performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <Send className="h-5 w-5" />
              Get Started
            </Link>
            <Link
              href="/features"
              className="border border-border px-8 py-3 rounded-lg font-semibold hover:bg-accent transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* RCS Showcase */}
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Rich Communication Services (RCS)</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Send interactive messages with images, buttons, carousels, and more. 
                Create engaging customer experiences that drive results.
              </p>
              <ul className="space-y-3">
                {rcsFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-full p-1">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-8 flex items-center justify-center">
              <div className="bg-card rounded-lg p-4 shadow-lg max-w-xs w-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary rounded-full p-2">
                    <Smartphone className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold">Your Business</div>
                    <div className="text-sm text-muted-foreground">Now</div>
                  </div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3 mb-3">
                  <p className="text-sm">Check out our new products! 🎉</p>
                  <div className="bg-primary/10 rounded mt-2 p-2">
                    <div className="text-xs font-medium">Featured Items</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded flex-1">
                    Shop Now
                  </button>
                  <button className="border border-border text-xs px-3 py-1 rounded flex-1">
                    Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: MessageSquare,
    title: "SMS & RCS Messaging",
    description: "Send both traditional SMS and rich RCS messages with media, buttons, and interactive elements."
  },
  {
    icon: Users,
    title: "Contact Management",
    description: "Organize and manage your contacts with tags, groups, and custom fields for targeted messaging."
  },
  {
    icon: FileText,
    title: "Message Templates",
    description: "Create and save reusable message templates with variables for personalized bulk messaging."
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track delivery rates, open rates, click-through rates, and engagement metrics."
  },
  {
    icon: Send,
    title: "Bulk Messaging",
    description: "Send messages to multiple recipients efficiently with scheduling and personalization."
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Fully responsive design that works perfectly on desktop, tablet, and mobile devices."
  }
];

const rcsFeatures = [
  { icon: MessageSquare, text: "Rich media messaging" },
  { icon: Users, text: "Interactive buttons and carousels" },
  { icon: BarChart3, text: "Read receipts and typing indicators" },
  { icon: FileText, text: "Branded messaging experience" }
];