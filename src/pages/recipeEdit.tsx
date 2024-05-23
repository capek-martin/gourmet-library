import { RecipeForm } from "./recipeForm";
import { useNavigate, useParams } from "react-router-dom";
import { Recipe, RecipeImage, RecipeInputs } from "../types/recipe.types";
import { SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import {
  deleteRecipeImage,
  fetchRecipeById,
  fetchRecipes,
  selectRecipeById,
  updateRecipe,
} from "../features/recipeSlice";
import { useEffect, useState } from "react";
import { arrayToString } from "../utils/app/utils";
import { toast } from "react-toastify";
import { toastSetting } from "../utils/app/toastSetting";
import { paths } from "../utils/core/routerContainer";
import supabase, { recipeImgBucket } from "../utils/core/supabase";
import { getUrlsForRecipeImages } from "../utils/app/supabaseUtils";

export const RecipeEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [images, setImages] = useState<RecipeImage[]>([]);
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { recipes: recipeList } = useSelector(
    (state: RootState) => state.recipes
  );

  // TODO
  const recipe = useSelector((state: RootState) =>
    selectRecipeById(state, id!)
  );

  useEffect(() => {
    dispatch(fetchRecipes({ numRecords: 100 }));
    if (id) getUrlsForRecipeImages(id).then((r) => setImages(r));
  }, []);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchRecipeById(id));
  }, [dispatch, id, recipeList]);

  const deleteImage = async (title: string) => {
    if (!id) return;
    try {
      const response = await dispatch(
        deleteRecipeImage({
          recipeId: id,
          title: title,
        })
      );
      if (response) {
        location.reload();
      } else {
        console.error("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleOnSubmit: SubmitHandler<RecipeInputs> = async (
    values: Recipe
  ) => {
    if (!id) return;
    try {
      // Update recipe data
      const response = await dispatch(
        updateRecipe({
          id: id,
          updatedRecipe: {
            ...values,
            images: undefined,
            ingredients: arrayToString(values.ingredients as any, ";"),
          },
        })
      );

      // Upload images to Supabase
      if (selectedFile.length > 0) {
        for (const file of selectedFile) {
          const { error } = await supabase.storage
            .from(recipeImgBucket)
            .upload(id + "/" + file.name, file);

          if (error) {
            return toast.error(`Failed to upload image: ${error.message}`, {
              ...toastSetting,
            });
          }
        }
      }

      if (updateRecipe.fulfilled.match(response)) {
        toast.success("Recipe updated", { ...toastSetting });
        dispatch(fetchRecipes({ numRecords: 100 }));
        navigate(`${paths.RECIPES}`);
      } else if (updateRecipe.rejected.match(response)) {
        toast.error("Failed to update recipe", { ...toastSetting });
      }
    } catch (err) {
      toast.error(`${err}`, { ...toastSetting });
    }
  };

  return (
    <RecipeForm
      onSubmit={handleOnSubmit}
      defaultValues={{ ...recipe, images: images }}
      setSelectedFile={setSelectedFile}
      onDeleteImage={deleteImage}
    />
  );
};
