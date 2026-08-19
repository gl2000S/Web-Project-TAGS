"use client";

import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Nav isLoggedIn={false} />

      <main className="flex-grow w-full max-w-4xl mx-auto px-5 py-10 flex flex-col gap-10">
        
        {/* Intro Section */}
        <section className="flex flex-col gap-4 text-center">
          <h1 className="text-4xl font-bold text-text mb-2">About TAGSearch</h1>
          <p className="text-lg text-text-muted leading-relaxed max-w-2xl mx-auto">
            TAGSearch is a job-finding platform created at the University of Georgia.
            Our mission is to make it easier for UGA students to discover internships, part-time positions,
            and full-time employment opportunities in Athens.
          </p>
          <p className="text-lg text-text-muted leading-relaxed max-w-2xl mx-auto">
            TAGSearch brings together job listings from trusted external APIs as well as postings submitted
            by our community. Whether you're searching for an internship or a full-time role, we make it easy
            to explore opportunities in Athens.
          </p>
        </section>

        {/* Why Us Section */}
        <section className="flex flex-col gap-6 items-center">
          <h2 className="text-3xl font-semibold text-text">Why TAGSearch?</h2>
          
          <ul className="grid md:grid-cols-3 gap-6 w-full text-center"> 
            <li className="bg-surface p-6 rounded-lg border border-border-subtle shadow-sm hover:shadow-md transition-shadow duration-200">
              <strong className="block text-primary text-xl mb-2">Local</strong>
              <span className="text-text-muted">Prioritizes Athens-based listings so students get relevant results.</span>
            </li>
            <li className="bg-surface p-6 rounded-lg border border-border-subtle shadow-sm hover:shadow-md transition-shadow duration-200">
              <strong className="block text-primary text-xl mb-2">Accessible</strong>
              <span className="text-text-muted">Clean filters, simple layout, and fast job browsing.</span>
            </li>
            <li className="bg-surface p-6 rounded-lg border border-border-subtle shadow-sm hover:shadow-md transition-shadow duration-200">
              <strong className="block text-primary text-xl mb-2">UGA Community</strong>
              <span className="text-text-muted">Developed entirely by UGA students to help fellow students.</span>
            </li>
          </ul>
        </section>

        {/* Contact CTA Section */}
        <section className="text-center py-8 border-t border-border-subtle mt-4">
          <h2 className="text-2xl font-semibold text-text mb-3">Have suggestions?</h2>
          <p className="text-text-muted">
            We’d love to hear from you. Visit our{" "}
            <Link href="/contact" className="text-primary font-medium hover:underline hover:text-primary-hover transition-colors">
              Contact
            </Link>{" "}
            page to get in touch.
          </p>
        </section>

      </main>

      <Footer />
    </div>
  );
}