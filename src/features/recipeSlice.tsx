import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Recipe } from "../types/recipe.types";
import { RootState } from "../store/store";
import supabase from "../utils/core/supabase";

interface RecipeState {
  recipes: Recipe[];
  selectedRecipe: Recipe;
  loading: boolean;
  error: string | null;
}

const initialState: RecipeState = {
  recipes: [] as Recipe[],
  selectedRecipe: {} as Recipe,
  loading: false,
  error: null,
};

export const selectRecipeById = (
  state: RootState,
  recipeId: string
): Recipe | undefined => {
  return state.recipes.recipes.find((recipe: Recipe) => recipe.id === recipeId);
};

// API calls using Supabase
export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async ({
    authorId,
    numRecords,
  }: {
    authorId?: number;
    numRecords?: number;
  }) => {
    let query = supabase.from<Recipe>("recipes").select();
    if (authorId) {
      query = query.eq("authorId", authorId);
    }
    if (numRecords) {
      query = query.limit(numRecords);
    }
    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
);

export const fetchRecipeById = createAsyncThunk<Recipe, string>(
  "recipes/fetchRecipeById",
  async (recipeId: string) => {
    const { data, error } = await supabase
      .from<Recipe>("recipes")
      .select()
      .eq("id", recipeId)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
);

export const addRecipe = createAsyncThunk(
  "recipes/addRecipe",
  async (newRecipe: Recipe) => {
    const { data, error } = await supabase
      .from<Recipe>("recipes")
      .insert(newRecipe)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
);

export const updateRecipe = createAsyncThunk(
  "recipes/updateRecipe",
  async ({ id, updatedRecipe }: { id: string; updatedRecipe: Recipe }) => {
    const { data, error } = await supabase
      .from<Recipe>("recipes")
      .update(updatedRecipe)
      .eq("id", id)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
);

export const deleteRecipe = createAsyncThunk(
  "recipes/deleteRecipe",
  async (recipeId: string) => {
    const { error } = await supabase
      .from("recipes")
      .delete()
      .eq("id", recipeId);
    if (error) {
      throw new Error(error.message);
    }
    return recipeId;
  }
);

export const deleteRecipeImage = createAsyncThunk(
  "recipes/deleteRecipeImage",
  async ({ imageId }: { imageId: number }) => {
    const { error } = await supabase
      .from("recipe_images")
      .delete()
      .eq("id", imageId);
    if (error) {
      throw new Error(error.message);
    }
    return null;
  }
);

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "An error occurred";
      })
      .addCase(addRecipe.fulfilled, (state, action) => {
        state.recipes.push(action.payload);
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        const index = state.recipes.findIndex(
          (recipe) => recipe.id === action.payload.id
        );
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.recipes = state.recipes.filter(
          (recipe) => recipe.id !== action.payload
        );
      });
    builder
      .addCase(fetchRecipeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "An error occurred";
      });
  },
});

export default recipeSlice.reducer;
