import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getPromptsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("customPrompts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const createPrompt = mutation({
  args: {
    userId: v.id("users"),
    shortcut: v.string(),
    title: v.string(),
    systemPrompt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("customPrompts", {
      userId: args.userId,
      shortcut: args.shortcut,
      title: args.title,
      systemPrompt: args.systemPrompt,
      createdAt: Date.now(),
    });
  },
});

export const deletePrompt = mutation({
  args: { id: v.id("customPrompts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
