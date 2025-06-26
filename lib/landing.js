import { Bell, CreditCard, PieChart, Receipt, Users } from "lucide-react";

export const FEATURES = [
  {
    title: "Group Expenses",
    Icon: Users,
    bg: "bg-green-100",
    color: "text-green-600",
    description:
      "Create groups for roommates, trips, or events to keep expenses organized.",
  },
  {
    title: "Smart Settlements",
    Icon: CreditCard,
    bg: "bg-teal-100",
    color: "text-teal-600",
    description:
      "Our algorithm minimises the number of payments when settling up.",
  },
  {
    title: "Expense Analytics",
    Icon: PieChart,
    bg: "bg-green-100",
    color: "text-green-600",
    description:
      "Track spending patterns and discover insights about your shared costs.",
  },
  {
    title: "Payment Reminders",
    Icon: Bell,
    bg: "bg-amber-100",
    color: "text-amber-600",
    description:
      "Automated reminders for pending debts and insights on spending patterns.",
  },
  {
    title: "Multiple Split Types",
    Icon: Receipt,
    bg: "bg-green-100",
    color: "text-green-600",
    description:
      "Split equally, by percentage, or by exact amounts to fit any scenario.",
  },
  {
    title: "Real‑time Updates",
    Icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 14v8M15 14v8M9 2v6M15 2v6" />
      </svg>
    ),
    bg: "bg-teal-100",
    color: "text-teal-600",
    description:
      "See new expenses and repayments the moment your friends add them.",
  },
];

export const STEPS = [
  {
    title: "Create a Group.",
    Icon: () => <span>👥</span>,
    description: "Start by creating a group to track shared expenses with freinds and family.",
  },
  {
    title: "Add Expenses.",
    Icon: () => <span>💸</span>,
    description: "Add bills or purchases to be split among group members.",
  },
  {
    title: "Settle Up.",
    Icon: () => <span>✅</span>,
    description: "Keep track of who owes whom and settle balances easily.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Ye babu rao ka style hai! With Splitr, I finally stopped getting confused about who paid for what!",
    name: "Babu Rao",
    image: "/testimonials/babubhaiya.png",
    role: "Rental Property Manager",
  },
  {
    quote:
      "Splitr's calculations are so accurate, they're even better than my scheme to double money in 25 days!",
    name: "Raju",
    image: "/testimonials/raju.jpg",
    role: "Stock Market Expert",
  },
  {
    quote:
      "If that I have Splitr, Raju wont get away with selling my shoes and coat! I'll add to his debt!",
    name: "Shyam",
    image: "/testimonials/shyam.png",
    role: "Job Searcher",
  },
];
