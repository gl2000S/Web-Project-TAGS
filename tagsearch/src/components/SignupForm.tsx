"use client";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Signup failed");
        return;
      }
      router.push("/login?message=Account created successfully! Please log in.");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-md mx-auto p-8 bg-surface rounded-xl shadow-sm border border-border-subtle mt-10">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-semibold text-text">Name</label>
        <input 
            id="name" name="name" type="text" required
            placeholder="First and last name" onChange={handleChange} 
            className="w-full px-4 py-2 rounded-lg border border-border-subtle outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-semibold text-text">Email</label>
        <input 
            id="email" name="email" type="email" required
            placeholder="you@example.com" onChange={handleChange} 
            className="w-full px-4 py-2 rounded-lg border border-border-subtle outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-semibold text-text">Password</label>
        <input 
            id="password" name="password" type="password" required
            minLength={6} placeholder="Create a password" onChange={handleChange} 
            className="w-full px-4 py-2 rounded-lg border border-border-subtle outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover focus:ring-2 focus:ring-secondary focus:ring-offset-1 transition-all"
      >
        Sign Up
      </button>
    </form>
  );
}