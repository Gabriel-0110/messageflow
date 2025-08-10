import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

// Mock data for recent activity
const recentActivity = [
  {
    id: "1",
    type: "message_sent",
    contact: { name: "John Doe", phone: "+1234567890" },
    message: "Thanks for your order!",
    status: "delivered",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: "2",
    type: "message_sent", 
    contact: { name: "Jane Smith", phone: "+1987654321" },
    message: "Your appointment is confirmed for tomorrow at 2 PM.",
    status: "read",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
  },
  {
    id: "3",
    type: "message_failed",
    contact: { name: "Bob Johnson", phone: "+1122334455" },
    message: "Limited time offer - 50% off!",
    status: "failed",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "4",
    type: "contact_added",
    contact: { name: "Alice Brown", phone: "+1555666777" },
    message: "New contact added to your list",
    status: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "read":
      return "bg-blue-100 text-blue-800";
    case "failed":
      return "bg-red-100 text-red-800";
    case "success":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "message_sent":
      return "📤";
    case "message_failed":
      return "❌";
    case "contact_added":
      return "👤";
    default:
      return "📋";
  }
};

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {recentActivity.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {getActivityIcon(activity.type)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                {activity.contact.name}
              </p>
              <Badge
                variant="secondary"
                className={`text-xs ${getStatusColor(activity.status)}`}
              >
                {activity.status}
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground mt-1">
              {activity.contact.phone}
            </p>
            
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {activity.message}
            </p>
            
            <p className="text-xs text-muted-foreground mt-2">
              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
      
      {recentActivity.length === 0 && (
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            No recent activity to show
          </p>
        </div>
      )}
    </div>
  );
}