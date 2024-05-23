import { useForm, SubmitHandler } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dispatch, useEffect, useState } from "react";
import { DifficultyOpt, RecipeInputs } from "../types/recipe.types";
import { TextEditor } from "../components/TextEditor/TextEditor";
import { Card } from "primereact/card";
import { RadioButton } from "primereact/radiobutton";
import {
  convertToMinutes,
  convertToTime,
  enumToArray,
} from "../utils/app/utils";
import { Chips } from "primereact/chips";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, selectCategories } from "../features/categorySlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { ImageContainer } from "../components/imageContainer/imageContainer";

interface Props {
  onSubmit: SubmitHandler<RecipeInputs>;
  defaultValues?: RecipeInputs;
  setSelectedFile: Dispatch<any>;
  onDeleteImage?: (title: string) => void;
}

export const RecipeForm = ({
  onSubmit,
  defaultValues,
  setSelectedFile,
  onDeleteImage,
}: Props) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const categoryList = useSelector(selectCategories);
  const { handleSubmit, reset, register, setValue } = useForm<RecipeInputs>();

  const [difficulty, setDifficulty] = useState<DifficultyOpt>(
    defaultValues?.difficulty ?? DifficultyOpt.MEDIUM
  );
  const [selectedIngredients, setSelectedIngredients] = useState<any>(
    defaultValues?.ingredients?.split(";") ?? []
  );
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    defaultValues?.categoryId ?? null
  );
  const [contentValue, setContentValue] = useState<string>(
    defaultValues?.instructions ?? ""
  );

  useEffect(() => {
    dispatch(fetchCategories());
    if (!defaultValues) return;
    if (defaultValues?.categoryId) {
      setValue("categoryId", defaultValues.categoryId);
      setSelectedCategory(defaultValues.categoryId);
    }
    if (defaultValues?.ingredients) {
      setValue("ingredients", defaultValues.ingredients);
      setSelectedIngredients(defaultValues.ingredients.split(";"));
    }

    reset({ ...defaultValues });
  }, [defaultValues]);

  useEffect(() => {
    setValue("instructions", contentValue);
  }, [contentValue]);

  const inputCss = `w-full h-2.5rem`;
  const containerCss = `field col-12 m-0`;

  return (
    <Card
      title={defaultValues ? "Edit recipe" : "New recipe"}
      className="my-3 border-round-lg border-noround-bottom"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="md:flex">
          {/* p1 */}
          <div className="md:w-6 mx-2">
            <div className={containerCss}>
              <label htmlFor="title">Title</label>
              <InputText
                id="title"
                {...register("title")}
                className={inputCss}
              />
            </div>
            <div className={containerCss}>
              <label htmlFor="description">Description</label>
              <InputText
                id="description"
                {...register("description")}
                className={inputCss}
              />
            </div>
            <div className={containerCss}>
              <label htmlFor="ingredients">Ingredients</label>
              <Chips
                id="ingredients"
                allowDuplicate={false}
                value={selectedIngredients}
                onChange={(e) => {
                  if (!e.value) return;
                  setValue("ingredients", e.value.join(";"));
                  setSelectedIngredients(e.value);
                }}
                pt={{
                  root: { className: "flex" },
                  container: { className: "flex-1" },
                  token: { className: "bg-primary mt-1" },
                }}
              />
            </div>
            <div className={containerCss}>
              <label htmlFor="category">Category</label>
              <Dropdown
                id="category"
                options={categoryList}
                optionLabel="name"
                optionValue="id"
                value={selectedCategory}
                onChange={(e) => {
                  setValue("categoryId", e.value);
                  setSelectedCategory(e.value);
                }}
                placeholder="Select category"
                className={inputCss}
              />
            </div>
            <div className="flex gap-3">
              <div className="field col-6">
                <label htmlFor="prepTime">Preparation Time</label>
                <InputText
                  type="time"
                  id="prepTime"
                  defaultValue={convertToTime(defaultValues?.prepTime)}
                  onChange={(e) => {
                    const minutes = convertToMinutes(e.target.value) ?? 0;
                    setValue("prepTime", minutes);
                  }}
                  className={inputCss}
                />
              </div>
              <div className="field col-5">
                <label htmlFor="estimatedPrice">Estimated price</label>
                <InputText
                  id="estimatedPrice"
                  {...register("estimatedPrice")}
                  className={inputCss}
                />
              </div>
            </div>
            <div className={containerCss}>
              <label htmlFor="difficulty">Difficulty</label>
              <div className="flex gap-5">
                {enumToArray(DifficultyOpt).map((item) => (
                  <div key={item}>
                    <RadioButton
                      inputId={item}
                      value={item}
                      checked={item === difficulty}
                      onChange={(e) => {
                        setValue("difficulty", e.value as DifficultyOpt);
                        setDifficulty(e.value as DifficultyOpt);
                      }}
                    />
                    <label htmlFor={item} className="ml-2">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className={containerCss}>
              <label htmlFor="instructions">Instructions</label>
              <TextEditor value={contentValue} onChange={setContentValue} />
            </div>
          </div>
          {/* p2 */}
          <div className="md:w-6 mx-2">
            <div className="col-2">
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={(e) => setSelectedFile(e.target.files)}
              />
            </div>
            <div className="col-12 md:col-6 flex items-center justify-center m-auto">
              <ImageContainer
                images={defaultValues?.images ?? []}
                onDelete={onDeleteImage}
              />
            </div>
          </div>
        </div>

        <Button className="w-full" type="submit" label="Submit" />
      </form>
    </Card>
  );
};
