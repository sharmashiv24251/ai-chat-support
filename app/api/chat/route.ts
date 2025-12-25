import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse, ChatHistoryMessage } from "@/lib/ai/chat";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history, productSlug } = body as {
      message: string;
      history: ChatHistoryMessage[];
      productSlug?: string;
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const result = await generateChatResponse(
      message,
      history || [],
      productSlug
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
