import { useEffect, useState } from "react";
import { Recipe, defaultFilter } from "../types/recipe.types";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes } from "../features/recipeSlice";
import { RootState } from "../store/store";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { ScrollTop } from "primereact/scrolltop";
import { RecipeCard } from "../components/recipeCard/recipeCard";
import { RecipeFilters } from "./recipeFilters";
import { RecipeFilters as Filters } from "../types/recipe.types";
import { fetchCategories } from "../features/categorySlice";
import { fetchAllRecipesAvgRating } from "../features/ratingSlice";
import {
  fetchFavoriteRecipes,
  toggleFavorite,
} from "../features/favouritesSlice";
import { toast } from "react-toastify";
import { toastSetting } from "../utils/app/toastSetting";

export const RecipesPage = () => {
  const params = new URLSearchParams(location.search);
  const { recipes: recipeList } = useSelector(
    (state: RootState) => state.recipes
  );
  const { favourites } = useSelector((state: RootState) => state.favourites);
  const { averageRatings } = useSelector((state: RootState) => state.ratings);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const [currentFilters, setCurrentFilters] = useState<Filters>(defaultFilter);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const authorIdParam = params.get("authorId");
    const sizeParam = params.get("size");

    const size = sizeParam ? Number(sizeParam) || 100 : 100;
    dispatch(
      fetchRecipes({
        authorId: authorIdParam ?? undefined,
        numRecords: size,
      })
    );
    dispatch(fetchCategories());
    dispatch(fetchAllRecipesAvgRating());
    if (userInfo?.user_id) dispatch(fetchFavoriteRecipes(userInfo?.user_id));
  }, [dispatch, location.search]);

  useEffect(() => {
    setFilteredRecipes(recipeList);
  }, [recipeList]);

  useEffect(() => {
    handleFilterChange(currentFilters);
  }, [favourites]);

  const handleToggleFavourite = (recipeId: string) => {
    if (!userInfo?.user_id) return;
    dispatch(
      toggleFavorite({ recipeId: recipeId, userId: userInfo?.user_id })
    ).then(() => {
      dispatch(fetchFavoriteRecipes(userInfo?.user_id));
      toast.success(
        `${
          favourites.includes(recipeId)
            ? "Removed from favourites"
            : "Added to favourites"
        }`,
        {
          ...toastSetting,
        }
      );
    });
  };

  const handleFilterChange = (filters: Filters) => {
    setCurrentFilters(filters);
    let updatedRecipes = recipeList;

    if (filters.ingredients) {
      updatedRecipes = updatedRecipes.filter((recipe) => {
        if (!recipe.ingredients) return false;
        return recipe.ingredients
          .toLowerCase()
          .includes(filters.ingredients.toLowerCase());
      });
    }
    if (filters.difficulty) {
      updatedRecipes = updatedRecipes.filter(
        (recipe) => recipe.difficulty === filters.difficulty
      );
    }

    if (filters.categoryId) {
      updatedRecipes = updatedRecipes.filter(
        (recipe) => recipe.categoryId === filters.categoryId
      );
    }

    if (filters.favouritesOnly) {
      updatedRecipes = updatedRecipes.filter(
        (recipe) => recipe.id && favourites.includes(recipe.id)
      );
    }

    if (filters.minRating && averageRatings) {
      updatedRecipes = updatedRecipes.filter((recipe) => {
        const tmpRecipe = Object.keys(averageRatings).find(
          (id) => id === recipe.id
        );
        // hide non-rated recipes
        if (!tmpRecipe || !filters.minRating) return false;
        return averageRatings[recipe.id].averageRating >= filters.minRating;
      });
    }

    setFilteredRecipes(updatedRecipes);
  };

  return (
    <>
      <div className="p-grid p-dir-col">
        <div>
          <header className="header">
            <h1>Latest recipes</h1>
          </header>
          <div className="flex">
            <div className="hidden lg:block lg:w-2 mt-4">
              <RecipeFilters onFilterChange={handleFilterChange} />
            </div>
            <div className="w-10 flex flex-wrap justify-content-center mx-auto gap-4">
              {filteredRecipes?.map((recipe: Recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  avgRating={averageRatings && averageRatings[recipe.id]}
                  onToggleFavourite={handleToggleFavourite}
                />
              ))}
            </div>
          </div>
        </div>
        <ScrollTop />
      </div>
    </>
  );
};
