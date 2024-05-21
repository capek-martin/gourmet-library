import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../utils/core/supabase";
import { keys } from "../utils/app/keys";

// Define type for user information
export interface UserInfo {
  user_id: string;
  email: string;
}

// Define type for user state
interface UserState {
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;
}

// Retrieve user information from session storage
const getUserInfoFromSessionStorage = (): UserInfo | null => {
  const userInfoJSON = sessionStorage.getItem(keys.USER);
  return userInfoJSON ? JSON.parse(userInfoJSON) : null;
};

// Get initial state from session storage or use default
const initialState: UserState = {
  userInfo: getUserInfoFromSessionStorage(),
  loading: false,
  error: null,
};

// Asynchronous actions
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return rejectWithValue(error.message);
    }
    if (user && user.email) {
      return { user_id: user.id, email: user.email };
    }
    return rejectWithValue("Registration failed");
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) {
      return rejectWithValue(error.message);
    }
    if (user && user.email) {
      return { user_id: user.id, email: user.email };
    }
    return rejectWithValue("Login failed");
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return rejectWithValue(error.message);
    }
    return true;
  }
);

// Create user slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      // Update session storage when user info is set
      sessionStorage.setItem(keys.USER, JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.userInfo = null;
      // Clear session storage when user info is cleared
      sessionStorage.removeItem(keys.USER);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        sessionStorage.setItem(keys.USER, JSON.stringify(state.userInfo));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        sessionStorage.setItem(keys.USER, JSON.stringify(state.userInfo));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.userInfo = null;
        sessionStorage.removeItem(keys.USER);
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { setUser, clearUser } = userSlice.actions;

// Selector function to select user information from state
export const selectUser = (state: any) => state.user.userInfo;
export const selectUserLoading = (state: any) => state.user.loading;
export const selectUserError = (state: any) => state.user.error;

// Export reducer
export default userSlice.reducer;
