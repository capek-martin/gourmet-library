export interface RatingInput {
  userId: string;
  recipeId: string;
  rating: number;
}

export interface Rating extends RatingInput {
  id: string;
}

export interface UserRating {
  rating: number;
}

export interface RecipeAvgRating {
  recipeId: string;
  averageRating: number;
  ratingCount: number;
}
