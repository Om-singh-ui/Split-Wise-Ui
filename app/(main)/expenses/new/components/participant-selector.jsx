"use client";

import { useState, useEffect } from "react";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ParticipantSelector({ participants, onParticipantsChange }) {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Search for users with debounced query
  const { data: searchResults, isLoading } = useConvexQuery(
    api.users.searchUsers,
    debouncedQuery.length >= 2 ? { query: debouncedQuery } : "skip"
  );

  // Filter out current user and existing participants
  const filteredResults = (searchResults || []).filter(
    (user) => 
      user._id !== currentUser?._id &&
      !participants.some(p => p.id === user._id)
  );

  // Add a participant
  const addParticipant = (user) => {
    onParticipantsChange([...participants, {
      id: user._id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl
    }]);
    setOpen(false);
    setSearchQuery("");
  };

  // Remove a participant
  const removeParticipant = (userId) => {
    // Don't allow removing current user
    if (userId === currentUser?._id) return;
    
    onParticipantsChange(participants.filter(p => p.id !== userId));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {participants.map((participant) => (
          <Badge
            key={participant.id}
            variant="secondary"
            className="flex items-center gap-2 px-3 py-2"
          >
            <Avatar className="h-5 w-5">
              <AvatarImage src={participant.imageUrl} />
              <AvatarFallback>
                {participant.name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <span>
              {participant.id === currentUser?._id
                ? "You"
                : participant.name || participant.email}
            </span>
            {participant.id !== currentUser?._id && (
              <button
                type="button"
                onClick={() => removeParticipant(participant.id)}
                className="ml-1 text-muted-foreground hover:text-foreground"
                aria-label="Remove participant"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs"
              type="button"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Add person
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[350px]" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search by name or email..."
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>
                  {searchQuery.length < 2 ? (
                    <div className="py-3 px-4 text-sm text-center text-muted-foreground">
                      Type at least 2 characters to search
                    </div>
                  ) : isLoading ? (
                    <div className="py-3 px-4 text-sm text-center text-muted-foreground">
                      Searching...
                    </div>
                  ) : (
                    <div className="py-3 px-4 text-sm text-center text-muted-foreground">
                      No users found
                    </div>
                  )}
                </CommandEmpty>
                
                {filteredResults.length > 0 && (
                  <CommandGroup heading="Users">
                    {filteredResults.map((user) => (
                      <CommandItem
                        key={user._id}
                        value={user.name + user.email}
                        onSelect={() => addParticipant(user)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.imageUrl} />
                            <AvatarFallback>
                              {user.name?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate">
                              {user.name}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}