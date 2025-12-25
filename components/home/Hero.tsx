"use client";

interface HeroProps {
  onChatOpen?: () => void;
}

export default function Hero({ onChatOpen }: HeroProps) {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 px-6 lg:px-10 max-w-screen-2xl mx-auto">
      <div className="flex flex-col max-w-3xl items-start">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-white/50 backdrop-blur text-xs font-medium text-neutral-600 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          AI-Powered Shopping
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl tracking-tighter font-medium text-neutral-900 leading-[1.1]">
          Buy more, <br />
          <span className="font-serif italic text-neutral-500">
            think less.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-8 text-lg text-neutral-500 font-light max-w-lg leading-relaxed">
          Meet your personal shopping assistant. Ask about products, compare
          specs, check shipping — all through natural conversation.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          {/* Primary Button */}
          <button
            onClick={scrollToProducts}
            className="group relative h-12 px-8 rounded-full overflow-hidden border border-neutral-900 bg-neutral-900 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
          >
            <div className="absolute inset-0 w-full h-full bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left"></div>
            <div className="relative flex items-center gap-2 group-hover:text-neutral-900 transition-colors duration-300">
              <span className="font-medium">Browse Products</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Secondary Button */}
          <button
            onClick={onChatOpen}
            className="group relative h-12 px-6 rounded-full overflow-hidden border border-neutral-200 bg-white text-neutral-600 transition-all duration-300 hover:border-neutral-300 hover:shadow-sm"
          >
            <div className="absolute inset-0 w-full h-full bg-neutral-50 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom"></div>
            <div className="relative flex items-center gap-2 group-hover:text-neutral-900 transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                <path d="M5 3v4" />
                <path d="M19 17v4" />
                <path d="M3 5h4" />
                <path d="M17 19h4" />
              </svg>
              <span className="font-medium">Ask AI</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
