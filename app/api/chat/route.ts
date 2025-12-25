import { NextRequest } from "next/server";
import { generateChatResponse, ChatHistoryMessage } from "@/lib/ai/chat";
import { db } from "@/lib/db/db";
import { conversations, messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Validation constants
const MAX_MESSAGE_LENGTH = 4000;

// Helper to generate UUIDs
function generateId(): string {
  return crypto.randomUUID();
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body safely
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate body is an object
    if (!body || typeof body !== "object") {
      return Response.json(
        { error: "Request body must be an object" },
        { status: 400 }
      );
    }

    const { message, conversationId, productSlug } = body as {
      message?: unknown;
      conversationId?: unknown;
      productSlug?: unknown;
    };

    // Validate message exists and is a string
    if (message === undefined || message === null) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    if (typeof message !== "string") {
      return Response.json(
        { error: "Message must be a string" },
        { status: 400 }
      );
    }

    // Validate message is not empty
    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return Response.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    // Validate message length
    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return Response.json(
        {
          error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`,
        },
        { status: 400 }
      );
    }

    // Validate conversationId if provided
    if (conversationId !== undefined && typeof conversationId !== "string") {
      return Response.json(
        { error: "conversationId must be a string" },
        { status: 400 }
      );
    }

    // Validate productSlug if provided
    if (productSlug !== undefined && typeof productSlug !== "string") {
      return Response.json(
        { error: "productSlug must be a string" },
        { status: 400 }
      );
    }

    // Handle conversation: create new or fetch existing
    let currentConversationId: string;
    let chatHistory: ChatHistoryMessage[] = [];

    if (conversationId) {
      // Verify conversation exists
      const existingConversation = await db.query.conversations.findFirst({
        where: eq(conversations.id, conversationId),
      });

      if (!existingConversation) {
        return Response.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }

      currentConversationId = conversationId;

      // Fetch existing messages for chat history
      const existingMessages = await db.query.messages.findMany({
        where: eq(messages.conversationId, conversationId),
        orderBy: (messages, { asc }) => [asc(messages.createdAt)],
      });

      chatHistory = existingMessages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));
    } else {
      // Create new conversation
      currentConversationId = generateId();
      await db.insert(conversations).values({
        id: currentConversationId,
        createdAt: new Date().toISOString(),
      });
    }

    // Persist user message
    const userMessageId = generateId();
    await db.insert(messages).values({
      id: userMessageId,
      conversationId: currentConversationId,
      role: "user",
      content: trimmedMessage,
      createdAt: new Date().toISOString(),
    });

    // Generate AI response using existing logic (unchanged)
    const { response: aiResponse } = await generateChatResponse(
      trimmedMessage,
      chatHistory,
      typeof productSlug === "string" ? productSlug : undefined
    );

    // Persist AI response
    const aiMessageId = generateId();
    await db.insert(messages).values({
      id: aiMessageId,
      conversationId: currentConversationId,
      role: "assistant",
      content: aiResponse,
      createdAt: new Date().toISOString(),
    });

    // Return response with conversationId
    return Response.json({
      reply: aiResponse,
      conversationId: currentConversationId,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
