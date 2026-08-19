"use client";
import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const router = useRouter();
  const { login } = useAuth();

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
        remember: true,
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Login failed.");
        return;
      }

      // Save or remove email based on "Remember Me"
      if (formData.remember) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Update global auth context
      if (data.user) {
        login(data.user);
      } else {
        login(data);
      }

      router.push("/authenticated");
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 w-full max-w-md mx-auto p-8 bg-surface rounded-xl shadow-sm border border-border-subtle mt-10"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-semibold text-text">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}   
          placeholder="you@example.com"
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-border-subtle outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-semibold text-text">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Enter your password"
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-border-subtle outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer text-text-muted hover:text-text">
          <input
            type="checkbox"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            className="rounded border-border-subtle text-primary focus:ring-secondary"
          />
          Remember Me
        </label>

        {/* <a href="#" className="text-primary hover:text-primary-hover font-medium">
          Forgot password?
        </a> */}

      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover focus:ring-2 focus:ring-secondary focus:ring-offset-1 transition-all"
      >
        Log In
      </button>
    </form>
  );
}
