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
  const [filters, setFilters] = useState<Filters>(defaultFilter);
  const { categories: categoryList } = useSelector(
    (state: RootState) => state.categories
  );
  const { userInfo } = useSelector((state: RootState) => state.user);

  const handleFilterChange = (e: any, field: string) => {
    if (field === "clearAll") {
      setFilters(defaultFilter);
      onFilterChange(defaultFilter);
      return;
    }
    const value =
      field === "favouritesOnly" || field === "withImagesOnly"
        ? e.checked
        : e.target
        ? e.target.value
        : e.value;

    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // TODO
  const inputStyle = `w-full`;
  return (
    <div className="flex flex-column gap-4">
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

      {userInfo && (
        <div className="w-12 flex align-items-center">
          <Checkbox
            inputId="favOnly"
            name="favOnly"
            onChange={(e) => handleFilterChange(e, "favouritesOnly")}
            checked={filters.favouritesOnly}
            className="mr-2"
          />
          <label htmlFor="favOnly">Show only favourites</label>
        </div>
      )}
      <div className="w-12 flex align-items-center">
        <Checkbox
          inputId="withImagesOnly"
          name="withImagesOnly"
          onChange={(e) => handleFilterChange(e, "withImagesOnly")}
          checked={filters.withImagesOnly}
          className="mr-2"
        />
        <label htmlFor="withImagesOnly" className="mr-2">
          Show only with images
        </label>
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
  );
};
