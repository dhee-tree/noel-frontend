export type Gender = "Male" | "Female" | "Prefer not to say";

export interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  gender?: Gender | null;
  address?: string | null;
  is_verified: boolean;
  date_created: string;
}

export interface UpdateProfileInput {
  first_name: string;
  last_name: string;
  gender?: Gender | null;
  address?: string | null;
}

export interface ChangePasswordInput {
  current_password: string;
  new_password: string;
  confirm_password: string;
}
