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
  // TODO
  images?: RecipeImage[];
  authorId?: string;
}

export interface Recipe extends RecipeInputs {
  id?: string;
  categoryName?: string;
  authorEmail?: string;
}

export enum DifficultyOpt {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

export interface RecipeImage {
  id: string;
  title: string;
  url: string;
}

export interface RecipeImages {
  [key: string]: string;
}
