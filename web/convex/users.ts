import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getOrCreateUser = mutation({
  args: {
    email: v.string(),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .first();

    if (existing) {
      return existing;
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      tokenIdentifier: args.tokenIdentifier,
      createdAt: Date.now(),
    });

    await ctx.db.insert("userSettings", {
      userId,
      defaultLanguage: "en",
      defaultTone: "casual",
      autoAnalyzeClip: true,
      autoDetectImage: true,
    });

    const defaultPrompts = [
      {
        shortcut: "!fix",
        title: "Fix Grammar",
        systemPrompt: "Fix spelling, grammar, and punctuation while maintaining tone.",
      },
      {
        shortcut: "!shorter",
        title: "Make Shorter",
        systemPrompt: "Rewrite to be concise and punchy without losing main points.",
      },
      {
        shortcut: "!formal",
        title: "Make Formal",
        systemPrompt: "Rewrite in a professional and polite tone.",
      },
      {
        shortcut: "!witty",
        title: "Make Witty",
        systemPrompt: "Add subtle humor and charm to the message.",
      },
    ];

    for (const prompt of defaultPrompts) {
      await ctx.db.insert("customPrompts", {
        userId,
        shortcut: prompt.shortcut,
        title: prompt.title,
        systemPrompt: prompt.systemPrompt,
        createdAt: Date.now(),
      });
    }

    return await ctx.db.get(userId);
  },
});

export const getUserByToken = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .first();
  },
});
