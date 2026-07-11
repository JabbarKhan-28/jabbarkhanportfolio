"use client";
import { Construction } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Construction size={40} className="text-white/15 mb-4" />
      <h1 className="text-xl font-bold text-white mb-1">About Section</h1>
      <p className="text-sm text-white/40 max-w-md">Edit your about me section content. This page is coming soon — use the Settings page to configure your bio and profile image for now.</p>
    </div>
  );
}
