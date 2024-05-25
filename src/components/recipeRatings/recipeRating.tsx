import { useDispatch, useSelector } from "react-redux";
import { Recipe } from "../../types/recipe.types";
import { ThunkDispatch } from "@reduxjs/toolkit";
import {
  addRating,
  fetchAllRecipesAvgRating,
  fetchUserRating,
  updateRating,
} from "../../features/ratingSlice";
import { RootState } from "../../store/store";
import { toast } from "react-toastify";
import { toastSetting } from "../../utils/app/toastSetting";
import { Rating } from "primereact/rating";
import { useEffect, useState } from "react";

interface Props {
  recipe: Recipe;
  readOnly?: boolean;
}

export const RecipeRating = ({ recipe, readOnly = false }: Props) => {
  const [currentRating, setCurrentRating] = useState<number>();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const { averageRatings } = useSelector((state: RootState) => state.ratings);

  useEffect(() => {
    if (!userInfo || !recipe || !recipe.id) return;
    dispatch(fetchAllRecipesAvgRating());
    dispatch(
      fetchUserRating({ userId: userInfo?.user_id, recipeId: recipe.id })
    ).then((r) => setCurrentRating(Number(r.payload)));
  }, []);

  const rateRecipe = async (rating: number) => {
    if (!recipe.id) return;
    if (!userInfo) {
      toast.error("You must be logged in to rate.", { ...toastSetting });
      return;
    }

    const action = currentRating ? updateRating : addRating;

    try {
      await dispatch(
        action({
          rating,
          recipeId: recipe.id,
          userId: userInfo.user_id,
        })
      ).unwrap();

      setCurrentRating(rating);
      toast.success(`Rating ${currentRating ? "updated" : "added"}`, {
        ...toastSetting,
      });
      dispatch(fetchAllRecipesAvgRating());
    } catch (error: any) {
      toast.error(error.message, { ...toastSetting });
    }
  };

  const getAvgRating = () => {
    if (!averageRatings || !recipe || !recipe.id) return "";
    const ratingInfo = averageRatings[recipe.id];
    if (!ratingInfo) return "No rating yet";
    return `Average rating is: ${ratingInfo.averageRating} stars (${ratingInfo.ratingCount}x voted)`;
  };

  return (
    <div>
      <Rating
        value={currentRating}
        cancel={false}
        onChange={(r) => rateRecipe(r.value as number)}
        readOnly={!userInfo || readOnly}
        title={`You rated ${currentRating}`}
      />
      <span className="text-xs">{getAvgRating()}</span>
    </div>
  );
};
