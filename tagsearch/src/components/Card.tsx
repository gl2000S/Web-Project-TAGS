"use client";

interface CardInfo {
  title: string
  description: string
};

export default function Card({ title, description }: CardInfo) {
  return (
    <div className="flex-1 bg-surface rounded-lg shadow-sm p-6 max-w-sm outline-1 outline-border-subtle transition duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted">{description}</p>
    </div>
  );
}