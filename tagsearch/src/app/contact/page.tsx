"use client";

import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

type TeamMember = {
  name: string;
  email: string;
  role: string;
};

const TEAM_MEMBERS: TeamMember[] = [
  // 💡 Update these with your real team info
  { name: "Alina Tran", email: "amt83612@uga.edu", role: "Github Captain" },
  { name: "Trent Utterback", email: "tru00790@uga.edu", role: "Team Leader" },
  { name: "Spencer Freese", email: "swf94662@uga.edu", role: "Project Manager" },
  { name: "Gabriel Lee", email: "gl20330@uga.edu", role: "Communication Lead" }
];

export default function ContactPage() {
    const contact = {
        address: "University of Georgia, Athens, GA",
        phone: "(123) 456-7890",
        email: "contactTAGS@uga.edu"
    };

    return (
        <main className="min-h-screen flex flex-col bg-surface">
            <Nav isLoggedIn={false} />

            <section className="flex-grow w-full max-w-4xl mx-auto px-5 py-10 flex flex-col gap-10">
                
                {/* Header & Contact Info */}
                <div className="text-center flex flex-col gap-4">
                    <h1 className="text-4xl font-bold text-text">Contact Us</h1>
                    <p className="text-lg text-text-muted leading-relaxed max-w-2xl mx-auto">
                        Have ideas or feedback? <br className="hidden md:block" />
                        We’d love to hear from you — feel free to reach out!
                    </p>

                    <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm font-medium text-text">
                        <span className="flex items-center gap-2">
                            {contact.address}
                        </span>
                        <span className="flex items-center gap-2">
                            {contact.email}
                        </span>
                        <span className="flex items-center gap-2">
                            {contact.phone}
                        </span>
                    </div>
                </div>

                {/* Team Section */}
                <section className="flex flex-col gap-6">
                    <h2 className="text-2xl font-semibold text-text border-b border-border-subtle pb-2">Our Team</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {TEAM_MEMBERS.map((member) => (
                            <div 
                                key={member.email} 
                                className="bg-surface p-6 rounded-lg border border-border-subtle shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-2"
                            >
                                <p className="text-lg font-bold text-primary">{member.name}</p>
                                <p className="text-text font-medium">{member.role}</p>
                                <a href={`mailto:${member.email}`} className="text-sm text-text-muted hover:text-primary transition-colors">
                                    {member.email}
                                </a>
                            </div>
                        ))}
                    </div>
                </section>
            </section>

            <Footer />
        </main>
    );
}