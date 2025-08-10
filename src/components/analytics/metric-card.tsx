import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  previousValue?: number;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  color?: "default" | "green" | "red" | "blue" | "yellow";
}

export function MetricCard({ 
  title, 
  value, 
  previousValue, 
  change, 
  icon: Icon, 
  trend = "neutral",
  color = "default" 
}: MetricCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400";
      case "red":
        return "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400";
      case "blue":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
      case "yellow":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600 dark:text-green-400";
      case "down":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-muted-foreground";
    }
  };

  const calculateChange = () => {
    if (!previousValue) return null;
    
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    const changePercent = ((numericValue - previousValue) / previousValue) * 100;
    return {
      value: Math.abs(changePercent).toFixed(1),
      isPositive: changePercent >= 0
    };
  };

  const changeData = change ? null : calculateChange();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className="text-3xl font-bold">{value}</p>
            
            {(change || changeData) && (
              <div className={`flex items-center space-x-1 text-sm ${getTrendColor(trend)}`}>
                {trend === "up" && <TrendingUp className="h-3 w-3" />}
                {trend === "down" && <TrendingDown className="h-3 w-3" />}
                <span>
                  {change || (changeData ? `${changeData.isPositive ? '+' : '-'}${changeData.value}%` : '')}
                </span>
                <span className="text-muted-foreground">from last period</span>
              </div>
            )}
          </div>
          
          <div className={`p-3 rounded-lg ${getColorClasses(color)}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}