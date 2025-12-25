"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import ProductGrid from "@/components/home/ProductGrid";
import ChatWidget from "@/components/chat/ChatWidget";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Decorative Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-neutral-200/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-neutral-200/40 rounded-full blur-[120px]"></div>
      </div>

      <Header />

      <main className="flex-1 relative z-10">
        <Hero onChatOpen={() => setChatOpen(true)} />
        <ProductGrid />
      </main>

      <Footer />

      {/* Floating AI Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(!chatOpen)} />
      </div>
    </div>
  );
}
