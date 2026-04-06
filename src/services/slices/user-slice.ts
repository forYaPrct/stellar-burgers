import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  loginUserApi,
  registerUserApi,
  updateUserApi,
  getUserApi,
  logoutApi
} from '@api';
import { setCookie, deleteCookie } from '../../utils/cookie';

interface IUser {
  user: TUser | null;
  isLogin: boolean;
  isLoading: boolean;
  error: string | undefined;
}

const initialState: IUser = {
  user: null,
  isLogin: false,
  isLoading: true,
  error: undefined
};

export const login = createAsyncThunk(
  'user/login',
  async (loginData: { email: string; password: string }) => {
    const data = await loginUserApi(loginData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

export const registration = createAsyncThunk(
  'user/registration',
  async (registrationUserData: {
    email: string;
    name: string;
    password: string;
  }) => {
    const data = await registerUserApi(registrationUserData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

export const edit = createAsyncThunk(
  'user/edit',
  async (userData: { email: string; name: string; password: string }) => {
    const data = await updateUserApi(userData);
    return data;
  }
);

export const getUserData = createAsyncThunk('user/getUserData', async () => {
  const data = await getUserApi();
  return data;
});

export const logout = createAsyncThunk('user/logout', async () => {
  const data = await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
  return data;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
        state.isLogin = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
        state.error = undefined;
        state.isLogin = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(registration.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(registration.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
        state.error = undefined;
        state.isLogin = true;
      })
      .addCase(registration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(edit.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLogin = true;
      })
      .addCase(getUserData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLogin = true;
        state.isLoading = false;
      })
      .addCase(getUserData.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.user = null;
        state.isLogin = false;
      });
  },
  selectors: {
    getUser: (state) => {
      state.user;
    },
    isAuthenticated: (state) => {
      state.isLogin;
    }
  }
});

export const { getUser, isAuthenticated } = userSlice.selectors;
export default userSlice.reducer;
