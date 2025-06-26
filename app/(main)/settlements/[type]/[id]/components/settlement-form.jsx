"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

// Form schema validation
const settlementSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    }),
  note: z.string().optional(),
  paymentType: z.enum(["youPaid", "theyPaid"]),
});

// Format currency as Indian Rupees
const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default function SettlementForm({ entityType, entityData, onSuccess }) {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const createSettlement = useConvexMutation(api.settlements.createSettlement);
  const [selectedGroupMemberId, setSelectedGroupMemberId] = useState(null);

  // Reset selected member when entityData changes
  useEffect(() => {
    setSelectedGroupMemberId(null);
  }, [entityData]);

  // Set up form with validation
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(settlementSchema),
    defaultValues: {
      amount: "",
      note: "",
      paymentType: "youPaid",
    },
  });

  // Get selected payment direction
  const paymentType = watch("paymentType");

  // Handle successful settlement
  const handleSuccess = () => {
    toast.success("Settlement recorded successfully!");
    reset();
    if (onSuccess) onSuccess();
  };

  // Handle errors
  const handleError = (error) => {
    toast.error("Failed to record settlement: " + error.message);
  };

  // Single user settlement
  const handleUserSettlement = async (data) => {
    if (!currentUser || !entityData.counterpart) return;

    const amount = parseFloat(data.amount);
    const isYouPaid = data.paymentType === "youPaid";

    try {
      await createSettlement.mutate({
        amount,
        note: data.note,
        paidByUserId: isYouPaid ? currentUser._id : entityData.counterpart.userId,
        receivedByUserId: isYouPaid ? entityData.counterpart.userId : currentUser._id,
      });
      handleSuccess();
    } catch (error) {
      handleError(error);
    }
  };

  // Group settlement
  const handleGroupSettlement = async (data, selectedUserId) => {
    if (!currentUser || !entityData.group || !entityData.balances) return;

    const amount = parseFloat(data.amount);
    const isYouPaid = data.paymentType === "youPaid";

    try {
      await createSettlement.mutate({
        amount,
        note: data.note,
        paidByUserId: isYouPaid ? currentUser._id : selectedUserId,
        receivedByUserId: isYouPaid ? selectedUserId : currentUser._id,
        groupId: entityData.group.id,
      });
      handleSuccess();
    } catch (error) {
      handleError(error);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (entityType === "user") {
      await handleUserSettlement(data);
    } else if (entityType === "group" && selectedGroupMemberId) {
      await handleGroupSettlement(data, selectedGroupMemberId);
    }
  };

  if (!currentUser) return null;

  // Render the form for individual settlement
  if (entityType === "user") {
    if (!entityData.counterpart || entityData.netBalance === undefined) {
      return <div className="p-4 text-center text-muted-foreground">Missing user data</div>;
    }

    const otherUser = entityData.counterpart;
    const netBalance = entityData.netBalance;

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Balance information */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium text-black mb-2">Current balance</h3>
          {netBalance === 0 ? (
            <p className="text-black"> You are all settled up with {otherUser.name}</p>
          ) : netBalance > 0 ? (
            <div className="flex justify-between items-center">
              <p className="text-black">
                <span className="font-medium ">{otherUser.name}</span> owes you
              </p>
              <span className="text-xl font-bold text-green-600">
                {formatINR(netBalance)}
              </span>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <p className="text-black">
                You owe <span className="font-medium">{otherUser.name}</span>
              </p>
              <span className="text-xl font-bold text-red-600">
                {formatINR(Math.abs(netBalance))}
              </span>
            </div>
          )}
        </div>

        {/* Payment direction */}
        <div className="space-y-2">
          <Label>Who paid?</Label>
          <RadioGroup
            value={paymentType}
            onValueChange={(value) => {
              // Update form value
              register("paymentType").onChange({
                target: { name: "paymentType", value },
              });
            }}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2 border rounded-md p-3">
              <RadioGroupItem 
                value="youPaid" 
                id="youPaid" 
                className="text-white data-[state=checked]:text-white" // White selection dot
              />
              <Label htmlFor="youPaid" className="flex-grow cursor-pointer">
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={currentUser.imageUrl} alt={currentUser.name} />
                    <AvatarFallback>
                      {currentUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>You paid {otherUser.name}</span>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-md p-3">
              <RadioGroupItem 
                value="theyPaid" 
                id="theyPaid" 
                className="text-white data-[state=checked]:text-white" // White selection dot
              />
              <Label htmlFor="theyPaid" className="flex-grow cursor-pointer">
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={otherUser.imageUrl} alt={otherUser.name} />
                    <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{otherUser.name} paid you</span>
                </div>
              </Label>
            </div>
          </RadioGroup>
          {errors.paymentType && (
            <p className="text-sm text-red-500">{errors.paymentType.message}</p>
          )}
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5">₹</span> {/* Changed to ₹ */}
            <Input
              id="amount"
              placeholder="0.00"
              type="number"
              step="0.01"
              min="0.01"
              className="pl-7"
              {...register("amount")}
            />
          </div>
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>

        {/* Note */}
        <div className="space-y-2">
          <Label htmlFor="note">Note (optional)</Label>
          <Textarea
            id="note"
            placeholder="Dinner, rent, etc."
            {...register("note")}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Recording..." : "Record settlement"}
        </Button>
      </form>
    );
  }

  // Render form for group settlement
  if (entityType === "group") {
    if (!entityData.balances || !entityData.group) {
      return <div className="p-4 text-center text-muted-foreground">Missing group data</div>;
    }

    // Filter out current user from members list
    const groupMembers = entityData.balances.filter(
      member => member.userId !== currentUser._id
    );

    if (groupMembers.length === 0) {
      return (
        <div className="p-6 text-center text-muted-foreground">
          No other group members to settle with
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Select group member */}
        <div className="space-y-2">
          <Label>Who are you settling with?</Label>
          <div className="space-y-2">
            {groupMembers.map((member) => {
              const isSelected = selectedGroupMemberId === member.userId;
              const isOwing = member.netBalance < 0;
              const isOwed = member.netBalance > 0;
              const absBalance = Math.abs(member.netBalance);

              return (
                <div
                  key={member.userId}
                  className={`border rounded-md p-3 cursor-pointer transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedGroupMemberId(member.userId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.imageUrl} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                    <div
                      className={`font-medium ${
                        isOwing
                          ? "text-green-600"
                          : isOwed
                            ? "text-red-600"
                            : "text-muted-foreground"
                      }`}
                    >
                      {isOwing
                        ? `They owe you ${formatINR(absBalance)}` // Changed to ₹
                        : isOwed
                          ? `You owe ${formatINR(absBalance)}` // Changed to ₹
                          : "Settled up"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {!selectedGroupMemberId && (
            <p className="text-sm text-amber-600">
              Please select a member to settle with
            </p>
          )}
        </div>

        {selectedGroupMemberId && (
          <>
            {/* Payment direction */}
            <div className="space-y-2">
              <Label>Who paid?</Label>
              <RadioGroup
                value={paymentType}
                onValueChange={(value) => {
                  // Update form value
                  register("paymentType").onChange({
                    target: { name: "paymentType", value },
                  });
                }}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem 
                    value="youPaid" 
                    id="youPaid" 
                    className="text-white data-[state=checked]:text-white" // White selection dot
                  />
                  <Label htmlFor="youPaid" className="flex-grow cursor-pointer">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={currentUser.imageUrl} alt={currentUser.name} />
                        <AvatarFallback>
                          {currentUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        You paid{" "}
                        {
                          groupMembers.find(
                            (m) => m.userId === selectedGroupMemberId
                          )?.name
                        }
                      </span>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem 
                    value="theyPaid" 
                    id="theyPaid" 
                    className="text-white data-[state=checked]:text-white" // White selection dot
                  />
                  <Label
                    htmlFor="theyPaid"
                    className="flex-grow cursor-pointer"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage
                          src={
                            groupMembers.find(
                              (m) => m.userId === selectedGroupMemberId
                            )?.imageUrl
                          }
                          alt={
                            groupMembers.find(
                              (m) => m.userId === selectedGroupMemberId
                            )?.name || ""
                          }
                        />
                        <AvatarFallback>
                          {groupMembers
                            .find((m) => m.userId === selectedGroupMemberId)
                            ?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {
                          groupMembers.find(
                            (m) => m.userId === selectedGroupMemberId
                          )?.name
                        }{" "}
                        paid you
                      </span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
              {errors.paymentType && (
                <p className="text-sm text-red-500">{errors.paymentType.message}</p>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">₹</span> {/* Changed to ₹ */}
                <Input
                  id="amount"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="pl-7"
                  {...register("amount")}
                />
              </div>
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea
                id="note"
                placeholder="Dinner, rent, etc."
                {...register("note")}
              />
            </div>
          </>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !selectedGroupMemberId}
        >
          {isSubmitting ? "Recording..." : "Record settlement"}
        </Button>
      </form>
    );
  }

  return null;
}