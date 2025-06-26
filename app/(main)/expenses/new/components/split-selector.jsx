"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export function SplitSelector({
  type,
  amount,
  participants,
  paidByUserId,
  onSplitsChange,
}) {
  const { user } = useUser();
  const [splits, setSplits] = useState([]);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const updateTotals = (newSplits) => {
    const newTotalAmount = newSplits.reduce((sum, s) => sum + s.amount, 0);
    const newTotalPercentage = newSplits.reduce((sum, s) => sum + s.percentage, 0);
    setTotalAmount(newTotalAmount);
    setTotalPercentage(newTotalPercentage);
  };

  useEffect(() => {
    if (!amount || amount <= 0 || participants.length === 0) return;

    let newSplits = [];

    if (type === "equal") {
      const shareAmount = amount / participants.length;
      newSplits = participants.map((p) => ({
        userId: p.id,
        name: p.name,
        email: p.email,
        imageUrl: p.imageUrl,
        amount: shareAmount,
        percentage: 100 / participants.length,
        paid: p.id === paidByUserId,
      }));
    } else if (type === "percentage") {
      const evenPercentage = 100 / participants.length;
      newSplits = participants.map((p) => ({
        userId: p.id,
        name: p.name,
        email: p.email,
        imageUrl: p.imageUrl,
        amount: (amount * evenPercentage) / 100,
        percentage: evenPercentage,
        paid: p.id === paidByUserId,
      }));
    } else if (type === "exact") {
      const evenAmount = amount / participants.length;
      newSplits = participants.map((p) => ({
        userId: p.id,
        name: p.name,
        email: p.email,
        imageUrl: p.imageUrl,
        amount: evenAmount,
        percentage: (evenAmount / amount) * 100,
        paid: p.id === paidByUserId,
      }));
    }

    setSplits(newSplits);
    updateTotals(newSplits);
    onSplitsChange?.(newSplits);
  }, [type, amount, paidByUserId, participants.length]);

  const updatePercentageSplit = (userId, newPercentage) => {
    const updatedSplits = splits.map((s) =>
      s.userId === userId
        ? {
            ...s,
            percentage: newPercentage,
            amount: (amount * newPercentage) / 100,
          }
        : s
    );
    setSplits(updatedSplits);
    updateTotals(updatedSplits);
    onSplitsChange?.(updatedSplits);
  };

  const updateExactSplit = (userId, newAmount) => {
    const parsedAmount = parseFloat(newAmount) || 0;
    const updatedSplits = splits.map((s) =>
      s.userId === userId
        ? {
            ...s,
            amount: parsedAmount,
            percentage: amount > 0 ? (parsedAmount / amount) * 100 : 0,
          }
        : s
    );
    setSplits(updatedSplits);
    updateTotals(updatedSplits);
    onSplitsChange?.(updatedSplits);
  };

  const isPercentageValid = Math.abs(totalPercentage - 100) < 0.01;
  const isAmountValid = Math.abs(totalAmount - amount) < 0.01;

  return (
    <div className="space-y-4 mt-4">
      {splits.map((split) => (
        <div
          key={split.userId}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2 min-w-[120px]">
            <Avatar className="h-7 w-7">
              <AvatarImage src={split.imageUrl} />
              <AvatarFallback>{split.name?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <span className="text-sm">
              {split.userId === user?.id ? "You" : split.name}
            </span>
          </div>

          {type === "equal" && (
            <div className="text-right text-sm">
              ${split.amount.toFixed(2)} ({split.percentage.toFixed(1)}%)
            </div>
          )}

          {type === "percentage" && (
            <div className="flex items-center gap-4 flex-1">
              <Slider
                value={[split.percentage]}
                min={0}
                max={100}
                step={1}
                onValueChange={(values) =>
                  updatePercentageSplit(split.userId, values[0])
                }
                className="flex-1"
              />
              <div className="flex gap-1 items-center min-w-[100px]">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={split.percentage.toFixed(1)}
                  onChange={(e) =>
                    updatePercentageSplit(
                      split.userId,
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-16 h-8"
                />
                <span className="text-sm text-muted-foreground">%</span>
                <span className="text-sm ml-1">${split.amount.toFixed(2)}</span>
              </div>
            </div>
          )}

          {type === "exact" && (
            <div className="flex items-center gap-2 flex-1">
              <div className="flex-1" />
              <div className="flex gap-1 items-center">
                <span className="text-sm text-muted-foreground">$</span>
                <Input
                  type="number"
                  min="0"
                  max={amount * 2}
                  step="0.01"
                  value={split.amount.toFixed(2)}
                  onChange={(e) =>
                    updateExactSplit(split.userId, e.target.value)
                  }
                  className="w-24 h-8"
                />
                <span className="text-sm text-muted-foreground ml-1">
                  ({split.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-between border-t pt-3 mt-3">
        <span className="font-medium">Total</span>
        <div className="text-right">
          <span
            className={`font-medium ${!isAmountValid ? "text-amber-600" : ""}`}
          >
            ${totalAmount.toFixed(2)}
          </span>
          {type !== "equal" && (
            <span
              className={`text-sm ml-2 ${!isPercentageValid ? "text-amber-600" : ""}`}
            >
              ({totalPercentage.toFixed(1)}%)
            </span>
          )}
        </div>
      </div>

      {type === "percentage" && !isPercentageValid && (
        <div className="text-sm text-amber-600 mt-2">
          The percentages should add up to 100%.
        </div>
      )}
      {type === "exact" && !isAmountValid && (
        <div className="text-sm text-amber-600 mt-2">
          The sum of all splits (${totalAmount.toFixed(2)}) should equal the total amount (${amount.toFixed(2)}).
        </div>
      )}
    </div>
  );
}
