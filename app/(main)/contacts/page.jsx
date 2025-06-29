"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Users, User, Search, ArrowLeft } from "lucide-react";
import { CreateGroupModal } from "./_components/create-group-modal";
import Chatbot from "@/components/chatbot";

export default function ContactsPage() {
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading } = useConvexQuery(api.contacts.getAllContacts);

  useEffect(() => {
    const createGroupParam = searchParams.get("createGroup");
    if (createGroupParam === "true") {
      setIsCreateGroupModalOpen(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("createGroup");
      router.replace(url.pathname + url.search);
    }
  }, [searchParams, router]);

  const { users = [], groups = [] } = data || {};

  // Filter contacts based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groups;
    const query = searchQuery.toLowerCase();
    return groups.filter((group) => 
        group.name.toLowerCase().includes(query)
    );
  }, [groups, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <BarLoader width={"200px"} color="#6366f1" />
          <p className="mt-3 text-gray-400">Loading your contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header - Fixed at top */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800 px-4 sm:px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard')}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Contacts
            </h1>
            <p className="text-sm text-gray-400 mt-1 hidden sm:block">
              {users.length} people • {groups.length} groups
            </p>
          </div>
          <Chatbot />

          <Button 
            onClick={() => setIsCreateGroupModalOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Create Group</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>
      </header>

      {/* Main Content - Flexible height */}
      <main className="flex-grow px-4 sm:px-8 py-8">
        {/* Search Bar */}
        <div className="relative mb-8 max-w-4xl mx-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <Input
            placeholder="Search people and groups..."
            className="pl-10 py-5 bg-gray-800/50 border-gray-700 backdrop-blur-sm text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Two Separate Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* People Section */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm flex flex-col h-full">
            <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-gray-800/70 to-gray-800/50">
              <div className="flex items-center">
                <div className="bg-blue-900/30 p-2 rounded-lg">
                  <User className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="ml-3 font-semibold text-lg">People</h2>
                <span className="ml-2 text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
                  {filteredUsers.length}
                </span>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto max-h-[50vh]">
              {filteredUsers.length === 0 ? (
                <div className="py-10 text-center text-gray-400 h-full flex items-center justify-center">
                  <div>
                    <p className="text-lg">{searchQuery ? "No matching contacts" : "No contacts yet"}</p>
                    <p className="text-sm mt-2 max-w-md mx-auto">
                      {searchQuery ? "Try a different search" : "Add an expense with someone to see them here"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-800/50">
                  {filteredUsers.map((user) => (
                    <Link key={user.id} href={`/person/${user.id}`}>
                      <div className="px-4 py-3 hover:bg-gray-800/30 transition-all cursor-pointer flex items-center group">
                        <Avatar className="h-12 w-12 border-2 border-gray-700 group-hover:border-indigo-500 transition-colors">
                          <AvatarImage src={user.imageUrl} />
                          <AvatarFallback className="bg-gray-700 text-white">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <p className="font-medium group-hover:text-indigo-300 transition-colors">{user.name}</p>
                          <p className="text-sm text-gray-400 truncate max-w-[160px] sm:max-w-xs">
                            {user.email}
                          </p>
                        </div>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Groups Section */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm flex flex-col h-full">
            <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-gray-800/70 to-gray-800/50">
              <div className="flex items-center">
                <div className="bg-purple-900/30 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-purple-400" />
                </div>
                <h2 className="ml-3 font-semibold text-lg">Groups</h2>
                <span className="ml-2 text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
                  {filteredGroups.length}
                </span>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto max-h-[50vh]">
              {filteredGroups.length === 0 ? (
                <div className="py-10 text-center text-gray-400 h-full flex items-center justify-center">
                  <div>
                    <p className="text-lg">{searchQuery ? "No matching groups" : "No groups yet"}</p>
                    <p className="text-sm mt-2 max-w-md mx-auto">
                      {searchQuery ? "Try a different search" : "Create a group to track shared expenses"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-800/50">
                  {filteredGroups.map((group) => (
                    <Link key={group.id} href={`/groups/${group.id}`}>
                      <div className="px-4 py-3 hover:bg-gray-800/30 transition-all cursor-pointer flex items-center group">
                        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-3 rounded-lg">
                          <Users className="h-6 w-6 text-purple-400" />
                        </div>
                        <div className="ml-4">
                          <p className="font-medium group-hover:text-purple-300 transition-colors">{group.name}</p>
                          <p className="text-sm text-gray-400">
                            {group.memberCount} member{group.memberCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Fixed at bottom */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-800 px-4 sm:px-8 py-6 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center w-full">
          {/* Left - Branding */}
          <div className="flex justify-start items-center mb-4 md:mb-0">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-8 h-8 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <span className="ml-3 font-semibold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Split-Wise-Ui
            </span>
          </div>

          {/* Center - Copyright */}
          <div className="text-center mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Split-Wise-Ui. All rights reserved.
            </p>
          </div>

          {/* Right - Links */}
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

      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onSuccess={(groupId) => {
          router.push(`/groups/${groupId}`);
        }}
      />
    </div>
  );
}