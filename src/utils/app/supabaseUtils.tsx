import { RecipeImage } from "../../types/recipe.types";
import supabase, { recipeImgBucket } from "../core/supabase";

export const getUrlsForRecipeImages = async (
  recipeId: string,
  getFirstOnly = false
) => {
  const { data: files, error } = await supabase.storage
    .from(recipeImgBucket)
    .list(recipeId);

  if (error) {
    console.error("Error listing files:", error);
    return [];
  }

  if (!files) return [];

  const images = files.reduce((acc, file, index) => {
    if (getFirstOnly && index > 0) return acc;
    const { publicURL } = supabase.storage
      .from(recipeImgBucket)
      .getPublicUrl(`${recipeId}/${file.name}`);
    acc.push({ id: file.id, url: publicURL, title: file.name } as RecipeImage);
    return acc;
  }, [] as RecipeImage[]);

  return images;
};
