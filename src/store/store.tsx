import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import recipeReducer from "../features/recipeSlice";
import categoryReducer from "../features/categorySlice";
import loadingReducer from "../features/loadingSlice";
import ratingReducer from "../features/ratingSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    recipes: recipeReducer,
    categories: categoryReducer,
    ratings: ratingReducer,
    loading: loadingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
