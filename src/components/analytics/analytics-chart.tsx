"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ChartData {
  date: string;
  sent: number;
  delivered: number;
  failed: number;
  read: number;
}

interface AnalyticsChartProps {
  data: ChartData[];
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const [activeMetrics, setActiveMetrics] = useState({
    sent: true,
    delivered: true,
    failed: true,
    read: true,
  });

  const maxValue = Math.max(
    ...data.map(d => Math.max(d.sent, d.delivered, d.failed, d.read))
  );

  const toggleMetric = (metric: keyof typeof activeMetrics) => {
    setActiveMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  const getColor = (metric: string) => {
    const colors = {
      sent: "#3b82f6",    // blue
      delivered: "#22c55e", // green  
      failed: "#ef4444",   // red
      read: "#8b5cf6",     // purple
    };
    return colors[metric as keyof typeof colors];
  };

  const getHeight = (value: number) => {
    return (value / maxValue) * 200; // Max height of 200px
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(activeMetrics).map(([metric, isActive]) => (
          <Button
            key={metric}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => toggleMetric(metric as keyof typeof activeMetrics)}
            className="text-xs"
            style={isActive ? { backgroundColor: getColor(metric) } : {}}
          >
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: getColor(metric) }}
            />
            {metric.charAt(0).toUpperCase() + metric.slice(1)}
          </Button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative">
        <div className="flex items-end justify-between h-64 px-4 py-2 bg-muted/20 rounded-lg overflow-x-auto">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 min-w-0 flex-1">
              {/* Bars */}
              <div className="relative flex items-end space-x-1 h-52">
                {activeMetrics.sent && (
                  <div
                    className="w-3 rounded-t"
                    style={{
                      height: `${getHeight(item.sent)}px`,
                      backgroundColor: getColor("sent"),
                      opacity: 0.8
                    }}
                    title={`Sent: ${item.sent}`}
                  />
                )}
                {activeMetrics.delivered && (
                  <div
                    className="w-3 rounded-t"
                    style={{
                      height: `${getHeight(item.delivered)}px`,
                      backgroundColor: getColor("delivered"),
                      opacity: 0.8
                    }}
                    title={`Delivered: ${item.delivered}`}
                  />
                )}
                {activeMetrics.failed && (
                  <div
                    className="w-3 rounded-t"
                    style={{
                      height: `${getHeight(item.failed)}px`,
                      backgroundColor: getColor("failed"),
                      opacity: 0.8
                    }}
                    title={`Failed: ${item.failed}`}
                  />
                )}
                {activeMetrics.read && (
                  <div
                    className="w-3 rounded-t"
                    style={{
                      height: `${getHeight(item.read)}px`,
                      backgroundColor: getColor("read"),
                      opacity: 0.8
                    }}
                    title={`Read: ${item.read}`}
                  />
                )}
              </div>

              {/* Date Label */}
              <div className="text-xs text-muted-foreground text-center whitespace-nowrap">
                {item.date}
              </div>
            </div>
          ))}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-52 flex flex-col justify-between text-xs text-muted-foreground">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-lg font-semibold text-blue-600">
            {data.reduce((sum, item) => sum + item.sent, 0).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Total Sent</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-lg font-semibold text-green-600">
            {data.reduce((sum, item) => sum + item.delivered, 0).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Total Delivered</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-lg font-semibold text-purple-600">
            {data.reduce((sum, item) => sum + item.read, 0).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Total Read</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-lg font-semibold text-red-600">
            {data.reduce((sum, item) => sum + item.failed, 0).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Total Failed</div>
        </div>
      </div>
    </div>
  );
}