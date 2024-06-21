import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  deleteRecipe,
  fetchRecipes,
  selectRecipeById,
} from "../features/recipeSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Loader } from "../components/loader/loader";
import { paths } from "../utils/core/routerContainer";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { toast } from "react-toastify";
import { toastSetting } from "../utils/app/toastSetting";
import { ImageContainer } from "../components/imageContainer/imageContainer";
import { formatTime } from "../utils/app/utils";
import { fetchCategories } from "../features/categorySlice";
import { RecipeRating } from "../components/recipeRatings/recipeRating";
import {
  fetchFavoriteRecipes,
  toggleFavorite,
} from "../features/favoritesSlice";

export const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { favorites } = useSelector((state: RootState) => state.favorites);
  const navigate = useNavigate();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const { categories } = useSelector((state: RootState) => state.categories);

  const recipe = useSelector(
    (state: RootState) => id && selectRecipeById(state, id)
  );
  const isFavourite = recipe && favorites.includes(recipe.id);
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchRecipes({ numRecords: 100 }));
    if (userInfo) dispatch(fetchFavoriteRecipes(userInfo?.user_id));
  }, []);

  const handleEditRedirect = () => {
    navigate(`${paths.RECIPES}/edit/${id}`);
  };

  const onDelete = async () => {
    if (!id) return;
    await dispatch(deleteRecipe(id)).then(() => {
      navigate(paths.HOME);
      toast.error("Record deleted.", { ...toastSetting });
    });
  };

  const handleDelete = () => {
    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: onDelete,
    });
  };

  const handleToggleFavourite = () => {
    if (!userInfo?.user_id || !recipe) return navigate(paths.LOGIN);
    dispatch(
      toggleFavorite({ recipeId: recipe.id, userId: userInfo?.user_id })
    ).then(() => {
      dispatch(fetchFavoriteRecipes(userInfo?.user_id));
      toast.success(
        `${
          favorites.includes(recipe.id)
            ? "Removed from favorites"
            : "Added to favorites"
        }`,
        {
          ...toastSetting,
        }
      );
    });
  };

  if (!recipe) return <Loader />;
  return (
    <>
      <ConfirmDialog />

      {/*  */}
      {/* flex align-items-center */}
      <div className="flex flex-column md:flex-row md:align-items-center">
        <div className="col-12 md:col-6">
          <h1>{recipe?.title}</h1>
        </div>

        {recipe?.authorId === userInfo?.user_id && (
          <div className="col-12 md:col-6">
            <div className="flex gap-3 justify-content-start md:justify-content-end">
              <div className="">
                <Button
                  label="Edit"
                  icon="pi pi-pencil"
                  severity="success"
                  className="ml-auto"
                  onClick={() => handleEditRedirect()}
                />
              </div>
              <div className="">
                <Button
                  label="Delete"
                  icon="pi pi-times"
                  severity="danger"
                  className="ml-auto"
                  onClick={handleDelete}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {/*  */}
      <div className="flex flex-wrap justify-content-between">
        <div className="col-12 md:col-6 border">
          <div className="recipe-details">
            <RecipeRating recipe={recipe} />
            <p>
              <b>Description:</b> {recipe?.description}
            </p>
            <p>
              <b>Category:</b>{" "}
              {categories.find((c) => c.id === recipe?.categoryId)?.name}
            </p>
            <p>
              <b>Prep Time:</b> {formatTime(recipe?.prepTime)}
            </p>
            <p>
              <b>Difficulty:</b> {recipe?.difficulty}
            </p>
            <p>
              {/* TODO - currency */}
              <b>Estimated price:</b> {recipe?.estimatedPrice}
            </p>
            <Divider />
            <div>
              <h5>Ingredients:</h5>
              {recipe?.ingredients && (
                <div
                  dangerouslySetInnerHTML={{ __html: recipe?.ingredients }}
                />
              )}
            </div>
            <Divider />
            <div>
              <h5>Instructions:</h5>
              {recipe?.instructions && (
                <div
                  dangerouslySetInnerHTML={{ __html: recipe?.instructions }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="col-12 md:col-6 flex">
          <ImageContainer imgUrls={recipe.imgUrls ?? []} />
        </div>

        <div className="col-12">
          <Divider />
          <p>
            <b>Author:</b>{" "}
            <a href={`mailto:${recipe?.authorEmail}`}>{recipe?.authorEmail}</a>
          </p>
          <Divider />
          <div className="text-center">
            <Button
              label={isFavourite ? "Remove from favorites" : "Add to favorites"}
              icon="pi pi-heart"
              className="p-button-raised p-button-rounded"
              onClick={handleToggleFavourite}
            />
          </div>
        </div>
      </div>
    </>
  );
};
