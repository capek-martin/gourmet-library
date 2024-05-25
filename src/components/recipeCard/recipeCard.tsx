import { useNavigate } from "react-router-dom";
import { Recipe } from "../../types/recipe.types";
import { paths } from "../../utils/core/routerContainer";
import foodPlaceholder from "../../food-placeholder.jpg";
import { Rating } from "primereact/rating";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";

interface Props {
  recipe: Recipe;
}

export const RecipeCard = ({ recipe }: Props) => {
  const { averageRatings } = useSelector((state: RootState) => state.ratings);
  const navigate = useNavigate();

  const handleDetailRedirect = (id: string) => {
    navigate(`${paths.RECIPES}/${id}`);
  };

  const getAvgRating = () => {
    if (!averageRatings || !recipe || !recipe.id) return 0;
    const ratingInfo = averageRatings[recipe.id];
    if (!ratingInfo) return 0;
    return ratingInfo.averageRating ?? 0;
  };

  return (
    <div
      className="bg-white border-round-md text-center p-0 shadow-3 hover:shadow-5 cursor-pointer w-12 md:w-12rem lg:w-15rem"
      key={recipe.id}
      onClick={() => recipe.id && handleDetailRedirect(recipe.id)}
    >
      <div className="relative h-15rem w-full">
        <img
          className="h-full w-full object-contain p-2"
          src={recipe?.imgUrls ? recipe?.imgUrls[0] : foodPlaceholder}
          alt={recipe.title}
        />
      </div>
      <div className="px-6 py-4 mt-auto">
        <div className="font-bold text-xl mb-2">{recipe.title}</div>
        <p className="text-gray-700 text-base">{recipe.description}</p>
        <p className="m-auto text-center">
          <Rating
            value={getAvgRating()}
            cancel={false}
            className="justify-content-center"
            readOnly
          />
        </p>
      </div>
    </div>
  );
};
