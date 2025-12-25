import { NextRequest } from "next/server";
import { generateChatResponseStream, ChatHistoryMessage } from "@/lib/ai/chat";
import { websiteInfo } from "@/lib/constants/website";
import { getProductBySlug } from "@/lib/constants/products";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history, productSlug } = body as {
      message: string;
      history: ChatHistoryMessage[];
      productSlug?: string;
    };

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create a ReadableStream for streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = "";

          // Stream the AI response
          for await (const chunk of generateChatResponseStream(
            message,
            history || [],
            productSlug
          )) {
            fullResponse += chunk;
            // Send chunk as JSON with a newline delimiter
            const data = JSON.stringify({ chunk }) + "\n";
            controller.enqueue(encoder.encode(data));
          }

          // Send suggested questions at the end
          const suggestedQuestions = productSlug
            ? getProductBySlug(productSlug)?.predefinedQuestions || []
            : websiteInfo.defaultChatChips;

          const finalData = JSON.stringify({
            done: true,
            suggestedQuestions,
            fullResponse,
          }) + "\n";
          controller.enqueue(encoder.encode(finalData));
          controller.close();
        } catch (error) {
          console.error("Stream Error:", error);
          const errorData = JSON.stringify({
            error: "Failed to generate response",
          }) + "\n";
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate response" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
