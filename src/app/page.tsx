"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function HeroSection() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white px-6">
      
      {/* Navbar */}
      <nav className="flex w-full max-w-7xl mx-auto items-center justify-between py-6">
        <h1 className="text-2xl font-bold text-blue-800 md:text-3xl">AI Doctor</h1>
        <div className="flex gap-4 items-center">
          <SignedOut>
            <SignInButton>
              <button className="rounded-lg bg-blue-600 px-5 py-2 text-white font-semibold transition-all hover:bg-blue-700">
                Login
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="rounded-lg border border-blue-600 px-5 py-2 text-blue-600 font-semibold transition-all hover:bg-blue-100">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col-reverse md:flex-row items-center max-w-7xl mx-auto mt-16 gap-12">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-blue-800 md:text-5xl lg:text-6xl leading-tight"
          >
            Revolutionize Patient Care with AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-lg text-gray-700 max-w-md"
          >
            Deliver instant, accurate medical advice and support with our AI-powered assistant. Enhance accessibility and efficiency in healthcare like never before.
          </motion.p>

          <motion.button
            onClick={() => router.push("/dashboard")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 rounded-xl bg-gradient-to-r from-blue-600 to-violet-500 px-10 py-4 text-white text-lg font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all"
          >
            Get Started
          </motion.button>
        </div>

        {/* Hero Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex-1"
        >
          <img
            src="https://plus.unsplash.com/premium_photo-1661775601929-8c775187bea6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZG9jdG9yJTIwcGF0aWVudHxlbnwwfHwwfHx8MA%3D%3D" // Place SVG in public/illustrations folder
            alt="Medical AI Illustration"
            className="w-full h-auto rounded-3xl shadow-lg"
          />
        </motion.div>
      </div>
    </div>
  );
}
