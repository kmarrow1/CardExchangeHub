import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { postRegisterUser, postLoginUser, getVerifyLogin } from './authApi';

export interface AuthState {
  token: string | null;
  userName: string | null;
  email: string | null;
  _id: string | null;
  registerStatus: 'idle' | 'pending' | 'succeeded' | 'failed';
  registerError: null | string | undefined;
  loginStatus: 'idle' | 'pending' | 'succeeded' | 'failed';
  loginError: null | string | undefined;
  userLoaded: boolean;
  loginModalOpen: boolean;
}

export interface User {
  userName: string;
  email: string;
  _id: string;
}

const initialState: AuthState = {
  token: null,
  userName: null,
  email: null,
  _id: null,
  registerStatus: 'idle',
  registerError: null,
  loginStatus: 'idle',
  loginError: null,
  userLoaded: false,
  loginModalOpen: false,
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  postRegisterUser
);

export const loginUser = createAsyncThunk('auth/loginUser', postLoginUser);

export const verifyLogin = createAsyncThunk('auth/veryifyUser', getVerifyLogin);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // loadUser: (state) => {
    //   const token = state.token;

    //   if (token) {
    //     const user: User = jwtDecode(token);
    //     const { userName, email, _id } = user;

    //     state.token = token;
    //     state.userName = userName;
    //     state.email = email;
    //     state._id = _id;
    //     state.userLoaded = true;
    //   }
    // },
    resetLoginState: (state) => {
      state.loginStatus = 'idle';
      state.loginError = null;
    },
    logoutUser: (state) => {
      state = initialState;
    },
    toggleAuthModal: (state) => {
      if (state.loginModalOpen) {
        state.loginStatus = 'idle';
        state.loginError = null;
      }
      state.loginModalOpen = !state.loginModalOpen;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(registerUser.pending, (state, action) => {
        state.registerStatus = 'pending';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        if (action.payload.token) {
          const user: User = action.payload;
          const { userName, email, _id } = user;
          state.registerStatus = 'succeeded';
          state.token = action.payload;
          state.userName = userName;
          state.email = email;
          state._id = _id;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = 'failed';
        state.registerError = action.error.message;
      })
      .addCase(loginUser.pending, (state, action) => {
        state.loginStatus = 'pending';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        if (action.payload.token) {
          const user: User = action.payload;
          const { userName, email, _id } = user;
          state.loginStatus = 'succeeded';
          state.token = action.payload;
          state.userName = userName;
          state.email = email;
          state._id = _id;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = 'failed';
        if (typeof action.payload === 'string') {
          state.loginError = action.payload;
        }
      })
      .addCase(verifyLogin.pending, (state, action) => {
        state.loginStatus = 'pending';
      })
      .addCase(verifyLogin.fulfilled, (state, action) => {
        if (action.payload.token) {
          const user: User = action.payload;
          const { userName, email, _id } = user;
          state.loginStatus = 'succeeded';
          state.token = action.payload;
          state.userName = userName;
          state.email = email;
          state._id = _id;
        }
      })
      .addCase(verifyLogin.rejected, (state, action) => {
        state.loginStatus = 'failed';
        if (typeof action.payload === 'string') {
          state.loginError = action.payload;
        }
      });
  },
});

export const selectAuth = (state: RootState) => state.auth;
export const selectAuthModal = (state: RootState) => state.auth.loginModalOpen;

export const { logoutUser, toggleAuthModal } = authSlice.actions;

export default authSlice.reducer;