import { useForm, SubmitHandler } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DifficultyOpt, RecipeInputs } from "../types/recipe.types";
import { TextEditor } from "../components/TextEditor/TextEditor";
import { RadioButton } from "primereact/radiobutton";
import {
  convertToMinutes,
  convertToTime,
  enumToArray,
} from "../utils/app/utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, selectCategories } from "../features/categorySlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { ImageContainer } from "../components/imageContainer/imageContainer";
import { ImageUpload } from "../components/imageUpload/imageUpload";

interface Props {
  onSubmit: SubmitHandler<RecipeInputs>;
  defaultValues?: RecipeInputs;
  setSelectedFiles: Dispatch<SetStateAction<File[]>>;
  onDeleteImage?: (title: string) => void;
}

export const RecipeForm = ({
  onSubmit,
  defaultValues,
  setSelectedFiles,
  onDeleteImage,
}: Props) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const categoryList = useSelector(selectCategories);
  const { handleSubmit, reset, register, setValue } = useForm<RecipeInputs>();
  const isNew = window.location.href.includes("/new");
  const [difficulty, setDifficulty] = useState<DifficultyOpt>(
    defaultValues?.difficulty ?? DifficultyOpt.MEDIUM
  );
  const [ingredients, setIngredients] = useState<string>(
    defaultValues?.ingredients ?? ""
  );
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    defaultValues?.categoryId ?? null
  );
  const [instructions, setInstructions] = useState<string>(
    defaultValues?.instructions ?? ""
  );

  useEffect(() => {
    dispatch(fetchCategories());
    if (!defaultValues) return;
    if (defaultValues?.categoryId) {
      setValue("categoryId", defaultValues.categoryId);
      setSelectedCategory(defaultValues.categoryId);
    }

    reset({ ...defaultValues });
  }, [defaultValues]);

  useEffect(() => {
    setValue("instructions", instructions);
    setValue("ingredients", ingredients);
  }, [instructions, ingredients]);

  const inputCss = `w-full h-2.5rem`;
  const containerCss = `field col-12 m-0`;
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      <div>
        <div>
          <h1>{isNew ? "New recipe" : "Edit recipe"}</h1>
        </div>
        <div className="md:flex">
          {/* p1 */}
          <div className="md:w-6">
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
              <label htmlFor="ingredients">Ingredients</label>
              <TextEditor value={ingredients} onChange={setIngredients} />
            </div>
            <div className={containerCss}>
              <label htmlFor="instructions">Instructions</label>
              <TextEditor value={instructions} onChange={setInstructions} />
            </div>
          </div>
          {/* p2 */}
          <div className="md:w-6 mx-2">
            <div className="h-full flex flex-column justify-content-between">
              <div className={containerCss}>
                <label>Images</label>
                <ImageUpload setSelectedFiles={setSelectedFiles} />
              </div>
              <div className={`col-12 m-0`}>
                <ImageContainer
                  imgUrls={defaultValues?.imgUrls ?? []}
                  onDelete={onDeleteImage}
                />
              </div>
            </div>
          </div>
        </div>

        <Button className="w-full mt-2" type="submit" label="Submit" />
      </div>
    </form>
  );
};
