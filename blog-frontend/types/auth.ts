export interface User {
    id: string;
    name: string;
    email: string;
    bio?: string;
    profile_image?: string;
    cover_image?: string;
    location?: string;
    personal_link?: string;
    created_at: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}