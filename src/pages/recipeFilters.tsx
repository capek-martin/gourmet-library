import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import {
  RecipeFilters as Filters,
  defaultFilter,
  difficultyOptions,
} from "../types/recipe.types";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Checkbox } from "primereact/checkbox";
import { Rating } from "primereact/rating";

interface Props {
  onFilterChange: (filters: Filters) => void;
}

export const RecipeFilters = ({ onFilterChange }: Props) => {
  const { categories: categoryList } = useSelector(
    (state: RootState) => state.categories
  );

  const [filters, setFilters] = useState<Filters>(defaultFilter);

  const handleFilterChange = (e: any, field: string) => {
    if (field === "clearAll") {
      setFilters(defaultFilter);
      onFilterChange(defaultFilter);
      return;
    }
    const value =
      field === "favouritesOnly"
        ? e.checked
        : e.target
        ? e.target.value
        : e.value;

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
        <div className="w-12 flex align-items-center">
          <label htmlFor="favOnly" className="mr-2">
            Show only favourites
          </label>
          <Checkbox
            inputId="favOnly"
            name="favOnly"
            onChange={(e) => handleFilterChange(e, "favouritesOnly")}
            checked={filters.favouritesOnly}
          />
        </div>
        <div className="w-12 block">
          <label htmlFor="ratingFilter" className="mr-2">
            Minimal rating
          </label>
          <Rating
            className="py-3"
            id="ratingFilter"
            value={filters.minRating ?? 0}
            cancel={true}
            onChange={(e) => handleFilterChange(e, "minRating")}
          />
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
