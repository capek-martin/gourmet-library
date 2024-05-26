import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../utils/core/supabase";

// TODO - proper types!!
// get rid of "any"

interface FavoriteState {
  favourites: string[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoriteState = {
  favourites: [],
  loading: false,
  error: null,
};

// fetch favorite recipes for the user
export const fetchFavoriteRecipes = createAsyncThunk(
  "favourite/fetchFavoriteRecipes",
  async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("favourites")
        .select("recipe_id")
        .eq("user_id", userId);
      if (error) {
        throw new Error(error.message);
      }
      return data.map((favorite) => favorite.recipe_id);
    } catch (error: any) {
      return error.message;
    }
  }
);

// Thunk to toggle a favorite recipe
export const toggleFavorite = createAsyncThunk(
  "favourite/toggleFavorite",
  async ({ userId, recipeId }: any, { getState, rejectWithValue }: any) => {
    try {
      console.log(getState());
      const isFavorite = getState().favourites.favourites.includes(recipeId);
      if (isFavorite) {
        const { error } = await supabase
          .from("favourites")
          .delete()
          .match({ user_id: userId, recipe_id: recipeId });
        if (error) throw error;
        return { recipeId, isFavorite: false };
      } else {
        const { error } = await supabase
          .from("favourites")
          .insert([{ user_id: userId, recipe_id: recipeId }]);
        if (error) throw error;
        return { recipeId, isFavorite: true };
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice definition
const favoriteRecipesSlice = createSlice({
  name: "favoriteRecipes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoriteRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.favourites = action.payload;
      })
      .addCase(fetchFavoriteRecipes.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { recipeId, isFavorite } = action.payload;
        if (isFavorite) {
          state.favourites.push(recipeId);
        } else {
          state.favourites = state.favourites.filter((id) => id !== recipeId);
        }
      })
      .addCase(toggleFavorite.rejected, (state: any, action) => {
        state.error = action.payload;
      });
  },
});

export default favoriteRecipesSlice.reducer;
