import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { paths } from "../../utils/core/routerContainer";
import { Recipe } from "../../types/recipe.types";
import { useNavigate } from "react-router-dom";

interface Props {
  recipeList: Recipe[];
  onDelete?: (id: string) => void;
}

export const RecipesTable = ({ recipeList, onDelete }: Props) => {
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
      >
        <Column
          sortable
          field="title"
          header="Title"
          body={(item) => (
            <a
              onClick={() => navigate(`${paths.RECIPES}/${item.id}`)}
              className="text-blue-500 no-underline cursor-pointer"
            >
              {item.title}
            </a>
          )}
        />
        <Column body={imageBodyTemplate} style={{ width: "150px" }} />
        <Column field="description" header="Description" />
        <Column sortable field="categoryName" header="Category" />
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
            style={{ width: "10%" }}
          />
        )}
      </DataTable>
    </div>
  );
};
