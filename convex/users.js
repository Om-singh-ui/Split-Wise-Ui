import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Store a user in the database or update if already exists
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const safeName = identity.name?.trim() || "Anonymous";

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (user !== null) {
      if (user.name !== safeName) {
        await ctx.db.patch(user._id, { name: safeName });
      }
      return user._id;
    }

    return await ctx.db.insert("users", {
      name: safeName,
      email: identity.email,
      tokenIdentifier: identity.tokenIdentifier,
      imageUrl: identity.pictureUrl,
    });
  },
});

// Get the currently logged-in user
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
});

// Search users
export const searchUsers = query({
  args: {
    query: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const term = args.query?.toLowerCase()?.trim() ?? "";

    if (term.length === 0) {
      return [];
    }

    const allUsers = await ctx.db.query("users").collect();

    return allUsers
      .filter(
        (u) =>
          u.name?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term)
      )
      .map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        imageUrl: u.imageUrl,
      }));
  },
});
