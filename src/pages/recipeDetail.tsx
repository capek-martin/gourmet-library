import { Card } from "primereact/card";
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

export const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const { categories } = useSelector((state: RootState) => state.categories);

  const recipe = useSelector(
    (state: RootState) => id && selectRecipeById(state, id)
  );

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchRecipes({ numRecords: 100 }));
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

  if (!recipe) return <Loader />;
  return (
    <>
      <ConfirmDialog />
      <Card
        title={
          <div className="grid">
            <div className="col-6">{recipe?.title}</div>

            {recipe?.authorId === userInfo?.user_id && (
              <div className="w-6 flex justify-content-end gap-3">
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
            )}
          </div>
        }
        className="my-3 border-round-lg"
      >
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
                <b>Estimated price:</b> ${recipe?.estimatedPrice}
              </p>
              <Divider />
              <div>
                <h5>Ingredients:</h5>
                <ul>
                  {recipe?.ingredients
                    ?.split(";")
                    .map((ingredient: string, index: number) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                </ul>
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
              <b>Author:</b> {recipe?.authorEmail}
            </p>
            <Divider />
            <div className="text-center">
              <Button
                label="Add to Favourites"
                icon="pi pi-heart"
                className="p-button-raised p-button-rounded"
              />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};
