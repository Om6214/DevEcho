export interface Post {
  id: string;
  content: string;
  image_url?: string;
  author: string;
  createdAt: string;
}

export interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}
