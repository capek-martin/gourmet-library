import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import supabase from "../utils/core/supabase";
import {
  Rating,
  RatingInput,
  UserRating,
  RecipeAvgRating,
} from "../types/rating.types";
import { camelToSnake, snakeToCamel } from "../utils/app/supabaseUtils";

interface RatingState {
  ratings: Rating[];
  userRating: UserRating | null;
  averageRatings: Record<string, RecipeAvgRating> | null;
  loading: boolean;
  error: string | null;
}

const initialState: RatingState = {
  ratings: [] as Rating[],
  userRating: null,
  averageRatings: null,
  loading: false,
  error: null,
};

// Add a new rating
export const addRating = createAsyncThunk(
  "ratings/addRating",
  async ({ rating, userId, recipeId }: RatingInput) => {
    const { data, error } = await supabase
      .from("ratings")
      .insert(camelToSnake([{ rating, user_id: userId, recipe_id: recipeId }]));

    if (error) throw error;
    return snakeToCamel(data as any) as any;
  }
);

// Update a rating
export const updateRating = createAsyncThunk(
  "ratings/updateRating",
  async ({ rating, userId, recipeId }: RatingInput) => {
    const { data, error } = await supabase
      .from("ratings")
      .update({ rating })
      .eq("user_id", userId)
      .eq("recipe_id", recipeId);

    if (error) throw error;
    return snakeToCamel(data as any) as any;
  }
);

// Delete a rating
export const deleteRating = createAsyncThunk(
  "ratings/deleteRating",
  async (ratingId: string) => {
    const { error } = await supabase
      .from("ratings")
      .delete()
      .eq("id", ratingId);
    if (error) {
      throw new Error(error.message);
    }
    return ratingId;
  }
);

// Get current user rating on current recipe
export const fetchUserRating = createAsyncThunk(
  "ratings/fetchUserRating",
  async ({ userId, recipeId }: { userId: string; recipeId: string }) => {
    const { data, error } = await supabase.rpc<UserRating>("get_user_rating", {
      input_user_id: userId,
      input_recipe_id: recipeId,
    });

    if (error) {
      throw new Error(error.message);
    }
    return snakeToCamel(data as any) as any;
  }
);

// Get all recipes average rating
export const fetchAllRecipesAvgRating = createAsyncThunk(
  "ratings/fetchAllRecipesAvgRating",
  async () => {
    const { data, error } = await supabase.rpc<RecipeAvgRating>(
      "get_all_average_ratings"
    );

    if (error) {
      throw new Error(error.message);
    }
    return snakeToCamel(data as any) as any;
  }
);

const ratingSlice = createSlice({
  name: "ratings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addRating.fulfilled, (state, action: PayloadAction<Rating>) => {
        state.ratings.push(action.payload);
      })
      .addCase(
        updateRating.fulfilled,
        (state, action: PayloadAction<Rating>) => {
          const index = state.ratings.findIndex(
            (rating) => rating.id === action.payload.id
          );
          if (index !== -1) {
            state.ratings[index] = action.payload;
          }
        }
      )
      .addCase(
        deleteRating.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.ratings = state.ratings.filter(
            (rating) => rating.id !== action.payload
          );
        }
      )
      .addCase(fetchUserRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserRating.fulfilled,
        (state, action: PayloadAction<UserRating>) => {
          state.loading = false;
          state.userRating = action.payload;
        }
      )
      .addCase(fetchUserRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "An error occurred";
      })
      .addCase(fetchAllRecipesAvgRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllRecipesAvgRating.fulfilled,
        (state, action: PayloadAction<RecipeAvgRating[]>) => {
          state.loading = false;
          state.averageRatings = action.payload.reduce(
            (acc: any, { recipeId, averageRating, ratingCount }: any) => {
              acc[recipeId] = {
                averageRating: averageRating,
                ratingCount: ratingCount,
              };
              return acc;
            },
            {}
          );
        }
      )
      .addCase(fetchAllRecipesAvgRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "An error occurred";
      });
  },
});

export default ratingSlice.reducer;
