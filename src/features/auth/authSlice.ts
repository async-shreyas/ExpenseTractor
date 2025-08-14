import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  accounts: string[];
  sessions: string[];
  preferences: {
    currency: string;
    notifications: {
      email: boolean;
      push: boolean;
      inApp: boolean;
    };
  };
}

interface AuthState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;