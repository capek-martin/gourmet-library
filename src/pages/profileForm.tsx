import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect } from "react";
import { deleteRecipe, fetchRecipes } from "../features/recipeSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { toastSetting } from "../utils/app/toastSetting";
import { useNavigate } from "react-router-dom";
import { paths } from "../utils/core/routerContainer";
import { Loader } from "../components/loader/loader";

export const ProfileForm = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const {
    recipes: recipeList,
    loading,
    error,
  } = useSelector((state: RootState) => state.recipes);

  useEffect(() => {
    dispatch(fetchRecipes({ numRecords: 100, authorId: userInfo?.user_id }));
  }, []);

  const onDelete = async (id: string) => {
    await dispatch(deleteRecipe(id)).then(() => {
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

  const headerTemplate = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">My recipes</span>
    </div>
  );

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>User {userInfo?.email}</h1>
      <DataTable
        value={recipeList}
        tableStyle={{ minWidth: "50rem" }}
        header={headerTemplate}
        stripedRows
      >
        <Column
          sortable
          field="title"
          header="Title"
          body={(item) => (
            <a
              onClick={() => navigate(`${paths.RECIPES}/${item.id}`)}
              className="text-blue-500 no-underline"
            >
              {item.title}
            </a>
          )}
        />
        <Column field="description" header="Description" />
        <Column sortable field="categoryName" header="Category" />
        <Column sortable field="prepTime" header="Preparation time" />
        <Column sortable field="estimatedPrice" header="Estimated price" />
        <Column sortable field="difficulty" header="Difficulty" />
        <Column
          body={(rowData) => {
            console.log(rowData.id);
            return (
              <Button
                onClick={() => handleDelete(rowData.id)}
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
              />
            );
          }}
          style={{ width: "10%" }}
        />
      </DataTable>
      <ConfirmDialog />
    </div>
  );
};
