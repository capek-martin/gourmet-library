import { RecipeForm } from "./recipeForm";
import { useNavigate } from "react-router-dom";
import { DifficultyOpt, RecipeInputs } from "../types/recipe.types";
import { SubmitHandler } from "react-hook-form";
import { createRecipeWithImages } from "../features/recipeSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { toastSetting } from "../utils/app/toastSetting";
import { RootState } from "../store/store";
import { paths } from "../utils/core/routerContainer";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { clearLoading, setLoading } from "../features/loadingSlice";
import { useState } from "react";

export const RecipeCreate = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const currentUser = useSelector((state: RootState) => state.user);

  const deleteImage = () => {};

  const handleOnSubmit: SubmitHandler<RecipeInputs> = async (
    values: RecipeInputs
  ) => {
    try {
      dispatch(setLoading());
      await dispatch(
        createRecipeWithImages({
          ...values,
          categoryId: values.categoryId,
          prepTime: values.prepTime,
          authorId: currentUser.userInfo?.user_id,
          authorEmail: currentUser.userInfo?.email,
          images: selectedFiles,
        })
      ).then((r: any) => {
        toast.success("Recipe created", { ...toastSetting });
        navigate(`${paths.RECIPES}/edit/${r.payload.id}`);
      });
    } catch (err) {
      toast.error(`${err}`, { ...toastSetting });
    } finally {
      dispatch(clearLoading());
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
    imgUrls: [],
    authorId: currentUser.userInfo?.user_id,
  };

  return (
    <>
      <RecipeForm
        onSubmit={handleOnSubmit}
        defaultValues={defaultValues}
        setSelectedFiles={setSelectedFiles}
        onDeleteImage={deleteImage}
      />
    </>
  );
};
