import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Google 로그인
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (idToken, { rejectWithValue }) => {
    try {
      const response = await fetch("/auth/google/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
        credentials: "include",
      });

      if (!response.ok) {
        return rejectWithValue("로그인에 실패했습니다");
      }

      return await response.text();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 로그아웃
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        return rejectWithValue("로그아웃에 실패했습니다");
      }

      return await response.text();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 비동기 액션 생성
export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/auth/check", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue("인증에 실패했습니다");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Google 로그인
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      })
      // 로그아웃
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 인증 체크
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selector 추가
export const selectAuth = (state) => state.auth;

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
