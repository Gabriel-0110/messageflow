"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  Users, 
  CheckCircle,
  XCircle,
  Eye,
  Download
} from "lucide-react";
import { AnalyticsChart } from "@/components/analytics/analytics-chart";
import { MetricCard } from "@/components/analytics/metric-card";
import { RecentMessages } from "@/components/analytics/recent-messages";
import { useState } from "react";

// Mock analytics data
const mockData = {
  overview: {
    totalMessages: 15847,
    totalMessagesPrevious: 14523,
    sentMessages: 15234,
    sentMessagesPrevious: 14100,
    deliveredMessages: 14986,
    deliveredMessagesPrevious: 13845,
    readMessages: 12543,
    readMessagesPrevious: 11234,
    failedMessages: 248,
    failedMessagesPrevious: 423,
    deliveryRate: 98.4,
    deliveryRatePrevious: 97.8,
    readRate: 83.7,
    readRatePrevious: 79.6,
  },
  chartData: [
    { date: "Jan 1", sent: 245, delivered: 241, failed: 4, read: 198 },
    { date: "Jan 2", sent: 312, delivered: 308, failed: 4, read: 267 },
    { date: "Jan 3", sent: 189, delivered: 186, failed: 3, read: 145 },
    { date: "Jan 4", sent: 423, delivered: 418, failed: 5, read: 356 },
    { date: "Jan 5", sent: 367, delivered: 361, failed: 6, read: 298 },
    { date: "Jan 6", sent: 294, delivered: 289, failed: 5, read: 234 },
    { date: "Jan 7", sent: 445, delivered: 441, failed: 4, read: 378 },
    { date: "Jan 8", sent: 512, delivered: 506, failed: 6, read: 445 },
    { date: "Jan 9", sent: 378, delivered: 372, failed: 6, read: 312 },
    { date: "Jan 10", sent: 289, delivered: 285, failed: 4, read: 223 },
    { date: "Jan 11", sent: 334, delivered: 330, failed: 4, read: 278 },
    { date: "Jan 12", sent: 456, delivered: 451, failed: 5, read: 389 },
    { date: "Jan 13", sent: 523, delivered: 518, failed: 5, read: 467 },
    { date: "Jan 14", sent: 398, delivered: 394, failed: 4, read: 334 },
  ],
  topTemplates: [
    { name: "Welcome Message", usage: 1234, deliveryRate: 99.2 },
    { name: "Order Confirmation", usage: 987, deliveryRate: 98.8 },
    { name: "Appointment Reminder", usage: 756, deliveryRate: 97.4 },
    { name: "Promotional Offer", usage: 543, deliveryRate: 96.1 },
    { name: "Payment Reminder", usage: 432, deliveryRate: 95.7 },
  ],
  deviceTypes: [
    { type: "iOS", percentage: 52 },
    { type: "Android", percentage: 45 },
    { type: "Other", percentage: 3 },
  ]
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [messageType, setMessageType] = useState("all");

  const calculatePercentageChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0
    };
  };

  const deliveryRateChange = calculatePercentageChange(
    mockData.overview.deliveryRate,
    mockData.overview.deliveryRatePrevious
  );

  const readRateChange = calculatePercentageChange(
    mockData.overview.readRate,
    mockData.overview.readRatePrevious
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your messaging performance and engagement metrics.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={messageType} onValueChange={setMessageType}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sms">SMS Only</SelectItem>
              <SelectItem value="rcs">RCS Only</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Messages"
          value={mockData.overview.totalMessages.toLocaleString()}
          previousValue={mockData.overview.totalMessagesPrevious}
          icon={MessageSquare}
          trend="up"
        />
        <MetricCard
          title="Delivery Rate"
          value={`${mockData.overview.deliveryRate}%`}
          change={`${deliveryRateChange.isPositive ? '+' : '-'}${deliveryRateChange.value}%`}
          icon={CheckCircle}
          trend={deliveryRateChange.isPositive ? "up" : "down"}
          color="green"
        />
        <MetricCard
          title="Read Rate"
          value={`${mockData.overview.readRate}%`}
          change={`${readRateChange.isPositive ? '+' : '-'}${readRateChange.value}%`}
          icon={Eye}
          trend={readRateChange.isPositive ? "up" : "down"}
          color="blue"
        />
        <MetricCard
          title="Failed Messages"
          value={mockData.overview.failedMessages.toLocaleString()}
          previousValue={mockData.overview.failedMessagesPrevious}
          icon={XCircle}
          trend="down"
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Message Performance Over Time</span>
              </CardTitle>
              <CardDescription>
                Track your daily message volume and delivery performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsChart data={mockData.chartData} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Top Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Top Templates</CardTitle>
              <CardDescription>Most used message templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.topTemplates.map((template, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{template.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {template.usage} uses
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {template.deliveryRate}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Device Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Device Types</CardTitle>
              <CardDescription>Message delivery by device</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.deviceTypes.map((device) => (
                <div key={device.type} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{device.type}</span>
                    <span>{device.percentage}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Message Status Breakdown</CardTitle>
            <CardDescription>Current period vs previous period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Sent</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {mockData.overview.sentMessages.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    vs {mockData.overview.sentMessagesPrevious.toLocaleString()} previous
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Delivered</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {mockData.overview.deliveredMessages.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    vs {mockData.overview.deliveredMessagesPrevious.toLocaleString()} previous
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Read</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {mockData.overview.readMessages.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    vs {mockData.overview.readMessagesPrevious.toLocaleString()} previous
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Failed</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {mockData.overview.failedMessages.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    vs {mockData.overview.failedMessagesPrevious.toLocaleString()} previous
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <RecentMessages />
      </div>
    </div>
  );
}