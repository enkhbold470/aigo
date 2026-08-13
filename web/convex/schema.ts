import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    tokenIdentifier: v.string(),
    createdAt: v.number(),
  }).index("by_token", ["tokenIdentifier"]),

  userSettings: defineTable({
    userId: v.id("users"),
    defaultLanguage: v.string(),
    defaultTone: v.string(),
    autoAnalyzeClip: v.boolean(),
    autoDetectImage: v.boolean(),
  }).index("by_userId", ["userId"]),

  customPrompts: defineTable({
    userId: v.id("users"),
    shortcut: v.string(),
    title: v.string(),
    systemPrompt: v.string(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  snippets: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    category: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  clipHistory: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("text"), v.literal("image")),
    preview: v.string(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
});
