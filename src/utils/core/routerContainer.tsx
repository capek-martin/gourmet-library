import { Route, Routes } from "react-router-dom";
import { RecipesPage } from "../../pages/recipesPage";
import { Layout } from "../../components/layout/layout";
import { RecipeDetail } from "../../pages/recipeDetail";
import { LoginForm } from "../../pages/loginForm";
import { RecipeCreate } from "../../pages/recipeCreate";
import { RecipeEdit } from "../../pages/recipeEdit";
import { RegistrationForm } from "../../pages/registrationForm";
import { ProfileForm } from "../../pages/profileForm";

export const paths = {
  HOME: "/",
  RECIPES: "/recipes",
  LOGIN: "/login",
  REGISTRATION: "/register",
  PROFILE: "/profile",
};
export const RouterContainer = () => {
  return (
    <Layout>
      <Routes>
        <Route path={paths.HOME} element={<RecipesPage />} />
        <Route path={`${paths.RECIPES}`} element={<RecipesPage />} />
        <Route path={`${paths.RECIPES}/:id`} element={<RecipeDetail />} />
        <Route path={`${paths.RECIPES}/new`} element={<RecipeCreate />} />
        <Route path={`${paths.RECIPES}/edit/:id`} element={<RecipeEdit />} />
        <Route path={`${paths.LOGIN}`} element={<LoginForm />} />
        <Route path={`${paths.REGISTRATION}`} element={<RegistrationForm />} />
        <Route path={`${paths.PROFILE}`} element={<ProfileForm />} />
      </Routes>
    </Layout>
  );
};
