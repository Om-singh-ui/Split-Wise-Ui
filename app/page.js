"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import Image from "next/image";
import { FEATURES, STEPS } from "@/lib/landing";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Github, Instagram, Linkedin } from "lucide-react";

// Testimonial images (make sure these exist in your public folder)
import SanskarImg from "@/public/testimonials/sanskarr.png";
import TarunImg from "@/public/testimonials/nunaa.png";
import NakshatraImg from "@/public/testimonials/nakku.png";
import LogoImg from "@/public/logos/logo.png";

export default function Home() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const handleScrollOrLoad = () => setAnimate(true);
    handleScrollOrLoad();
    window.addEventListener("scroll", handleScrollOrLoad);
    return () => window.removeEventListener("scroll", handleScrollOrLoad);
  }, []);

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-black">
      {/* Optimized Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className={`relative z-10 bg-gradient-to-b from-black via-gray-900/50 to-black ${animate ? "opacity-100" : "opacity-0"} transition-opacity duration-1000`}>
        {/* Hero Section */}
        <section className="pt-32 min-h-screen w-full flex items-center">
          <div className="w-full">
            <div className={`text-center transition-all duration-1000 ${animate ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto px-4"
              >
                <Badge
                  variant="outline"
                  className="rounded-full border border-emerald-500/50 bg-emerald-500/10 backdrop-blur-sm px-6 py-3 text-base font-medium text-emerald-400 transition-all duration-500 hover:shadow-[0_8px_25px_rgba(16,185,129,0.4)] hover:bg-emerald-500/20 hover:border-emerald-400 hover:scale-105 shadow-lg"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Split smarter. Settle faster.
                </Badge>

                <div className={`mt-8 text-center leading-tight ${animate ? "scale-105" : "scale-95 opacity-0"} transition-all duration-1000`}>
                  <h1 className="text-6xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 text-transparent bg-clip-text drop-shadow-2xl leading-tight">
                    Split-Wise-Ui
                  </h1>
                  <h2 className="mt-4 text-2xl md:text-4xl lg:text-5xl font-bold text-white/90 leading-tight">
                    The{" "}
                    <span className="bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
                      smartest way
                    </span>{" "}
                    to manage
                    <br />
                    your bills and expenses.
                  </h2>

                  <p className="mx-auto pt-8 max-w-3xl text-gray-300 text-lg md:text-xl leading-relaxed">
                    Track shared expenses, split bills effortlessly, and settle
                    up quickly with our intelligent platform.
                    <br />
                    <span className="text-emerald-400 font-medium">
                      Never worry about who owes who again.
                    </span>
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
                    <Button
                      asChild
                      size="lg"
                      className="px-10 py-4 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white transition-all duration-500 hover:from-emerald-600 hover:to-teal-600 hover:shadow-[0_20px_40px_rgba(16,185,129,0.4)] hover:scale-110 group"
                    >
                      <Link href="/dashboard" className="inline-flex items-center">
                        Get Started Free
                        <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="px-10 py-4 text-lg font-semibold border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-400 transition-all duration-500 hover:scale-105 backdrop-blur-sm"
                    >
                      <Link href="#features" className="inline-flex items-center">
                        See How It Works
                        <ChevronDown className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 w-full relative">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 mb-8 px-6 py-3 text-base font-medium"
              >
                ✨ Features
              </Badge>
              <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 text-transparent bg-clip-text drop-shadow-lg mb-6">
                Everything you need to split expenses
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Our platform offers all the tools you need to manage shared
                expenses with professional-grade precision and ease.
              </p>
            </motion.div>

            <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURES.map(({ title, Icon, bg, color, description }, idx) => {
                const shadowClass = color.includes("green")
                  ? "hover:shadow-[0_8px_40px_rgba(34,197,94,0.5)]"
                  : color.includes("teal")
                    ? "hover:shadow-[0_8px_40px_rgba(13,148,136,0.5)]"
                    : color.includes("amber")
                      ? "hover:shadow-[0_8px_40px_rgba(245,158,11,0.5)]"
                      : "hover:shadow-2xl";

                const iconShadowClass = color.includes("green")
                  ? "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.8)]"
                  : color.includes("teal")
                    ? "group-hover:shadow-[0_0_30px_rgba(13,148,136,0.8)]"
                    : color.includes("amber")
                      ? "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.8)]"
                      : "group-hover:shadow-xl";

                return (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                  >
                    <Card
                      className={`group border-gray-800/50 bg-gray-900/30 backdrop-blur-xl shadow-xl hover:scale-[1.05] transition-all duration-500 ease-out hover:bg-gray-800/50 hover:border-emerald-500/30 ${shadowClass} relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <CardContent className="p-8 relative z-10">
                        <div
                          className={`rounded-2xl p-5 inline-flex items-center justify-center transition-all duration-500 ${bg} ${color} ${iconShadowClass} group-hover:scale-125 group-hover:rotate-3`}
                        >
                          <Icon className="h-7 w-7 transition-transform duration-500 ease-out" />
                        </div>
                        <h3 className="mt-6 text-xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                          {title}
                        </h3>
                        <p className="mt-3 text-gray-400 group-hover:text-gray-300 leading-relaxed transition-colors duration-300">
                          {description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-32 w-full bg-gray-950/50">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 mb-8 px-6 py-3 text-base font-medium"
              >
                🚀 How It Works
              </Badge>
              <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 text-transparent bg-clip-text drop-shadow-lg mb-6">
                Splitting expenses has never been easier
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Follow these simple steps to start tracking and splitting
                expenses with friends like a professional.
              </p>
            </motion.div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
              {STEPS.map(({ title, Icon, description }, idx) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                >
                  <Card className="group border-gray-800/50 bg-gray-900/30 backdrop-blur-xl shadow-xl hover:scale-[1.05] transition-all duration-500 ease-out hover:bg-gray-800/50 hover:border-emerald-500/30 hover:shadow-[0_8px_40px_rgba(16,185,129,0.3)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardContent className="p-8 relative z-10">
                      <div className="relative mb-6">
                        <div className="rounded-2xl p-5 inline-flex items-center justify-center bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 group-hover:scale-125 group-hover:rotate-3 shadow-lg">
                          <Icon className="h-7 w-7 transition-transform duration-500 ease-out" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-black border-2 border-emerald-500 rounded-full flex items-center justify-center text-sm font-bold text-emerald-400 shadow-lg">
                          {idx + 1}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 mb-3">
                        {title}
                      </h3>
                      <p className="text-gray-400 group-hover:text-gray-300 leading-relaxed transition-colors duration-300">
                        {description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-32 w-full">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 mb-8 px-6 py-3 text-base font-medium"
              >
                💬 Testimonials
              </Badge>
              <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 text-transparent bg-clip-text drop-shadow-lg mb-6">
                What Our Users are Saying
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Real stories from users who simplified their group expenses
                using Split-Wise-UI.
              </p>
            </motion.div>

            <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Sanskar Kushwah",
                  role: "Student at Meme Wallha",
                  image: SanskarImg,
                  quote: "My roommates and I used to argue over who paid what. Split-Wise-UI made things super simple. Now we track rent, groceries, and even random coffee runs—all in one place. Huge time saver!",
                  instagram: "https://www.instagram.com/sanskar_kush07",
                },
                {
                  name: "Tarun Kushwah",
                  role: "UI/UX Designer",
                  image: TarunImg,
                  quote: "Split-Wise-UI completely changed how our team handles shared subscriptions and reimbursements. The interface is clean, fast, and intuitive—no more messy spreadsheets or awkward reminders. I use it weekly!",
                  instagram: "https://www.instagram.com/tarun_kushwah17",
                },
                {
                  name: "Nakshatra Kanojiya",
                  role: "Freelancer & Travel Enthusiast",
                  image: NakshatraImg,
                  quote: "Split-Wise-UI has streamlined how we manage group travel expenses. It ensures accuracy, fairness, and a seamless experience even when dealing with multiple currencies.",
                  instagram: "https://www.instagram.com/__.nakshatra.__07",
                },
              ].map(({ name, role, image, quote, instagram }, idx) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <Card className="group border-gray-800/50 bg-gray-900/30 backdrop-blur-xl shadow-xl hover:scale-[1.05] hover:shadow-[0_12px_50px_rgba(34,197,94,0.4)] transition-all duration-500 ease-out hover:bg-gray-800/50 hover:border-emerald-500/30 relative overflow-hidden h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardContent className="p-8 flex flex-col items-center text-center h-full relative z-10">
                      <div className="w-24 h-24 mb-6 rounded-full overflow-hidden border-4 border-emerald-500/30 group-hover:border-emerald-400 transition-all duration-500 group-hover:scale-110 shadow-lg">
                        <Image
                          src={image}
                          alt={name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                          placeholder="blur"
                        />
                      </div>
                      <p className="text-gray-300 text-base italic group-hover:text-white transition-colors duration-300 leading-relaxed flex-grow">
                        &quot;{quote}&quot;
                      </p>
                      <div className="mt-6 pt-4 border-t border-gray-800 group-hover:border-emerald-500/30 transition-colors duration-300">
                        <a
                          href={instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 font-bold hover:text-emerald-300 hover:underline transition-all duration-300 text-lg"
                        >
                          {name}
                        </a>
                        <p className="text-gray-500 text-sm mt-1">{role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative w-full bg-gradient-to-br from-emerald-600 via-teal-500 to-green-400 py-32 text-white overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-40 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl opacity-30 animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/5 rounded-full blur-3xl opacity-20 animate-pulse delay-2000" />

          <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8 drop-shadow-2xl">
                Ready to simplify expense sharing?
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of smart users who&apos;ve made group expense
                management simple and stress-free with Split-Wise-UI
                Professional.
              </p>
              <Button
                asChild
                size="lg"
                className="px-12 py-5 text-xl font-bold bg-white text-emerald-600 hover:bg-gray-50 hover:scale-110 shadow-2xl transition-all duration-500 group"
              >
                <Link href="/sign-in" className="inline-flex items-center">
                  <Sparkles className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                  Get Started Free
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-950 border-t border-gray-800/50 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <div className="w-10 h-10 rounded-b-none flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                      <Image
                        src={LogoImg}
                        alt="Split-Wise Logo"
                        width={40}
                        height={40}
                        className="w-11 h-11 object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-white">
                      Split-Wise-Ui
                    </span>
                    <span className="text-xs text-emerald-400 font-medium -mt-1">
                      Om-Singh-Ui
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
                  The smartest way to manage shared expenses. Built for modern
                  teams, friends, and families who demand professional-grade
                  expense management.
                </p>
                <div className="flex space-x-4">
                  {[
                    {
                      icon: Github,
                      href: "https://github.com/om-singh-ui",
                      label: "GitHub",
                    },
                    {
                      icon: Linkedin,
                      href: "https://www.linkedin.com/in/om-singh-ui-1a761a323/",
                      label: "LinkedIn",
                    },
                    {
                      icon: Instagram,
                      href: "https://www.instagram.com/om_singh_chouhan_/",
                      label: "Instagram",
                    },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-emerald-500 transition-all duration-300 hover:scale-110 group"
                      aria-label={label}
                    >
                      <Icon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-6">Product</h3>
                <ul className="space-y-4">
                  {["Features", "How it works", "Security", "API"].map((item) => (
                    <li key={item}>
                      <Link
                        href={
                          item === "Features" 
                            ? "#features" 
                            : item === "How it works" 
                              ? "#how-it-works" 
                              : "#"
                        }
                        className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-6">Company</h3>
                <ul className="space-y-4">
                  {["Testimonials", "Sign-up"].map((item) => (
                    <li key={item}>
                      <Link
                        href={
                          item === "Testimonials" 
                            ? "#testimonials" 
                            : "/sign-up"
                        }
                        className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()}{" "}
                <span className="font-bold bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
                  Split-Wise-Ui Professional
                </span>
                . All rights reserved.
              </p>
              <p className="text-gray-400 text-sm">
                Designed and developed with ❤️ by{" "}
                <a
                  href="https://github.com/om-singh-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors duration-300"
                >
                  Om-Singh-UI
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

