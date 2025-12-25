import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey(),
  createdAt: text("created_at").notNull(),
});

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversations.id),
  role: text("role", { enum: ["user", "assistant"] }).notNull(),
  content: text("content").notNull(),
  createdAt: text("created_at").notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
