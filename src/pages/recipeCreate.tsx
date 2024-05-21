import { RecipeForm } from "./recipeForm";
import { useNavigate } from "react-router-dom";
import { DifficultyOpt, RecipeInputs } from "../types/recipe.types";
import { SubmitHandler } from "react-hook-form";
import { arrayToString } from "../utils/app/utils";
import { addRecipe } from "../features/recipeSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { toastSetting } from "../utils/app/toastSetting";
import { RootState } from "../store/store";
import { paths } from "../utils/core/routerContainer";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useState } from "react";
import { API_BASE_URL, apiUrl } from "../utils/core/api";

export const RecipeCreate = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const currentUser = useSelector((state: RootState) => state.user);

  const handleOnSubmit: SubmitHandler<RecipeInputs> = async (
    values: RecipeInputs
  ) => {
    try {
      const response = await dispatch(
        addRecipe({
          ...values,
          categoryId: values.categoryId,
          prepTime: values.prepTime,
          ingredients: arrayToString(values.ingredients as any, ";"),
          authorId: currentUser.userInfo?.user_id,
        })
      );
      if (addRecipe.fulfilled.match(response)) {
        // Append images to form data
        // TODO - multiple images in one request!!
        if (response.payload.id && selectedFile) {
          const uploadData = new FormData();
          if (selectedFile)
            uploadData.append("recipe", response.payload.id.toString());
          for (let i = 0; i < selectedFile.length; i++) {
            uploadData.append("image", selectedFile[i], selectedFile[i].name);
            fetch(`${API_BASE_URL}${apiUrl.RECIPE_IMAGES}`, {
              method: "POST",
              body: uploadData,
            });
          }
        }
        toast.success("Recipe created", { ...toastSetting });
        navigate(paths.HOME);
      } else if (addRecipe.rejected.match(response)) {
        toast.error("Failed to create recipe", { ...toastSetting });
      }
    } catch (err) {
      toast.error(`${err}`, { ...toastSetting });
    }
  };

  const defaultValues: RecipeInputs = {
    title: undefined,
    description: undefined,
    ingredients: undefined,
    instructions: undefined,
    prepTime: 30,
    categoryId: undefined,
    difficulty: DifficultyOpt.MEDIUM,
    estimatedPrice: 100,
    images: undefined,
    authorId: currentUser.userInfo?.user_id,
  };

  return (
    <RecipeForm
      onSubmit={handleOnSubmit}
      defaultValues={defaultValues}
      setSelectedFile={setSelectedFile}
    />
  );
};
