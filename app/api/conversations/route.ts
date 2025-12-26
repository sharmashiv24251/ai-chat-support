import { NextRequest } from "next/server";
import { db } from "@/lib/db/db";
import { initializeDatabase } from "@/lib/db/init";
import { conversations, messages } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Initialize database tables if they don't exist
    await initializeDatabase();

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (conversationId) {
      // Fetch specific conversation with its messages
      const conversation = await db.query.conversations.findFirst({
        where: eq(conversations.id, conversationId),
      });

      if (!conversation) {
        return Response.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }

      const conversationMessages = await db.query.messages.findMany({
        where: eq(messages.conversationId, conversationId),
        orderBy: (messages, { asc }) => [asc(messages.createdAt)],
      });

      return Response.json({
        conversation,
        messages: conversationMessages,
      });
    }

    // Fetch all conversations with their messages
    const allConversations = await db.query.conversations.findMany({
      orderBy: (conversations, { desc }) => [desc(conversations.createdAt)],
    });

    const conversationsWithMessages = await Promise.all(
      allConversations.map(async (conv) => {
        const convMessages = await db.query.messages.findMany({
          where: eq(messages.conversationId, conv.id),
          orderBy: (messages, { asc }) => [asc(messages.createdAt)],
        });
        return {
          ...conv,
          messages: convMessages,
        };
      })
    );

    return Response.json({ conversations: conversationsWithMessages });
  } catch (error) {
    console.error("Conversations API Error:", error);
    return Response.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
