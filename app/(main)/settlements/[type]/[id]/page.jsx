"use client";

import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { BarLoader } from "react-spinners";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Handshake } from "lucide-react";
import SettlementForm from "./components/settlement-form";
import Chatbot from "@/components/chatbot";

export default function SettlementPage() {
  const params = useParams();
  const router = useRouter();
  const { type, id } = params;

  const { data, isLoading } = useConvexQuery(
    api.settlements.getSettlementData,
    {
      entityType: type,
      entityId: id,
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <BarLoader width={"200px"} color="#6366f1" />
          <p className="mt-3 text-gray-400">Loading settlement data...</p>
        </div>
      </div>
    );
  }

  // Function to handle after successful settlement creation
  const handleSuccess = () => {
    // Redirect based on type
    if (type === "user") {
      router.push(`/person/${id}`);
    } else if (type === "group") {
      router.push(`/groups/${id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-gray-900 via-indigo-900/40 to-gray-900 border-b border-indigo-800/50 px-4 sm:px-8 py-5 sticky top-0 z-10">
        <div className="flex flex-col items-center">
          <div className="w-full flex justify-between items-center">
            <Button
              variant="ghost"
              className="px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm border border-gray-700 rounded-lg"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center bg-indigo-900/30 px-4 py-1 rounded-full backdrop-blur-sm">
                <Handshake className="h-5 w-5 mr-2 text-indigo-300" />
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                  Record Settlement
                </h1>
              </div>
              <p className="text-xs text-indigo-300 mt-2 hidden sm:block">
                {type === "user"
                  ? `Settling up with ${data?.counterpart?.name}`
                  : `Settling up in ${data?.group?.name}`}
              </p>
            </div>
            
            <div className="invisible sm:invisible">
              {/* Spacer to balance layout */}
              <Button variant="ghost" className="invisible">
                <ArrowLeft />
              </Button>
            </div>
          </div>
          <Chatbot />

          {/* Decorative line */}
          <div className="w-full mt-4 flex justify-center">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
          </div>
        </div>
      </header>

      <main className="flex-grow px-4 sm:px-8 py-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl shadow-indigo-900/20">
            <CardHeader className="border-b border-gray-700 bg-gradient-to-r from-gray-800/70 to-gray-800/50">
              <div className="flex items-center gap-3">
                {type === "user" ? (
                  <Avatar className="h-12 w-12 border-2 border-indigo-500/50">
                    <AvatarImage src={data?.counterpart?.imageUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-700 to-purple-700 text-white">
                      {data?.counterpart?.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-3 rounded-lg border border-indigo-500/30">
                    <Users className="h-6 w-6 text-purple-400" />
                  </div>
                )}
                <CardTitle className="text-xl font-semibold">
                  {type === "user" ? data?.counterpart?.name : data?.group?.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <SettlementForm
                entityType={type}
                entityData={data}
                onSuccess={handleSuccess}
              />
            </CardContent>
          </div>
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
            <Button variant="ghost" className="text-gray-400 hover:text-gray-700/80 mr-3">
              Privacy Policy
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-gray-700/80">
              Terms of Service
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}