export interface RecipeInputs {
  title?: string;
  description?: string;
  ingredients?: string;
  instructions?: string;
  // in minutes
  prepTime?: number;
  categoryId?: number;
  difficulty?: DifficultyOpt;
  estimatedPrice?: number;
  imgUrls: string[];
  authorId?: string;
}

export interface Recipe extends RecipeInputs {
  id: string;
  categoryName?: string;
  authorEmail?: string;
}

export enum DifficultyOpt {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

export const difficultyOptions = [
  { label: "Easy", value: "Easy" },
  { label: "Medium", value: "Medium" },
  { label: "Hard", value: "Hard" },
];

export interface RecipeImage {
  id: string;
  title: string;
  url: string;
}

export interface RecipeImages {
  [key: string]: string;
}

export interface RecipeFilters {
  ingredients: string;
  difficulty: string | null;
  categoryId: number | null;
  favouritesOnly: boolean;
  minRating: number | null;
}

export const defaultFilter: RecipeFilters = {
  ingredients: "",
  difficulty: null,
  categoryId: null,
  favouritesOnly: false,
  minRating: null,
};
