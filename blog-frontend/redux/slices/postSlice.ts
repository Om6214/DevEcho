import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";
import { Post, PostState } from "@/types/post";

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
};

export const fetchAllPosts = createAsyncThunk<Post[]>(
  "posts/fetchAll",
  async () => {
    const { data } = await axiosClient.get("/posts/all");
    return data;
  }
);

export const createPost = createAsyncThunk<Post, { content: string; image_url?: string }>(
  "posts/create",
  async (postData) => {
    const { data } = await axiosClient.post("/posts", postData);
    return data;
  }
);

export const updatePost = createAsyncThunk<Post, { id: string; content: string }>(
  "posts/update",
  async ({ id, content }) => {
    const { data } = await axiosClient.put(`/posts/${id}`, { content });
    return data;
  }
);

export const deletePost = createAsyncThunk<string, string>(
  "posts/delete",
  async (id) => {
    await axiosClient.delete(`/posts/${id}`);
    return id;
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.posts.unshift(action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<string>) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: any) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export default postSlice.reducer;
