import { configureStore } from '@reduxjs/toolkit';
import expensesReducer from '@/features/expenses/expensesSlice';
import notificationsReducer from '@/features/notifications/notificationsSlice';
import emisReducer from '@/features/emis/emisSlice';
import authReducer from '@/features/auth/authSlice';

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    notifications: notificationsReducer,
    emis: emisReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;