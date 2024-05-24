import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import {
  RecipeFilters as Filters,
  difficultyOptions,
} from "../types/recipe.types";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface Props {
  onFilterChange: (filters: Filters) => void;
}

export const RecipeFilters = ({ onFilterChange }: Props) => {
  const { categories: categoryList } = useSelector(
    (state: RootState) => state.categories
  );

  const defaultFilter = { ingredients: "", difficulty: null, categoryId: null };

  const [filters, setFilters] = useState<Filters>(defaultFilter);

  const handleFilterChange = (e: any, field: string) => {
    if (field === "clearAll") {
      setFilters(defaultFilter);
      onFilterChange(defaultFilter);
      return;
    }
    const value = e.target ? e.target.value : e.value;
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const inputStyle = `w-full`;

  return (
    <div>
      <div className="grid p-dir-col gap-4">
        <div className="w-12">
          <span className="p-float-label">
            <InputText
              id="ingredients"
              value={filters.ingredients}
              onChange={(e) => handleFilterChange(e, "ingredients")}
              className={inputStyle}
            />
            <label htmlFor="ingredients">Ingredients</label>
          </span>
        </div>
        <div className="w-12">
          <span className="p-float-label">
            <Dropdown
              id="difficulty"
              value={filters.difficulty}
              options={difficultyOptions}
              onChange={(e) => handleFilterChange(e, "difficulty")}
              className={inputStyle}
            />
            <label htmlFor="difficulty">Difficulty</label>
          </span>
        </div>
        <div className="w-12">
          <span className="p-float-label">
            <Dropdown
              id="categoryId"
              value={filters.categoryId}
              options={categoryList}
              optionValue="id"
              optionLabel="name"
              onChange={(e) => handleFilterChange(e, "categoryId")}
              className={inputStyle}
            />
            <label htmlFor="categoryId">Category</label>
          </span>
        </div>
        <Button
          label="Clear Filters"
          onClick={() =>
            handleFilterChange({ target: { value: null } }, "clearAll")
          }
        />
      </div>
    </div>
  );
};
