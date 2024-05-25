import { RecipeImage } from "../../types/recipe.types";
import supabase, { recipeImgBucket } from "../core/supabase";

export const getUrlsForRecipeImages = async (
  recipeId: string,
  getFirstOnly = false
) => {
  const { data: files, error } = await supabase.storage
    .from(recipeImgBucket)
    .list(recipeId);

  if (error) {
    console.error("Error listing files:", error);
    return [];
  }

  if (!files) return [];

  const images = files.reduce((acc, file, index) => {
    if (getFirstOnly && index > 0) return acc;
    const { publicURL } = supabase.storage
      .from(recipeImgBucket)
      .getPublicUrl(`${recipeId}/${file.name}`);
    acc.push({ id: file.id, url: publicURL, title: file.name } as RecipeImage);
    return acc;
  }, [] as RecipeImage[]);

  return images;
};

// TODO - conversion
// https://github.com/orgs/supabase/discussions/7136

import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";

export type SnakeToCamelCase<S extends string> =
  S extends `${infer T}_${infer U}`
    ? `${Lowercase<T>}${Capitalize<SnakeToCamelCase<U>>}`
    : S;
export type SnakeToCamelCaseNested<T> = T extends object
  ? {
      [K in keyof T as SnakeToCamelCase<K & string>]: SnakeToCamelCaseNested<
        T[K]
      >;
    }
  : T;
export type CamelToSnakeCase<S extends string> =
  S extends `${infer T}${infer U}`
    ? `${T extends Capitalize<T>
        ? "_"
        : ""}${Lowercase<T>}${CamelToSnakeCase<U>}`
    : S;

export type CamelCaseToSnakeNested<T> = T extends object
  ? {
      [K in keyof T as CamelToSnakeCase<K & string>]: CamelCaseToSnakeNested<
        T[K]
      >;
    }
  : T;

export const camelToSnake = (request: any): RequestSnake =>
  snakecaseKeys(request);
export const snakeToCamel = (request: RequestSnake): Request =>
  camelcaseKeys(request);

export interface Request {
  id: string;
  slug: string;
}

export type RequestSnake = CamelCaseToSnakeNested<Request>;
