import { useEffect, useState } from "react";
import { Recipe, defaultFilter } from "../types/recipe.types";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes } from "../features/recipeSlice";
import { RootState } from "../store/store";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RecipeCard } from "../components/recipeCard/recipeCard";
import { RecipeFilters } from "./recipeFilters";
import { RecipeFilters as Filters } from "../types/recipe.types";
import { fetchCategories } from "../features/categorySlice";
import { fetchAllRecipesAvgRating } from "../features/ratingSlice";
import {
  fetchFavoriteRecipes,
  toggleFavorite,
} from "../features/favoritesSlice";
import { toast } from "react-toastify";
import { toastSetting } from "../utils/app/toastSetting";
import { Sidebar } from "primereact/sidebar";
import { hideSidebar } from "../features/sidebarSlice";

export const RecipesPage = () => {
  const params = new URLSearchParams(location.search);
  const { recipes: recipeList } = useSelector(
    (state: RootState) => state.recipes
  );
  const { favorites } = useSelector((state: RootState) => state.favorites);
  const { averageRatings } = useSelector((state: RootState) => state.ratings);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const isVisible = useSelector((state: RootState) => state.sidebar.isVisible);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const [currentFilters, setCurrentFilters] = useState<Filters>(defaultFilter);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const authorIdParam = params.get("authorId");
    const sizeParam = params.get("size");

    const size = sizeParam ? Number(sizeParam) : 100;
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
  }, [favorites]);

  const handleToggleFavourite = (recipeId: string) => {
    if (!userInfo?.user_id) return;
    dispatch(
      toggleFavorite({ recipeId: recipeId, userId: userInfo?.user_id })
    ).then(() => {
      dispatch(fetchFavoriteRecipes(userInfo?.user_id));
      toast.success(
        `${
          favorites.includes(recipeId)
            ? "Removed from favorites"
            : "Added to favorites"
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

    if (filters.favoritesOnly) {
      updatedRecipes = updatedRecipes.filter(
        (recipe) => recipe.id && favorites.includes(recipe.id)
      );
    }

    if (filters.withImagesOnly) {
      updatedRecipes = updatedRecipes.filter(
        (recipe) => recipe.imgUrls.length > 0
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
    <div>
      <h1>Latest recipes</h1>
      <div className="flex">
        <div className="card flex justify-content-center">
          <Sidebar
            visible={isVisible}
            onHide={() => dispatch(hideSidebar())}
            content={() => (
              <div className="min-h-screen flex relative lg:static">
                <div
                  id="app-sidebar"
                  className="h-screen w-full px-3 block flex-shrink-0 absolute lg:static left-0 top-0 z-1 surface-border select-none"
                >
                  <div className="flex flex-column h-full pt-5">
                    <RecipeFilters
                      onFilterChange={handleFilterChange}
                      _filters={currentFilters}
                    />
                  </div>
                </div>
              </div>
            )}
          />
        </div>

        <div className="hidden lg:block md:w-3 lg:w-15rem lg:pr-3">
          <RecipeFilters onFilterChange={handleFilterChange} />
        </div>
        <div className="w-10 flex flex-wrap justify-content-center mx-auto gap-4 mx-3 mb-8">
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
  );
};
