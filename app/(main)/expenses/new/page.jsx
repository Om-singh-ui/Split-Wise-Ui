"use client";

import { useRouter } from "next/navigation";
import { ExpenseForm } from "./components/expense-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewExpensePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        {/* Header with improved gradient and spacing */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Add New Expense
          </h1>
          <p className="text-gray-600 max-w-md mx-auto text-lg">
            Track and split expenses with friends or groups
          </p>
        </div>

        {/* Card with more pronounced styling */}
        <Card className="shadow-xl border-0 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 border-b border-gray-200/50">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <span className="bg-gradient-to-r from-green-500 to-blue-500 rounded-full w-2 h-2"></span>
              Select Expense Type
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <Tabs defaultValue="individual" className="w-full space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1.5 rounded-xl h-12">
                <TabsTrigger
                  value="individual"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:via-blue-500 data-[state=active]:to-purple-500 
                    data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-semibold rounded-lg"
                >
                  Individual
                </TabsTrigger>
                <TabsTrigger
                  value="group"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:via-blue-500 data-[state=active]:to-purple-500 
                    data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-semibold rounded-lg"
                >
                  Group
                </TabsTrigger>
              </TabsList>

              <TabsContent value="individual" className="pt-2">
                <ExpenseForm
                  type="individual"
                  onSuccess={(id) => router.push(`/person/${id}`)}
                />
              </TabsContent>
              <TabsContent value="group" className="pt-2">
                <ExpenseForm
                  type="group"
                  onSuccess={(id) => router.push(`/groups/${id}`)}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}