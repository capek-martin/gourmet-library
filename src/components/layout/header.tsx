import { Menubar } from "primereact/menubar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { paths } from "../../utils/core/routerContainer";
import { AutoComplete } from "primereact/autocomplete";
import { useState } from "react";
import { Recipe } from "../../types/recipe.types";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../features/userSlice";
import http, { apiUrl } from "../../utils/core/api";
import { RootState } from "../../store/store";
import { ThunkDispatch } from "@reduxjs/toolkit";

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const { recipes: recipeList } = useSelector(
    (state: RootState) => state.recipes
  );
  const [query, setQuery] = useState<string>("");
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipeList);
  const isLoggedIn = !!userInfo?.user_id;

  const handleRandomRecipeClick = () => {
    if (recipeList.length > 0) {
      const randomIndex = Math.floor(Math.random() * recipeList.length);
      const randomRecipe = recipeList[randomIndex];
      navigate(`${paths.RECIPES}/${randomRecipe.id}`);
    }
  };

  const items = [
    {
      id: "home",
      label: "Home",
      icon: "pi pi-home",
      command: () => navigate(paths.HOME),
    },
    {
      id: "recipes",
      label: "Recipes",
      icon: "pi pi-book",
      items: [
        {
          id: "all-recipes",
          label: "All Recipes",
          icon: "pi pi-list",
          command: () => navigate(paths.RECIPES),
        },
        // in user´s profile
        /* {
          id: "my-recipes",
          label: "My Recipes",
          icon: "pi pi-star",
          command: () =>
            navigate(`${paths.RECIPES}?authorId=${userInfo?.user_id}`),
          visible: isLoggedIn,
        }, */
        {
          id: "randomRecipe",
          label: "Hungry & clueless?",
          icon: "pi pi-sparkles",
          command: () => handleRandomRecipeClick(),
          visible: isLoggedIn,
        },
        {
          id: "new-recipe",
          label: "New Recipe",
          icon: "pi pi-calendar-plus",
          command: () =>
            navigate(isLoggedIn ? `${paths.RECIPES}/new` : `${paths.LOGIN}`),
        },
      ],
    },
    {
      id: "login",
      label: "Log-in",
      icon: "pi pi-user",
      visible: !isLoggedIn,
      command: () => navigate(paths.LOGIN),
    },
    {
      id: "user",
      label: "Profile",
      icon: "pi pi-user",
      visible: isLoggedIn,
      items: [
        {
          id: "profile",
          label: userInfo?.email ?? "",
          visible: isLoggedIn,
          command: () => navigate(paths.PROFILE),
        },
        {
          id: "logout",
          label: "Log-out",
          icon: "pi pi-sign-out",
          visible: isLoggedIn,
          command: () => logoutUser(),
        },
      ],
    },
  ];

  const logoutUser = () => {
    dispatch(clearUser());
    http.post(apiUrl.LOGOUT).then(() => navigate(paths.HOME));
  };

  const search = (event: any) => {
    setTimeout(() => {
      let _filteredRecipes;

      if (!event.query.trim().length) {
        _filteredRecipes = [...recipeList];
      } else {
        _filteredRecipes = recipeList.filter((recipe) => {
          return recipe.title
            ?.toLowerCase()
            .includes(event.query.toLowerCase());
        });
      }
      setFilteredRecipes(_filteredRecipes);
    }, 250);
  };

  const itemTemplate = (item: any) => {
    return (
      <div className="flex align-items-center">
        <div>{item.title}</div>
      </div>
    );
  };

  // clear query and navigate to recipe
  const handleSelect = (e: any) => {
    setQuery("");
    navigate(`${paths.RECIPES}/${e.value.id}`);
  };

  const start = (
    <AutoComplete
      inputClassName="w-full md:mr-2"
      placeholder="Search"
      field="title"
      value={query}
      suggestions={filteredRecipes}
      completeMethod={search}
      onChange={(e) => setQuery(e.value)}
      onSelect={handleSelect}
      itemTemplate={itemTemplate}
    />
  );

  return (
    <div className="header text-white flex flex-column w-full align-items-center">
      <div className="w-12 md:w-10 lg:w-8 px-2 md:px-0 md:flex justify-content-between align-items-center">
        <div
          className="w-12 md:w-4 align-items-center justify-content-center md:justify-content-start flex gap-2"
          onClick={() => navigate(`${paths.HOME}`)}
        >
          <FontAwesomeIcon size="2x" icon={faUtensils} />
          <h2 className="m-0 p-2">Gourmet library</h2>
          <FontAwesomeIcon size="2x" icon={faUtensils} />
        </div>
        <div className="mx-auto w-10 md:w-8">
          <Menubar
            model={items}
            start={start}
            className="w-12 bg-transparent border-none flex justify-content-between md:justify-content-end"
          />
        </div>
      </div>
    </div>
  );
};
