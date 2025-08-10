import { Card } from "@/components/ui/card";
import { MessageSquare, Users, Send, BarChart3, Clock, CheckCircle } from "lucide-react";
import { QuickSendForm } from "@/components/dashboard/quick-send-form";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatsCards } from "@/components/dashboard/stats-cards";

export default function DashboardPage() {
  return (
    <div className="space-y-4 md:space-y-6 max-w-full">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your messaging activity and quick actions.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Quick Send Form */}
        <div className="lg:col-span-2">
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Send className="h-5 w-5 text-primary" />
              <h2 className="text-lg md:text-xl font-semibold">Quick Send</h2>
            </div>
            <QuickSendForm />
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-lg md:text-xl font-semibold">Recent Activity</h2>
            </div>
            <RecentActivity />
          </Card>
        </div>
      </div>

      {/* Additional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Templates Card */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="text-base md:text-lg font-semibold mb-2 truncate">Message Templates</h3>
              <p className="text-xl md:text-2xl font-bold text-primary">12</p>
              <p className="text-xs md:text-sm text-muted-foreground">Active templates</p>
            </div>
            <div className="bg-primary/10 p-2 md:p-3 rounded-lg flex-shrink-0">
              <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
          </div>
        </Card>

        {/* Contacts Card */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="text-base md:text-lg font-semibold mb-2 truncate">Total Contacts</h3>
              <p className="text-xl md:text-2xl font-bold text-primary">1,234</p>
              <p className="text-xs md:text-sm text-muted-foreground">+12 this week</p>
            </div>
            <div className="bg-primary/10 p-2 md:p-3 rounded-lg flex-shrink-0">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
          </div>
        </Card>

        {/* Success Rate Card */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="text-base md:text-lg font-semibold mb-2 truncate">Success Rate</h3>
              <p className="text-xl md:text-2xl font-bold text-green-600">98.5%</p>
              <p className="text-xs md:text-sm text-muted-foreground">Last 30 days</p>
            </div>
            <div className="bg-green-100 p-2 md:p-3 rounded-lg flex-shrink-0">
              <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}