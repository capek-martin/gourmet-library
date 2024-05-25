import { useEffect, useState } from "react";
import { Recipe } from "../types/recipe.types";
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

export const RecipesPage = () => {
  const params = new URLSearchParams(location.search);
  const { recipes: recipeList } = useSelector(
    (state: RootState) => state.recipes
  );
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
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
  }, [dispatch, location.search]);

  useEffect(() => {
    setFilteredRecipes(recipeList);
  }, [recipeList]);

  const handleFilterChange = (filters: Filters) => {
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
            {/* TODO */}
            <div className="hidden lg:block lg:w-2">
              <RecipeFilters onFilterChange={handleFilterChange} />
            </div>
            <div className="w-10 flex flex-wrap justify-content-center mx-auto gap-4">
              {filteredRecipes?.map((recipe: Recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        </div>
        <ScrollTop />
      </div>
    </>
  );
};
