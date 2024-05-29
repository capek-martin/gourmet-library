import { useNavigate } from "react-router-dom";
import { Recipe } from "../../types/recipe.types";
import { paths } from "../../utils/core/routerContainer";
import foodPlaceholder from "../../food-placeholder.jpg";
import { Rating } from "primereact/rating";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { Button } from "primereact/button";
import { MouseEvent, useState } from "react";
import { RecipeAvgRating } from "../../types/rating.types";
import { truncateText } from "../../utils/app/utils";

interface Props {
  recipe: Recipe;
  avgRating: RecipeAvgRating | null;
  onToggleFavourite: (recipeId: string) => void;
}

export const RecipeCard = ({ recipe, avgRating, onToggleFavourite }: Props) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const { favorites } = useSelector((state: RootState) => state.favorites);
  const navigate = useNavigate();

  const handleDetailRedirect = (id: string) => {
    navigate(`${paths.RECIPES}/${id}`);
  };

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    onToggleFavourite(recipe.id);
  };

  return (
    <div
      className="bg-white border-round-md text-center p-0 shadow-3 hover:shadow-5 cursor-pointer w-12 md:w-12rem lg:w-15rem relative flex flex-column"
      key={recipe.id}
      onClick={() => recipe.id && handleDetailRedirect(recipe.id)}
    >
      <div className="relative h-15rem w-full">
        <img
          className="h-full w-full object-contain p-2"
          src={
            recipe?.imgUrls.length > 0 ? recipe?.imgUrls[0] : foodPlaceholder
          }
          alt={recipe.title}
        />
      </div>
      <div className="p-2 mt-auto">
        {userInfo && (
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Button
              rounded
              text
              raised
              severity="danger"
              aria-label="Favorite"
              className="absolute top-0 right-0 mt-3 mr-3 bg-white shadow-4 p-2"
              onClick={(e: any) => handleButtonClick(e)}
            >
              <i
                className={`pi ${
                  isHovered || favorites.includes(recipe.id)
                    ? "pi-heart-fill"
                    : "pi-heart"
                }`}
              ></i>
            </Button>
          </div>
        )}

        <p title={recipe.title} className="font-bold text-xl mb-2">
          {recipe.title && truncateText(recipe.title, 25)}
        </p>
        <p title={recipe.description} className="text-gray-700 text-base">
          {recipe.description && truncateText(recipe.description, 30)}
        </p>
      </div>
      <div className="pb-3">
        <Rating
          value={avgRating?.averageRating ?? 0}
          cancel={false}
          className="justify-content-center"
          readOnly
        />
      </div>
    </div>
  );
};
