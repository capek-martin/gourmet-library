import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { paths } from "../../utils/core/routerContainer";
import { Recipe } from "../../types/recipe.types";
import { useNavigate } from "react-router-dom";
import { truncateText } from "../../utils/app/utils";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface Props {
  recipeList: Recipe[];
  onDelete?: (id: string) => void;
}

export const RecipesTable = ({ recipeList, onDelete }: Props) => {
  const { categories } = useSelector((state: RootState) => state.categories);

  const navigate = useNavigate();

  const imageBodyTemplate = (rowData: Recipe) => {
    return (
      <div>
        {rowData.imgUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Recipe Image ${index + 1}`}
            style={{ width: "50px", height: "50px", marginRight: "5px" }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-full shadow">
      <DataTable
        value={recipeList}
        stripedRows
        tableStyle={{ overflowX: "hidden" }}
        scrollable
        paginator={recipeList.length > 10}
        rows={10}
        size={"small"}
      >
        <Column
          sortable
          field="title"
          header="Title"
          body={(item) => (
            <a
              onClick={() => navigate(`${paths.RECIPES}/${item.id}`)}
              className="text-blue-500 no-underline cursor-pointer"
              title={item.title}
            >
              {truncateText(item.title, 50)}
            </a>
          )}
        />
        <Column body={imageBodyTemplate} style={{ width: "50px" }} />
        <Column
          field="description"
          header="Description"
          body={(item) => (
            <p title={item.description}>{truncateText(item.description, 50)}</p>
          )}
        />
        <Column
          sortable
          field="categoryId"
          header="Category"
          body={(item) => (
            <p>
              {categories.find((x) => x.id === item.categoryId)?.name ?? ""}
            </p>
          )}
        />
        <Column sortable field="prepTime" header="Preparation time" />
        <Column sortable field="estimatedPrice" header="Estimated price" />
        <Column sortable field="difficulty" header="Difficulty" />
        {onDelete && (
          <Column
            body={(rowData) => {
              return (
                <Button
                  onClick={() => onDelete(rowData.id)}
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-danger"
                />
              );
            }}
          />
        )}
      </DataTable>
    </div>
  );
};
