"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { BarLoader } from "react-spinners";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, ArrowLeftRight, ArrowLeft } from "lucide-react";
import { ExpenseList } from "@/components/expense-list";
import { SettlementList } from "@/components/settelment-list";
import { motion } from "framer-motion";

import Chatbot from "@/components/chatbot";

export default function PersonExpensesPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("expenses");

  const { data, isLoading } = useConvexQuery(
    api.expenses.getExpensesBetweenUsers,
    { userId: params.id }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <BarLoader width={"80%"} height={8} color="#10b981" />
      </div>
    );
  }

  const otherUser = data?.otherUser;
  const expenses = data?.expenses || [];
  const settlements = data?.settlements || [];
  const balance = data?.balance || 0;

  // Function to format currency in Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto py-8 max-w-4xl relative z-10">
        <div className="mb-8">
          <Button
            className="mb-6  text-white hover:bg-blend-color-dodge  hover:bg-gray-700/80"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center gap-6 justify-between p-4 rounded-xl bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-emerald-500/30">
                <AvatarImage src={otherUser?.imageUrl} />
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold">
                  {otherUser?.name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
                  {otherUser?.name}
                </h1>
                <p className="text-gray-400 mt-1">{otherUser?.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button 
                asChild 
                variant="outline"
                className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400 hover:text-emerald-300 transition-all"
              >
                <Link href={`/settlements/user/${params.id}`}>
                  <ArrowLeftRight className="mr-2 h-4 w-4" />
                  Settle up
                </Link>
              </Button>
              <Button 
                asChild
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 hover:shadow-[0_10px_30px_rgba(16,185,129,0.4)] transition-all"
              >
                <Link href={`/expenses/new`}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add expense
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
<Chatbot />

        {/* Balance card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 shadow-xl rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-white">Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center relative z-10">
                <div className="text-gray-300">
                  {balance === 0 ? (
                    <p>You are all settled up</p>
                  ) : balance > 0 ? (
                    <p>
                      <span className="font-medium text-emerald-400">{otherUser?.name}</span> owes
                      you
                    </p>
                  ) : (
                    <p>
                      You owe <span className="font-medium text-emerald-400">{otherUser?.name}</span>
                    </p>
                  )}
                </div>
                <div
                  className={`text-3xl font-bold ${balance > 0 ? "text-green-400" : balance < 0 ? "text-red-400" : "text-gray-400"}`}
                >
                  {formatCurrency(Math.abs(balance))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs for expenses and settlements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs
            defaultValue="expenses"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-xl p-1 h-auto">
              <TabsTrigger 
                value="expenses" 
                className="  text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/80 data-[state=active]:to-teal-500/80 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg py-3 transition-all"
              >
                Expenses <span className="ml-2 bg-gray-800/50 px-2 py-1 rounded text-xs">{expenses.length}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settlements" 
                className=" text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/80 data-[state=active]:to-teal-500/80 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg py-3 transition-all"
              >
                Settlements <span className="ml-2 bg-gray-800/50 px-2 py-1 rounded text-xs">{settlements.length}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="expenses" className="space-y-4">
              <Card className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 shadow-xl rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  <ExpenseList
                    expenses={expenses}
                    showOtherPerson={false}
                    otherPersonId={params.id}
                    userLookupMap={{ [otherUser.id]: otherUser }}
                    currencyFormatter={formatCurrency} // Pass formatter to ExpenseList
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settlements" className="space-y-4">
              <Card className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 shadow-xl rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  <SettlementList
                    settlements={settlements}
                    userLookupMap={{ [otherUser.id]: otherUser }}
                    currencyFormatter={formatCurrency} // Pass formatter to SettlementList
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}