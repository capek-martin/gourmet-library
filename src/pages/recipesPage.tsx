import { useNavigate } from "react-router-dom";
import { paths } from "../utils/core/routerContainer";
import { useEffect, useState } from "react";
import { Recipe, RecipeImages } from "../types/recipe.types";
import foodPlaceholder from "../food-placeholder.jpg";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes } from "../features/recipeSlice";
import { RootState } from "../store/store";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { getUrlsForRecipeImages } from "../utils/app/supabaseUtils";
import { ScrollTop } from "primereact/scrolltop";

export const RecipesPage = () => {
  // all images for all recipes
  const [recipeImages, setRecipeImages] = useState<any>({});
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const { recipes: recipeList } = useSelector(
    (state: RootState) => state.recipes
  );
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const handleDetailRedirect = (id: string) => {
    navigate(`${paths.RECIPES}/${id}`);
  };

  useEffect(() => {
    // TODO
    const fetchImages = async () => {
      try {
        const imagesMap: RecipeImages = {};
        for (const recipe of recipeList) {
          if (recipe.id) {
            const images = await getUrlsForRecipeImages(recipe.id, true);
            if (images.length > 0) {
              imagesMap[recipe.id] = images[0].url;
            }
          }
        }
        setRecipeImages(imagesMap);
      } catch (error) {
        console.error("Error deleting image:", error);
      } finally {
      }
    };
    if (recipeList.length > 0) {
      fetchImages();
    }
  }, [recipeList]);

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
  }, [dispatch, location.search]);

  return (
    <>
      <div className="p-grid p-dir-col">
        <div>
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
                <div
                  className="relative w-full h-64"
                  style={{
                    height: "15rem",
                    overflow: "hidden",
                  }}
                >
                  <img
                    className="h-full w-full object-cover p-2"
                    src={
                      recipe.id
                        ? recipeImages[recipe.id] || foodPlaceholder
                        : foodPlaceholder
                    }
                    alt={recipe.title}
                  />
                </div>

                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{recipe.title}</div>
                  <p className="text-gray-700 text-base">
                    {recipe.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ScrollTop />
      </div>
    </>
  );
};
