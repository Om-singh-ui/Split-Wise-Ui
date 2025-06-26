"use client";

import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { BarLoader } from "react-spinners";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  Users,
  TrendingUp,
  Wallet,
  CreditCard,
  Search,
  Download,
  Settings,
  Bell,
  Calendar,
  DollarSign,
  Activity,
  BarChart3,
  Target,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingDown,
  RefreshCw,
  Eye,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { ExpenseSummary } from "./components/expense-summary";
import { BalanceSummary } from "./components/balance-summary";
import { GroupList } from "./components/group-list";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Format INR currency
const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

// Enhanced StatCard with dark theme
const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  trend,
  color,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="group"
  >
    <Card className="bg-gray-900 backdrop-blur-xl border border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] rounded-2xl overflow-hidden relative">
      {/* Neon glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-600/10 rounded-2xl opacity-30" />

      <div className="relative z-10">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
                {title}
              </p>
              <p className="text-2xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
                {value}
              </p>
              {change && (
                <div
                  className={cn(
                    "flex items-center text-xs font-medium",
                    trend === "up"
                      ? "text-emerald-400"
                      : trend === "down"
                        ? "text-rose-500"
                        : "text-cyan-400"
                  )}
                >
                  {trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : trend === "down" ? (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  ) : (
                    <Activity className="h-3 w-3 mr-1" />
                  )}
                  {change}
                </div>
              )}
            </div>
            <div
              className={cn(
                "p-2 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                trend === "up"
                  ? "bg-emerald-900/50"
                  : trend === "down"
                    ? "bg-rose-900/50"
                    : "bg-cyan-900/50"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  trend === "up"
                    ? "text-emerald-400"
                    : trend === "down"
                      ? "text-rose-400"
                      : "text-cyan-400"
                )}
              />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  </motion.div>
);

const QuickActionButton = ({
  icon: Icon,
  label,
  href,
  color = "blue",
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
  >
    <Button
      asChild
      variant="ghost"
      className="h-auto p-3 flex-col space-y-2 hover:scale-105 transition-all duration-300 group bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 shadow-lg hover:shadow-xl hover:bg-gray-700/80"
    >
      <Link href={href}>
        <Icon
          className={`h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-${color}-400`}
        />
        <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
          {label}
        </span>
      </Link>
    </Button>
  </motion.div>
);

const ActivityItem = ({ type, description, amount, time, status }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-800 transition-colors duration-200 group border border-gray-700"
  >
    <div className="flex items-center space-x-3">
      <div
        className={cn(
          "p-2 rounded-lg",
          status === "completed"
            ? "bg-emerald-900/50"
            : status === "pending"
              ? "bg-amber-900/50"
              : "bg-gray-800"
        )}
      >
        {status === "completed" ? (
          <CheckCircle className="h-4 w-4 text-emerald-400" />
        ) : status === "pending" ? (
          <Clock className="h-4 w-4 text-amber-400" />
        ) : (
          <AlertCircle className="h-4 w-4 text-gray-400" />
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-200 group-hover:text-white">
          {description}
        </p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-semibold text-gray-200">{amount}</p>
      <Badge
        variant={status === "completed" ? "default" : "secondary"}
        className={cn(
          "text-xs",
          status === "completed"
            ? "bg-emerald-900/60 text-emerald-400"
            : "bg-gray-800 text-gray-400"
        )}
      >
        {status}
      </Badge>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data: balances, isLoading: balancesLoading } = useConvexQuery(
    api.dashboard.getUserBalances
  );
  const { data: groups, isLoading: groupsLoading } = useConvexQuery(
    api.dashboard.getUserGroups
  );
  const { data: totalSpent, isLoading: totalSpentLoading } = useConvexQuery(
    api.dashboard.getTotalSpent
  );
  const { data: monthlySpending, isLoading: monthlySpendingLoading } =
    useConvexQuery(api.dashboard.getMonthlySpending);

  const isLoading =
    balancesLoading ||
    groupsLoading ||
    totalSpentLoading ||
    monthlySpendingLoading;

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Actual page refresh functionality
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 100); // Small delay to show spinner before reload
  };

  // Mock data for professional dashboard
  const recentActivities = [
    {
      type: "expense",
      description: "Dinner at Restaurant",
      amount: "₹2,500",
      time: "2 hours ago",
      status: "completed",
    },
    {
      type: "settlement",
      description: "Settled with John",
      amount: "₹1,200",
      time: "5 hours ago",
      status: "completed",
    },
    {
      type: "expense",
      description: "Grocery Shopping",
      amount: "₹850",
      time: "1 day ago",
      status: "pending",
    },
    {
      type: "group",
      description: "Added to Trip Group",
      amount: "₹0",
      time: "2 days ago",
      status: "completed",
    },
  ];

  const upcomingPayments = [
    { name: "Sarah", amount: "₹1,500", dueDate: "Today", priority: "high" },
    { name: "Mike", amount: "₹800", dueDate: "Tomorrow", priority: "medium" },
    { name: "Lisa", amount: "₹300", dueDate: "In 3 days", priority: "low" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-cyan-900/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Enhanced Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 md:px-8 py-5 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                  <div className="relative bg-gray-800/80 backdrop-blur-sm p-3 rounded-2xl border border-gray-700 shadow-xl">
                    <BarChart3 className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Sparkles className="w-4 h-4" />
                    <p className="text-sm font-medium">
                      {currentTime.toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 backdrop-blur-sm rounded-xl"
              >
                <RefreshCw
                  className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")}
                />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 md:px-8 space-y-8 relative z-10">
        {isLoading ? (
          <div className="w-full py-24 flex justify-center">
            <div className="flex flex-col items-center space-y-4">
              <BarLoader width={200} color="#0ea5e9" />
              <p className="text-gray-400 text-sm">Loading your dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard
                title="Total Balance"
                value={
                  balances?.totalBalance > 0
                    ? `+${formatINR(balances.totalBalance)}`
                    : balances?.totalBalance < 0
                      ? `-${formatINR(Math.abs(balances.totalBalance))}`
                      : formatINR(0)
                }
                change={
                  balances?.totalBalance !== 0 ? "vs last month" : "All settled"
                }
                icon={Wallet}
                trend={
                  balances?.totalBalance > 0
                    ? "up"
                    : balances?.totalBalance < 0
                      ? "down"
                      : "neutral"
                }
                delay={0}
              />

              <StatCard
                title="Monthly Spending"
                value={formatINR(totalSpent || 0)}
                change="+12% from last month"
                icon={TrendingUp}
                trend="up"
                delay={0.1}
              />

              <StatCard
                title="Active Groups"
                value={groups?.length || 0}
                change="2 new this week"
                icon={Users}
                trend="up"
                delay={0.2}
              />

              <StatCard
                title="Pending Settlements"
                value={balances?.oweDetails?.youOwe?.length || 0}
                change="3 due today"
                icon={Clock}
                trend="neutral"
                delay={0.3}
              />
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="shadow-2xl border border-gray-800 bg-gray-900/80 backdrop-blur-xl rounded-2xl overflow-hidden relative">
                {/* Neon glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-600/10 rounded-2xl opacity-30" />

                <div className="relative z-10">
                  <CardHeader className="pb-5 pt-7 px-7">
                    <CardTitle className="text-xl font-bold text-gray-200 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      Quick Actions
                    </CardTitle>
                    <p className="text-gray-400 mt-1">
                      Frequently used actions for managing expenses
                    </p>
                  </CardHeader>
                  <CardContent className="px-7 pb-7">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      <QuickActionButton
                        icon={PlusCircle}
                        label="Add Expense"
                        href="/expenses/new"
                        color="emerald"
                        delay={0}
                      />
                      <QuickActionButton
                        icon={Users}
                        label="Create Group"
                        href="/contacts?createGroup=true"
                        color="purple"
                        delay={0.1}
                      />
                      <QuickActionButton
                        icon={DollarSign}
                        label="Settle Up"
                        href="/settlements"
                        color="cyan"
                        delay={0.2}
                      />
                      <QuickActionButton
                        icon={BarChart3}
                        label="Analytics"
                        href="/dashboard"
                        color="blue"
                        delay={0.3}
                      />
                      <QuickActionButton
                        icon={Download}
                        label="Export"
                        href="/dashboard"
                        color="amber"
                        delay={0.4}
                      />
                      <QuickActionButton
                        icon={Calendar}
                        label="Schedule"
                        href="/dashboard"
                        color="rose"
                        delay={0.5}
                      />
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
              {/* Left Column: Charts and Analytics */}
              <div className="lg:col-span-2 space-y-7">
                {/* Expense Overview */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Card className="shadow-2xl border border-gray-800 bg-gray-900/80 backdrop-blur-xl rounded-2xl overflow-hidden relative">
                    {/* Neon glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-600/10 rounded-2xl opacity-30" />

                    <div className="relative z-10">
                      <CardHeader className="border-b border-gray-800 pb-5 pt-7 px-7">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20">
                              <BarChart3 className="h-5 w-5 text-emerald-400" />
                            </div>
                            <CardTitle className="text-lg font-semibold text-gray-200">
                              Expense Analytics
                            </CardTitle>
                          </div>
                          <div className="flex items-center space-x-2">
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-7">
                        <ExpenseSummary
                          monthlySpending={monthlySpending}
                          totalSpent={totalSpent}
                          darkMode={true}
                        />
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Card className="shadow-2xl border border-gray-800 bg-gray-900/80 backdrop-blur-xl rounded-2xl overflow-hidden relative">
                    {/* Neon glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-600/10 rounded-2xl opacity-30" />

                    <div className="relative z-10">
                      <CardHeader className="border-b border-gray-800 pb-5 pt-7 px-7">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-indigo-500/20">
                              <Activity className="h-5 w-5 text-blue-400" />
                            </div>
                            <CardTitle className="text-md font-semibold text-gray-200">
                              Recent Activity
                            </CardTitle>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded-xl"
                          >
                            View All
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-5">
                        <div className="space-y-3">
                          {recentActivities.map((activity, index) => (
                            <ActivityItem key={index} {...activity} />
                          ))}
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Right Column: Balances, Groups, and Insights */}
              <div className="space-y-7">
                {/* Balance Details */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <Card className="shadow-2xl border border-gray-800 bg-gray-900/80 backdrop-blur-xl rounded-2xl overflow-hidden relative">
                    {/* Neon glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-600/10 rounded-2xl opacity-30" />

                    <div className="relative z-10">
                      <CardHeader className="border-b border-gray-800 pb-5 pt-7 px-7">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-teal-500/20">
                              <CreditCard className="h-5 w-5 text-cyan-400" />
                            </div>
                            <CardTitle className="text-md font-semibold text-gray-200">
                              Balance Overview
                            </CardTitle>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/30 rounded-xl"
                          >
                            <Link href="/contacts">Details</Link>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-7">
                        <BalanceSummary balances={balances} darkMode={true} />
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>

                {/* Upcoming Payments */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Card className="shadow-2xl border border-gray-800 bg-gray-900/80 backdrop-blur-xl rounded-2xl overflow-hidden relative">
                    {/* Neon glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-600/10 rounded-2xl opacity-30" />

                    <div className="relative z-10">
                      <CardHeader className="border-b border-gray-800 pb-5 pt-7 px-7">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20">
                            <Target className="h-5 w-5 text-amber-400" />
                          </div>
                          <CardTitle className="text-md font-semibold text-gray-200">
                            Upcoming Payments
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-5">
                        <div className="space-y-3">
                          {upcomingPayments.map((payment, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-xl bg-gray-800/60 hover:bg-gray-700/80 transition-colors border border-gray-700"
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={cn(
                                    "w-2.5 h-2.5 rounded-full",
                                    payment.priority === "high"
                                      ? "bg-rose-500"
                                      : payment.priority === "medium"
                                        ? "bg-amber-500"
                                        : "bg-emerald-500"
                                  )}
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-200">
                                    {payment.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {payment.dueDate}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm font-semibold text-gray-200">
                                {payment.amount}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t border-gray-800 pt-5 px-7 pb-7">
                        <Button
                          variant="outline"
                          className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-600 
                            text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
                            border-0 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                          Settle All Payments
                        </Button>
                      </CardFooter>
                    </div>
                  </Card>
                </motion.div>

                {/* Groups */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <Card className="shadow-2xl border border-gray-800 bg-gray-900/80 backdrop-blur-xl rounded-2xl overflow-hidden relative">
                    {/* Neon glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-600/10 rounded-2xl opacity-30" />

                    <div className="relative  z-10">
                      <CardHeader className="border-b border-gray-700/2  pb-5 pt-7 px-7">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-violet-500/20">
                              <Users className="h-5 w-5 text-purple-400" />
                            </div>
                            <CardTitle className="text-md font-semibold text-gray-200">
                              Active Groups
                            </CardTitle>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/30 rounded-xl"
                          >
                            <Link href="/contacts">Manage</Link>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-7">
                        <GroupList groups={groups} darkMode={true} />
                      </CardContent>
                      <CardFooter className="border-t border-gray-800 pt-5 px-7 pb-7">
                        <Button
                          variant="outline"
                          asChild
                          className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-600 
                            text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
                            border-0 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Link href="/contacts?createGroup=true">
                            <Users className="mr-2 h-4 w-4" />
                            Create New Group
                          </Link>
                        </Button>
                      </CardFooter>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}