import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';

interface Notification {
  _id: string;
  title: string;
  body: string;
  type: 'reminder' | 'payment' | 'system';
  readAt: string | null;
  createdAt: string;
}

interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
}

const initialState: NotificationsState = {
  notifications: [],
  loading: false,
  error: null,
  unreadCount: 0,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch notifications');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return id;
    } catch (error) {
      return rejectWithValue('Failed to mark notification as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return true;
    } catch (error) {
      return rejectWithValue('Failed to mark all notifications as read');
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.readAt) {
        state.unreadCount += 1;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n: Notification) => !n.readAt).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n._id === action.payload);
        if (notification && !notification.readAt) {
          notification.readAt = new Date().toISOString();
          state.unreadCount -= 1;
        }
      })
      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          if (!notification.readAt) {
            notification.readAt = new Date().toISOString();
          }
        });
        state.unreadCount = 0;
      });
  },
});

export const { addNotification, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;