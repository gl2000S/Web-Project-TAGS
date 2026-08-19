"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Nav() {
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // close mobile menu when a link is clicked
  const handleNavClick = (path: string) => {
    setIsMobileMenuOpen(false);
    router.push(path);
  };

  let acctButtons;

  if (isLoggedIn) {
    const displayName = user?.name ?? "User";
    acctButtons = (
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <span className="text-sm font-medium text-text-muted">
          Welcome, <span className="text-text font-semibold">{displayName}</span>
        </span>
        <button
          className="text-sm font-medium text-primary hover:text-primary-hover"
          onClick={async () => {
            await fetch("/api/logout", { method: "POST" });
            logout();
            router.push("/login?message=Logged out successfully");
            setIsMobileMenuOpen(false);
          }}
        >
          Sign Out
        </button>
      </div>
    );
  } else {
    acctButtons = (
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <button
          className="text-sm font-medium text-text hover:text-primary"
          onClick={() => handleNavClick("/login")}
        >
          Sign In
        </button>
        <button
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium w-full md:w-auto"
          onClick={() => handleNavClick("/signup")}
        >
          Register
        </button>
      </div>
    );
  }

  return (
    <nav className="w-full bg-surface border-b border-border-subtle sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <button
            className="text-xl font-bold tracking-tight text-text hover:text-primary transition-colors"
            onClick={() => handleNavClick("/")}
          >
            TAGS
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button className="text-sm font-medium text-text hover:text-primary" onClick={() => router.push("/authenticated")}>Jobs</button>
            <button className="text-sm font-medium text-text hover:text-primary" onClick={() => router.push("/add")}>Post a Listing</button>
            <Link href="/about" className="text-sm font-medium text-text hover:text-primary">About</Link>
            <Link href="/contact" className="text-sm font-medium text-text hover:text-primary">Contact</Link>
            
            <div className="pl-4 ml-2 border-l border-border-subtle flex items-center gap-4">
               {acctButtons}
            </div>
          </div>

          {/* Hamburger Button (Visible only on Mobile) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-text hover:text-primary p-2 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                // X Icon
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Menu Icon
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border-subtle bg-surface px-4 pt-2 pb-6 space-y-4 shadow-lg">
          <div className="flex flex-col space-y-3 mt-4">
             <button className="text-left text-base font-medium text-text hover:text-primary" onClick={() => handleNavClick("/authenticated")}>Jobs</button>
             <button className="text-left text-base font-medium text-text hover:text-primary" onClick={() => handleNavClick("/add")}>Post a Listing</button>
             <Link href="/about" className="text-base font-medium text-text hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
             <Link href="/contact" className="text-base font-medium text-text hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          </div>
          
          <div className="pt-4 border-t border-border-subtle">
              {acctButtons}
          </div>
        </div>
      )}
    </nav>
  );
}