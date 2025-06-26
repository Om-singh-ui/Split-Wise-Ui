"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CategorySelector({ categories, onChange }) {
  const [selectedCategory, setSelectedCategory] = useState("");

  // Auto-select default category on mount
  useEffect(() => {
    if (categories?.length > 0 && !selectedCategory) {
      const defaultCategory = categories.find(cat => cat.isDefault) || categories[0];
      setSelectedCategory(defaultCategory.id);
      if (onChange) {
        onChange(defaultCategory.id);
      }
    }
  }, [categories, selectedCategory, onChange]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (onChange) {
      onChange(categoryId);
    }
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center text-gray-400">
        No categories available
      </div>
    );
  }

  return (
    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
      <SelectTrigger className="w-full bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 rounded-lg py-5 px-4 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
        <SelectValue
          placeholder="Select a category"
          className="placeholder:text-gray-500"
        />
      </SelectTrigger>

      <SelectContent className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
        {categories.map((category) => (
          <SelectItem
            key={category.id}
            value={category.id}
            className="hover:bg-gray-700/50 focus:bg-gray-700/50 text-gray-300"
          >
            <div className="flex items-center gap-3">
              {category.icon && (
                <span className="text-lg">
                  {typeof category.icon === "string" ? (
                    category.icon
                  ) : (
                    <category.icon className="w-4 h-4" />
                  )}
                </span>
              )}
              <span className="font-medium">{category.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
