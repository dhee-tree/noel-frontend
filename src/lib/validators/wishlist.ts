import { z } from "zod";

/**
 * Schema for creating a new wishlist
 */
export const createWishlistSchema = z.object({
  group: z.string().uuid("Please select a valid group"),
});

/**
 * Schema for editing a wishlist
 */
export const editWishlistSchema = z.object({});

/**
 * Schema for creating/editing a wishlist item
 */
export const wishlistItemSchema = z.object({
  name: z
    .string()
    .min(1, "Item name is required")
    .max(255, "Item name must be 255 characters or less"),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .optional()
    .or(z.literal("")),
  link: z
    .string()
    .url("Please enter a valid URL")
    .max(1000, "URL must be 1000 characters or less")
    .optional()
    .or(z.literal("")),
  store: z
    .string()
    .max(255, "Store name must be 255 characters or less")
    .optional()
    .or(z.literal("")),
  price_estimate: z
    .number()
    .max(999999.99, "Price is too large")
    .optional()
    .nullable(),
  priority: z.enum(["low", "medium", "high"]).optional().nullable(),
  is_public: z.boolean().default(true),
  is_purchased: z.boolean().default(false),
});

export type CreateWishlistInput = z.infer<typeof createWishlistSchema>;
export type EditWishlistInput = z.infer<typeof editWishlistSchema>;
