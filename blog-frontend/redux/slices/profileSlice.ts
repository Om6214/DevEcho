import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

interface UserProfile {
    id: string;
    username: string;
    name: string
    email?: string;
    profile_image?: string;
    cover_image?: string;
    bio?: string;
    location?: string;
    personal_link?: string;
    followersCount?: number;
    followingCount?: number;
    followers?: any[];
    following?: any[];
    created_at: string;
}

interface ProfileState {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: ProfileState = {
    profile: null,
    loading: false,
    error: null,
    success: false,
};

// ✅ Fetch user profile
export const getProfile = createAsyncThunk(
    "profile/getProfile",
    async (userId: string, { rejectWithValue, getState }: any) => {
        try {
            const { auth } = getState();
            const token = auth?.token;

            const res = await axiosClient.get(`/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
        }
    }
);

// ✅ Update user profile
export const updateProfile = createAsyncThunk(
    "profile/updateProfile",
    async (formData: FormData, { rejectWithValue, getState }: any) => {
        try {
            const { auth } = getState();
            const token = auth?.token;

            const res = await axiosClient.patch(`/user/update-profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to update profile");
        }
    }
);

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        resetProfileState: (state) => {
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get profile
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
                state.loading = false;
                state.profile = action.payload;
                state.success = true;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            });
    },
});

export const { resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;
