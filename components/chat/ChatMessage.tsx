interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  if (role === "assistant") {
    return (
      <div className="flex items-start gap-3 animate-fadeIn">
        <div className="h-6 w-6 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 flex-shrink-0 mt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
        </div>
        <div className="bg-white border border-neutral-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-neutral-700 leading-relaxed max-w-[85%]">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 justify-end animate-fadeIn">
      <div className="bg-black text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed max-w-[85%] shadow-md">
        {content}
      </div>
    </div>
  );
}
