"use client";
import React from "react";
import SignupForm from "../../components/SignupForm";
import HeaderLogo from "../../components/TAGS_logo";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="av-shell">
      <Nav />
    <div className="signup-page flex flex-col items-center mt-12 gap-y-10">
      <HeaderLogo />
      <h1 className="signup-header text-4xl font-bold mt-4">Sign Up</h1>

      {/* This page.tsx acts as a canvas, and SignupForm is another component that handles all the form submission stuff */}
      <SignupForm />
      <p className="text-sm text-gray-700 text-lg mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-[#800000] underline hover:text-red-700 transition">
            Login
        </Link>
</p>

    </div>
    <Footer />
  </div>
  );
}
