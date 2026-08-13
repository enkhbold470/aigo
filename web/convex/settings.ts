import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getSettings = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const updateSettings = mutation({
  args: {
    userId: v.id("users"),
    defaultLanguage: v.optional(v.string()),
    defaultTone: v.optional(v.string()),
    autoAnalyzeClip: v.optional(v.boolean()),
    autoDetectImage: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...(args.defaultLanguage !== undefined && { defaultLanguage: args.defaultLanguage }),
        ...(args.defaultTone !== undefined && { defaultTone: args.defaultTone }),
        ...(args.autoAnalyzeClip !== undefined && { autoAnalyzeClip: args.autoAnalyzeClip }),
        ...(args.autoDetectImage !== undefined && { autoDetectImage: args.autoDetectImage }),
      });
      return existing._id;
    }

    return await ctx.db.insert("userSettings", {
      userId: args.userId,
      defaultLanguage: args.defaultLanguage ?? "en",
      defaultTone: args.defaultTone ?? "casual",
      autoAnalyzeClip: args.autoAnalyzeClip ?? true,
      autoDetectImage: args.autoDetectImage ?? true,
    });
  },
});
