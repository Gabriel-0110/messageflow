import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

// Mock recent messages data
const recentMessages = [
  {
    id: "1",
    recipient: "+1234567890",
    content: "Welcome to our service! Thanks for signing up.",
    status: "delivered",
    type: "sms",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    template: "Welcome Message"
  },
  {
    id: "2",
    recipient: "+1987654321",
    content: "Your order #12345 has been shipped!",
    status: "read",
    type: "rcs",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    template: "Order Update"
  },
  {
    id: "3",
    recipient: "+1122334455",
    content: "Reminder: Your appointment is tomorrow at 2 PM.",
    status: "delivered",
    type: "sms",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    template: "Appointment Reminder"
  },
  {
    id: "4",
    recipient: "+1555666777",
    content: "Special offer: 20% off your next purchase!",
    status: "failed",
    type: "sms",
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    template: "Promotional Offer"
  },
  {
    id: "5",
    recipient: "+1999888777",
    content: "Payment reminder: Your invoice is due tomorrow.",
    status: "sent",
    type: "sms",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    template: "Payment Reminder"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "read":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "sent":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getTypeColor = (type: string) => {
  return type === "rcs" 
    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
    : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
};

const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
};

export function RecentMessages() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Message Activity</CardTitle>
        <CardDescription>Latest messages sent through your campaigns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentMessages.map((message) => (
          <div key={message.id} className="flex items-start space-x-3 p-3 rounded-lg border">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {message.type === "rcs" ? "📱" : "💬"}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">
                    {formatPhoneNumber(message.recipient)}
                  </p>
                  <Badge variant="outline" className={`text-xs ${getTypeColor(message.type)}`}>
                    {message.type.toUpperCase()}
                  </Badge>
                </div>
                <Badge variant="secondary" className={`text-xs ${getStatusColor(message.status)}`}>
                  {message.status}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {message.content}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">
                  Template: {message.template}
                </span>
                <span>
                  {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {recentMessages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-sm text-muted-foreground">
              No recent message activity to display
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}