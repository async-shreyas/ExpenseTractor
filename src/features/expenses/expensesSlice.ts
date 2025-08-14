import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  receiptUrl?: string;
  currency: string;
}

interface ExpensesState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const initialState: ExpensesState = {
  expenses: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 50,
    pages: 0,
  },
};

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (params: { period?: string; limit?: number; page?: number } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.period) queryParams.append('period', params.period);
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.page) queryParams.append('page', params.page.toString());

      const response = await fetch(`/api/expenses?${queryParams.toString()}`);
      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch expenses');
    }
  }
);

export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (expense: Omit<Expense, '_id'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue('Failed to add expense');
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async ({ id, ...expense }: Partial<Expense> & { id: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue('Failed to update expense');
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete expense');
    }
  }
);

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    clearExpenses: (state) => {
      state.expenses = [];
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload.expenses;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add expense
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update expense
      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.expenses.findIndex(expense => expense._id === action.payload._id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete expense
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = state.expenses.filter(expense => expense._id !== action.payload);
        state.pagination.total -= 1;
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearExpenses } = expensesSlice.actions;
export default expensesSlice.reducer;