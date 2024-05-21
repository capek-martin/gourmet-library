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
  images?: any;
  authorId?: number;
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
  id: number;
  recipe: number;
  src: string;
}
