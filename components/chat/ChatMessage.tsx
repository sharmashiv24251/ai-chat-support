"use client";

import ReactMarkdown from "react-markdown";
import ProductMiniCard from "./ProductMiniCard";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

// Regex to match [[product:slug]] syntax
const PRODUCT_CARD_REGEX = /\[\[product:([a-z0-9-]+)\]\]/g;

// Parse content and split into text segments and product cards
function parseContentWithProductCards(
  content: string
): Array<{ type: "text" | "product"; value: string }> {
  const segments: Array<{ type: "text" | "product"; value: string }> = [];
  let lastIndex = 0;
  let match;

  // Reset regex lastIndex
  PRODUCT_CARD_REGEX.lastIndex = 0;

  while ((match = PRODUCT_CARD_REGEX.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index);
      if (textBefore.trim()) {
        segments.push({ type: "text", value: textBefore });
      }
    }

    // Add the product card
    segments.push({ type: "product", value: match[1] });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last match
  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex);
    if (remainingText.trim()) {
      segments.push({ type: "text", value: remainingText });
    }
  }

  // If no product cards found, return the whole content as text
  if (segments.length === 0) {
    segments.push({ type: "text", value: content });
  }

  return segments;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  if (role === "assistant") {
    const segments = parseContentWithProductCards(content);

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
        <div className="bg-white border border-neutral-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-neutral-700 leading-relaxed max-w-[85%] prose prose-sm prose-neutral">
          {segments.map((segment, index) => {
            if (segment.type === "product") {
              return <ProductMiniCard key={index} slug={segment.value} />;
            }
            return (
              <ReactMarkdown
                key={index}
                components={{
                  p: ({ children }) => (
                    <p className="mb-2 last:mb-0">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-neutral-900">
                      {children}
                    </strong>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-2 space-y-1">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-2 space-y-1">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li className="ml-2">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-neutral-300 pl-3 italic text-neutral-600 my-2">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="bg-neutral-100 text-neutral-800 px-1.5 py-0.5 rounded text-xs font-mono">
                      {children}
                    </code>
                  ),
                }}
              >
                {segment.value}
              </ReactMarkdown>
            );
          })}
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
