import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";
import { AuthState, User } from "@/types/auth";

interface LoginPayload {
  email: string;
  password: string;
}

interface SignUpPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface VerifyOtpPayload {
  email: string;
  otp: string;
}

const initialState: AuthState = {
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,
  token:
    typeof window !== "undefined"
      ? localStorage.getItem("token") || null
      : null,
  loading: false,
  error: null,
};


const handleAxiosError = (error: any, defaultMessage: string) => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data?.error) return error.response.data.error;
  return defaultMessage;
};

// -------------------- Thunks --------------------

export const signupUser = createAsyncThunk<User, SignUpPayload>(
  "auth/signupUser",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post("/auth/signup", formData);
      return data;
    } catch (error: any) {
      return rejectWithValue(handleAxiosError(error, "Signup failed"));
    }
  }
);

export const verifyOtp = createAsyncThunk<{ message: string }, VerifyOtpPayload>(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post("/auth/verify-otp", { email, otp });
      return data;
    } catch (error: any) {
      return rejectWithValue(handleAxiosError(error, "OTP verification failed"));
    }
  }
);

export const resendOtp = createAsyncThunk<
  { message: string },
  { email: string }
>(
  "auth/resendOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post("/auth/resend-otp", { email });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to resend OTP"
      );
    }
  }
);


export const loginUser = createAsyncThunk<
  { user: User; token: string },
  LoginPayload
>(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post("/auth/signin", credentials);

      const token = data.accessToken; // ✅ exact match to your backend
      const user = data.user;

      if (!token || !user) throw new Error("Invalid login response from server");

      // Store token locally
      localStorage.setItem("token", token);

      return { user, token }; // ✅ explicitly return this shape
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);


export const updateProfile = createAsyncThunk<User, FormData>(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.patch("/auth/update-profile", formData);
      return data;
    } catch (error: any) {
      return rejectWithValue(handleAxiosError(error, "Profile update failed"));
    }
  }
);

// -------------------- Slice --------------------

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //resend otp

      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      // OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("✅ loginUser.fulfilled payload:", action.payload);
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
