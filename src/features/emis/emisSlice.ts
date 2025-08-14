import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';

export interface EMI {
  _id: string;
  institution: string;
  principal: number;
  interestRate: number;
  emiAmount: number;
  dueDayOfMonth: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

interface EMIsState {
  emis: EMI[];
  loading: boolean;
  error: string | null;
}

const initialState: EMIsState = {
  emis: [],
  loading: false,
  error: null,
};

export const fetchEMIs = createAsyncThunk(
  'emis/fetchEMIs',
  async (activeOnly: boolean = false, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/emis${activeOnly ? '?active=true' : ''}`);
      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch EMIs');
    }
  }
);

export const addEMI = createAsyncThunk(
  'emis/addEMI',
  async (emi: Omit<EMI, '_id'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/emis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emi),
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue('Failed to add EMI');
    }
  }
);

export const updateEMI = createAsyncThunk(
  'emis/updateEMI',
  async ({ id, ...emi }: Partial<EMI> & { id: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/emis/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emi),
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue('Failed to update EMI');
    }
  }
);

export const deleteEMI = createAsyncThunk(
  'emis/deleteEMI',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/emis/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete EMI');
    }
  }
);

const emisSlice = createSlice({
  name: 'emis',
  initialState,
  reducers: {
    clearEMIs: (state) => {
      state.emis = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch EMIs
      .addCase(fetchEMIs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEMIs.fulfilled, (state, action) => {
        state.loading = false;
        state.emis = action.payload;
      })
      .addCase(fetchEMIs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add EMI
      .addCase(addEMI.pending, (state) => {
        state.loading = true;
      })
      .addCase(addEMI.fulfilled, (state, action) => {
        state.loading = false;
        state.emis.push(action.payload);
      })
      .addCase(addEMI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update EMI
      .addCase(updateEMI.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEMI.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.emis.findIndex(emi => emi._id === action.payload._id);
        if (index !== -1) {
          state.emis[index] = action.payload;
        }
      })
      .addCase(updateEMI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete EMI
      .addCase(deleteEMI.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEMI.fulfilled, (state, action) => {
        state.loading = false;
        state.emis = state.emis.filter(emi => emi._id !== action.payload);
      })
      .addCase(deleteEMI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearEMIs } = emisSlice.actions;
export default emisSlice.reducer;