export type WishlistPriority = "low" | "medium" | "high";

export interface Wishlist {
  wishlist_id: string;
  user_profile: number; // user_id
  group: string; // group_id
  group_name?: string; // Populated from backend
  date_created: string;
  date_updated: string;
}

export interface WishlistItem {
  item_id: string;
  wishlist: string; // wishlist_id
  name: string;
  description?: string | null;
  link?: string | null;
  store?: string | null;
  price_estimate?: number | null;
  priority?: WishlistPriority | null;
  is_public: boolean;
  is_purchased: boolean;
  date_created: string;
  date_updated: string;
}

export interface WishlistWithItems extends Wishlist {
  items: WishlistItem[];
}
