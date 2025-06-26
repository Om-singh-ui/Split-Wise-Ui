"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, ArrowLeftRight, ArrowLeft, Users } from "lucide-react";
import { ExpenseList } from "@/components/expense-list";
import { SettlementList } from "@/components/settelment-list";
import { GroupBalances } from "@/components/group-balances";
import { GroupMembers } from "@/components/group-members";

// Format INR currency
const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function GroupExpensesPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("expenses");

  const { data, isLoading } = useConvexQuery(api.groups.getGroupExpenses, {
    groupId: params.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <BarLoader width={"200px"} color="#6366f1" />
          <p className="mt-3 text-gray-400">Loading group details...</p>
        </div>
      </div>
    );
  }

  const group = data?.group;
  const members = data?.members || [];
  const expenses = data?.expenses || [];
  const settlements = data?.settlements || [];
  const balances = data?.balances || [];
  const userLookupMap = data?.userLookupMap || {};

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800 px-4 sm:px-8 py-4 sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-3 rounded-lg">
                <Users className="h-8 w-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {group?.name}
                </h1>
                <p className="text-sm text-gray-400">{group?.description}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              asChild 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/20"
            >
              <Link href={`/expenses/new`}>
                <PlusCircle className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Add expense</span>
                <span className="sm:hidden">Add</span>
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline"
              className="bg-gray-800/50 border-gray-700 backdrop-blur-sm text-white hover:bg-gray-700/50"
            >
              <Link href={`/settlements/group/${params.id}`}>
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Settle up</span>
                <span className="sm:hidden">Settle</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow px-4 sm:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Group Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Group Balances */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-gray-800/70 to-gray-800/50">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-2 rounded-lg">
                      <ArrowLeftRight className="h-5 w-5 text-blue-400" />
                    </div>
                    <h2 className="ml-3 font-semibold text-lg">Group Balances</h2>
                  </div>
                </div>
                <div className="p-4">
                  <GroupBalances balances={balances} />
                </div>
              </div>
            </div>

            {/* Group Members */}
            <div>
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-gray-800/70 to-gray-800/50">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-purple-400" />
                    </div>
                    <h2 className="ml-3 font-semibold text-lg">Members</h2>
                    <span className="ml-2 text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
                      {members.length}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <GroupMembers members={members} />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            defaultValue="expenses"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border border-gray-700 backdrop-blur-sm">
              <TabsTrigger 
                value="expenses" 
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                Expenses ({expenses.length})
              </TabsTrigger>
              <TabsTrigger 
                value="settlements" 
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                Settlements ({settlements.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="expenses" className="space-y-4">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="p-1">
                  <ExpenseList
                    expenses={expenses}
                    showOtherPerson={true}
                    isGroupExpense={true}
                    userLookupMap={userLookupMap}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settlements" className="space-y-4">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="p-1">
                  <SettlementList
                    settlements={settlements}
                    isGroupSettlement={true}
                    userLookupMap={userLookupMap}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-800 px-4 sm:px-8 py-6 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center w-full">
          <div className="flex justify-start items-center mb-4 md:mb-0">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-8 h-8 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <span className="ml-3 font-semibold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Split-Wise-Ui
            </span>
          </div>

          <div className="text-center mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Split-Wise-Ui. All rights reserved.
            </p>
          </div>

          <div className="flex justify-center md:justify-end">
            <Button variant="ghost" className="text-gray-400 hover:text-white mr-3">
              Privacy Policy
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Terms of Service
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}