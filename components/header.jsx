"use client"

import { useStoreUser } from "@/hooks/use-store-users"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { BarLoader } from "react-spinners"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { LayoutDashboard, LogIn, UserPlus } from "lucide-react"
import Image from "next/image"

const Header = () => {
  const { isLoading } = useStoreUser()
  const path = usePathname()
  const [animate, setAnimate] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      setAnimate(true)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-black/95 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl"
          : "bg-black/80 backdrop-blur-md border-b border-gray-800/30"
      } ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
    >
      <nav className="w-full px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10  h-10  rounded-b-none flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                <Image
                  src="/logos/logo.png"
                  alt="Split-Wise Logo"
                  width={24}
                  height={24}
                  className="w-11 h-11 object-contain"
                />
              </div>
             
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-white bg-clip-text text-transparent">
                Split-Wise-Ui
              </span>
              <span className="text-xs text-emerald-400 font-medium -mt-1">Om-Singh-Ui</span>
            </div>
          </Link>

          {/* Navigation Links */}
          {path === "/" && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="relative text-gray-300 hover:text-white text-sm font-medium transition-all duration-300 group py-2"
              >
                Features
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </Link>
              <Link
                href="#how-it-works"
                className="relative text-gray-300 hover:text-white text-sm font-medium transition-all duration-300 group py-2"
              >
                How it Works
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </Link>
            </div>
          )}

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300 flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Get Started
                </Button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="ml-2">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        "w-10 h-10 ring-2 ring-emerald-500/30 hover:ring-emerald-400/50 transition-all duration-300",
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </nav>

      {isLoading && (
        <div className="w-full">
          <BarLoader width="100%" color="#10B981" />
        </div>
      )}
    </header>
  )
}

export default Header
