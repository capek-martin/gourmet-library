import { useNavigate } from "react-router-dom";
import { paths } from "../utils/core/routerContainer";
import { useEffect } from "react";
import { Recipe } from "../types/recipe.types";
import foodPlaceholder from "../food-placeholder.jpg";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes } from "../features/recipeSlice";
import { RootState } from "../store/store";
import { ThunkDispatch } from "@reduxjs/toolkit";

export const RecipesPage = () => {
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const {
    recipes: recipeList,
    loading,
    error,
  } = useSelector((state: RootState) => state.recipes);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const handleDetailRedirect = (id: string) => {
    navigate(`${paths.RECIPES}/${id}`);
  };

  useEffect(() => {
    const authorIdParam = params.get("authorId");
    const sizeParam = params.get("size");

    // Parse authorId from the parameter, default to undefined if not provided or 0
    const authorId = authorIdParam
      ? Number(authorIdParam) || undefined
      : undefined;

    // Parse size from the parameter, default to 100 if not provided or 0
    const size = sizeParam ? Number(sizeParam) || 100 : 100;
    dispatch(
      fetchRecipes({
        authorId: authorId,
        numRecords: size,
      })
    );
  }, [dispatch, location.search]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="app-container p-grid p-dir-col">
      <div className="app-container">
        <header className="header">
          <h1>Latest recipes</h1>
        </header>
        <div className="flex flex-wrap justify-content-center gap-4">
          {recipeList?.map((recipe: Recipe) => (
            <div
              className="bg-white border-round-md text-center p-0 col-3 shadow-4 w-18rem"
              key={recipe.id}
              onClick={() => recipe.id && handleDetailRedirect(recipe.id)}
            >
              <div style={{ height: "15rem", overflow: "hidden" }}>
                <img
                  className="w-auto h-full"
                  src={
                    recipe.images?.length > 0
                      ? recipe.images[recipe.images.length - 1].image
                      : foodPlaceholder
                  }
                  alt={recipe.title}
                />
              </div>

              <div className="p-2">
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
