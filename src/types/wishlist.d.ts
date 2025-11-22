export type WishlistPriority = "low" | "medium" | "high";

export interface Wishlist {
  wishlist_id: string;
  user_profile: number;
  name: string;
  group: string;
  group_name?: string;
  date_created: string;
  date_updated: string;
  items: WishlistItem[];
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
