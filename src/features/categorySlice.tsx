import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Category } from "../types/category.types";
import { RootState } from "../store/store";
import supabase from "../utils/core/supabase";

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const { data, error } = await supabase
      .from<Category>("categories")
      .select();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
);

export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (newCategory: Category) => {
    const { data, error } = await supabase
      .from<Category>("categories")
      .insert(newCategory)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({
    id,
    updatedCategory,
  }: {
    id: number;
    updatedCategory: Category;
  }) => {
    const { data, error } = await supabase
      .from<Category>("categories")
      .update(updatedCategory)
      .eq("id", id)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (categoryId: number) => {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);
    if (error) {
      throw new Error(error.message);
    }
    return categoryId;
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "An error occurred";
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (category) => category.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload
        );
      });
  },
});

export const selectCategories = (state: RootState) =>
  state.categories.categories;

export default categoriesSlice.reducer;
