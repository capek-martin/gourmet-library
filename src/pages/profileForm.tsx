import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEffect } from "react";
import { deleteRecipe, fetchRecipes } from "../features/recipeSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { toastSetting } from "../utils/app/toastSetting";
import { RecipesTable } from "../components/recipesTable/recipesTable";
import { TabView, TabPanel } from "primereact/tabview";
import { fetchFavoriteRecipes } from "../features/favouritesSlice";
import { fetchCategories } from "../features/categorySlice";

export const ProfileForm = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const { recipes } = useSelector((state: RootState) => state.recipes);
  const { favourites } = useSelector((state: RootState) => state.favourites);

  useEffect(() => {
    dispatch(fetchRecipes({ numRecords: 100, authorId: userInfo?.user_id }));
    dispatch(fetchCategories());
    if (userInfo) dispatch(fetchFavoriteRecipes(userInfo?.user_id));
  }, []);

  const onDelete = async (id: string) => {
    await dispatch(deleteRecipe(id)).then(() => {
      dispatch(fetchRecipes({ numRecords: 100, authorId: userInfo?.user_id }));
      toast.error("Record deleted.", { ...toastSetting });
    });
  };

  const handleDelete = (id: string) => {
    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => onDelete(id),
    });
  };

  return (
    <div>
      <h1 className="mt-0">User {userInfo?.email}</h1>
      <TabView className="rgba-background">
        <TabPanel header="My recipes" className="rgba-background">
          <RecipesTable onDelete={handleDelete} recipeList={recipes} />
        </TabPanel>
        <TabPanel header="Favourite recipes">
          <RecipesTable
            recipeList={recipes.filter((r) => favourites.includes(r.id))}
          />
        </TabPanel>
        <TabPanel header="Account settings">
          <p className="m-0 h-20rem">TODO</p>
        </TabPanel>
      </TabView>

      <ConfirmDialog />
    </div>
  );
};
