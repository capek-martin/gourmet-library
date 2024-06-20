import { RecipeForm } from "./recipeForm";
import { useNavigate, useParams } from "react-router-dom";
import { RecipeInputs } from "../types/recipe.types";
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
import { addIndexBeforeExtension } from "../utils/app/utils";
import { toast } from "react-toastify";
import { toastSetting } from "../utils/app/toastSetting";
import { paths } from "../utils/core/routerContainer";
import supabase, { recipeImgBucket } from "../utils/core/supabase";
import { clearLoading, setLoading } from "../features/loadingSlice";

export const RecipeEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { recipes: recipeList } = useSelector(
    (state: RootState) => state.recipes
  );

  const recipe = useSelector((state: RootState) =>
    selectRecipeById(state, id!)
  );

  useEffect(() => {
    dispatch(fetchRecipes({ numRecords: 100 }));
  }, []);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchRecipeById(id));
  }, [dispatch, id, recipeList]);

  const deleteImage = async (title: string) => {
    if (!id) return;
    dispatch(setLoading());
    try {
      // Delete the image from the storage
      const deleteImageResponse = await dispatch(
        deleteRecipeImage({
          recipeId: id,
          title: title,
        })
      );

      if (!deleteImageResponse) {
        throw new Error("Failed to delete image from storage");
      }

      // Update the recipe to remove the image URL
      const updatedImageUrls = recipe?.imgUrls.filter(
        (url) => !url.includes(title)
      );
      const updateRecipeResponse = await dispatch(
        updateRecipe({
          id: id,
          updatedRecipe: {
            ...recipe,
            imgUrls: updatedImageUrls || [],
          },
        })
      );

      if (!updateRecipeResponse) {
        throw new Error("Failed to update recipe with new image URLs");
      }

      // Show success message
      toast.success("Image deleted and recipe updated successfully.", {
        ...toastSetting,
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image and update recipe.", {
        ...toastSetting,
      });
    } finally {
      dispatch(clearLoading());
    }
  };

  const handleOnSubmit: SubmitHandler<RecipeInputs> = async (
    values: RecipeInputs
  ) => {
    if (!id) return;
    try {
      dispatch(setLoading());
      let imgUrls = values.imgUrls ?? [];
      // Upload images to Supabase
      if (selectedFile.length > 0) {
        for (const file of selectedFile) {
          const { data, error } = await supabase.storage
            .from(recipeImgBucket)
            .upload(
              `${id}/${addIndexBeforeExtension(file.name, imgUrls.length)}`,
              file
            );

          // get public url of uploaded img
          const publicURL = data
            ? await supabase.storage
                .from(recipeImgBucket)
                .getPublicUrl(data.Key.replace(recipeImgBucket + "/", ""))
                .publicURL
            : null;

          // store in arr for recipe edit
          if (publicURL) imgUrls = [...imgUrls, publicURL];
          if (error) {
            return toast.error(`Failed to upload image: ${error.message}`, {
              ...toastSetting,
            });
          }
        }
      }
      // Update recipe data
      const response = await dispatch(
        updateRecipe({
          id: id,
          updatedRecipe: {
            ...values,
            imgUrls: imgUrls,
          },
        })
      );

      if (updateRecipe.fulfilled.match(response)) {
        toast.success("Recipe updated", { ...toastSetting });
        dispatch(fetchRecipes({ numRecords: 100 }));
        navigate(`${paths.RECIPES}`);
      } else if (updateRecipe.rejected.match(response)) {
        toast.error("Failed to update recipe", { ...toastSetting });
      }
    } catch (err) {
      toast.error(`${err}`, { ...toastSetting });
    } finally {
      dispatch(clearLoading());
    }
  };

  return (
    <RecipeForm
      onSubmit={handleOnSubmit}
      defaultValues={recipe}
      setSelectedFiles={setSelectedFile}
      onDeleteImage={deleteImage}
    />
  );
};
