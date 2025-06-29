"use client";

import { Authenticated } from "convex/react";
import React from "react";
import Chatbot from "@/components/chatbot";

export default function MainLayout({ children }) {
  return (
    <Authenticated>
    <div className="container mx-auto mt-24 mb-20">
      {children}
    </div>
    <Chatbot />

    </Authenticated>
  );
}