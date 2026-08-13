import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getSnippetsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("snippets")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const createSnippet = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("snippets", {
      userId: args.userId,
      title: args.title,
      content: args.content,
      category: args.category,
      createdAt: Date.now(),
    });
  },
});

export const deleteSnippet = mutation({
  args: { id: v.id("snippets") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
