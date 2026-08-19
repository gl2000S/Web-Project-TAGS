"use client";
import React from "react";
import HeaderLogo from "../../components/TAGS_logo";
import LoginForm from "../../components/LoginForm";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

/* This is the login page that acts as the "canvas", using the HeaderLogo and LoginForm components */

export default function LoginPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="av-shell">
      <Nav />
    <div className="login-page flex flex-col items-center mt-12 gap-y-10">
      <HeaderLogo />
      {/* Display the redirect message if present */}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-center w-full max-w-md">
            {message}
          </div>
        )}

      <h1 className="login-header text-4xl font-bold mt-4">Login</h1>


      <LoginForm />

      <p className="text-sm text-gray-700 text-lg mt-4">
        Need an account?{" "}
        <Link
          href="/signup"
          className="text-[#800000] underline hover:text-red-700 transition"
        >
          Sign Up
        </Link>
      </p>
    </div>
    <Footer />
    </div>
  );
}
