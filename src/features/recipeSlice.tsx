import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Recipe, RecipeInputs } from "../types/recipe.types";
import { RootState } from "../store/store";
import supabase, { recipeImgBucket } from "../utils/core/supabase";
import { camelToSnake, snakeToCamel } from "../utils/app/supabaseUtils";
import { addIndexBeforeExtension } from "../utils/app/utils";

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
    authorId?: string;
    numRecords?: number;
  }) => {
    let query = supabase.from("recipes").select();
    if (authorId) {
      query = query.eq("author_id", authorId);
    }
    if (numRecords) {
      query = query.limit(numRecords);
    }
    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }
    return snakeToCamel(data as any) as any;
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
    return snakeToCamel(data as any) as any;
  }
);

/* export const addRecipe = createAsyncThunk(
  "recipes/addRecipe",
  async (newRecipe: RecipeInputs) => {
    const snakeCaseRecipe = camelToSnake(newRecipe);
    const { data, error } = await supabase
      .from<Recipe>("recipes")
      .insert(snakeCaseRecipe)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return snakeToCamel(data as any) as any;
  }
); */

// TODO - review
export const createRecipeWithImages = createAsyncThunk(
  "recipes/createRecipeWithImages",
  async (recipeData: RecipeInputs & { images: File[] }, thunkAPI) => {
    const { images, ...newRecipe } = recipeData;

    try {
      // Convert recipe data keys to snake_case before sending to Supabase
      const snakeCaseRecipe = camelToSnake(newRecipe);

      // Create the recipe in Supabase
      const { data: createdRecipe, error: createError } = await supabase
        .from("recipes")
        .insert(snakeCaseRecipe)
        .single();

      if (createError) {
        throw new Error(createError.message);
      }

      // Convert received recipe keys from snake_case to camelCase
      const camelCaseCreatedRecipe = snakeToCamel(createdRecipe);

      // Upload each image to Supabase Storage and update recipe with image URLs
      const imgUrls: string[] = [];
      for (const image of images) {
        const { data: uploadedImage, error: uploadError } =
          await supabase.storage
            .from(recipeImgBucket)
            .upload(
              `${camelCaseCreatedRecipe.id}/${addIndexBeforeExtension(
                image.name,
                imgUrls.length
              )}`,
              image
            );

        if (uploadError) {
          throw new Error(
            `Failed to upload image ${image.name}: ${uploadError.message}`
          );
        }

        // get public URLs
        if (uploadedImage) {
          const { publicURL } = supabase.storage
            .from(recipeImgBucket)
            // remove bucket name otherwise it doubles in URL and is invalid (/recipe-images/recipe-images/...)
            .getPublicUrl(uploadedImage.Key.split(recipeImgBucket + "/")[1]);

          if (publicURL) {
            imgUrls.push(publicURL);
          }
        }
      }

      // Convert image URLs array to snake_case format for Supabase
      const snakeCaseImgUrls = camelToSnake({ imgUrls });

      // Update the recipe with the image URLs
      const { data: updatedRecipe, error: updateError } = await supabase
        .from("recipes")
        .update(snakeCaseImgUrls)
        .eq("id", camelCaseCreatedRecipe.id)
        .single();

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Convert updated recipe keys from snake_case to camelCase
      const camelCaseUpdatedRecipe = snakeToCamel(updatedRecipe);

      return camelCaseUpdatedRecipe;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateRecipe = createAsyncThunk(
  "recipes/updateRecipe",
  async ({
    id,
    updatedRecipe,
  }: {
    id: string;
    updatedRecipe: RecipeInputs;
  }) => {
    const snakeCaseRecipe = camelToSnake(updatedRecipe);
    const { data, error } = await supabase
      .from<Recipe>("recipes")
      .update(snakeCaseRecipe)
      .eq("id", id)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return snakeToCamel(data as any) as any;
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
    return null;
  }
);

export const deleteRecipeImage = createAsyncThunk(
  "recipes/deleteRecipeImage",
  async ({ recipeId, title }: { recipeId: string; title: string }) => {
    // Delete the file from storage
    const { error } = await supabase.storage
      .from(recipeImgBucket)
      .remove([`${recipeId}/${title}`]);

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
      .addCase(fetchRecipes.fulfilled, (state, action: any) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "An error occurred";
      })
      .addCase(createRecipeWithImages.fulfilled, (state, action: any) => {
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
