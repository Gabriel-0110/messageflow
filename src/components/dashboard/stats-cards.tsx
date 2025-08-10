import { Card } from "@/components/ui/card";
import { MessageSquare, Send, TrendingUp, AlertTriangle } from "lucide-react";

export function StatsCards() {
  const stats = [
    {
      title: "Total Messages",
      value: "2,847",
      change: "+12%",
      changeType: "positive" as const,
      icon: MessageSquare,
    },
    {
      title: "Messages Sent",
      value: "2,134",
      change: "+8%",
      changeType: "positive" as const,
      icon: Send,
    },
    {
      title: "Delivery Rate",
      value: "98.5%",
      change: "+0.5%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "Failed Messages",
      value: "23",
      change: "-5%",
      changeType: "negative" as const,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2 min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">
                {stat.title}
              </p>
              <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
              <div className="flex items-center space-x-1">
                <span
                  className={`text-xs font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  from last month
                </span>
              </div>
            </div>
            <div className="bg-primary/10 p-2 md:p-3 rounded-lg flex-shrink-0">
              <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}