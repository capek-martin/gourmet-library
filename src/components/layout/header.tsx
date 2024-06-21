import { Menubar } from "primereact/menubar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { paths } from "../../utils/core/routerContainer";
import { AutoComplete } from "primereact/autocomplete";
import { useState } from "react";
import { Recipe } from "../../types/recipe.types";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/userSlice";
import { RootState } from "../../store/store";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Button } from "primereact/button";
import { showSidebar } from "../../features/sidebarSlice";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
          command: () =>
            dispatch(logoutUser()).then(() => navigate(paths.HOME)),
        },
      ],
    },
  ];

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
    <div className="md:pr-2">
      <AutoComplete
        placeholder="Search"
        field="title"
        value={query}
        suggestions={filteredRecipes}
        completeMethod={search}
        onChange={(e) => setQuery(e.value)}
        onSelect={handleSelect}
        itemTemplate={itemTemplate}
      />
    </div>
  );

  const displayMobileFilters = () => {
    return location.pathname === "/" || location.pathname === "/recipes";
  };

  const end = (
    <div className="flex items-center">
      <Button
        icon="pi pi-filter"
        rounded
        text
        raised
        aria-label="Search"
        style={{ width: "32px", height: "32px" }}
        className="text-white border-1 border-white lg:hidden"
        onClick={() => dispatch(showSidebar())}
      />
    </div>
  );

  return (
    <>
      <div className="header text-white flex flex-column w-full align-items-center">
        <div className="w-12 py-1 md:py-0 lg:w-9 md:px-0 md:flex md:justify-content-between md:align-items-center">
          <div
            className="flex align-items-center justify-content-center gap-3"
            // className="border-2 py-2 sm:p-0 md:w-6 flex align-items-center justify-content-center md:justify-content-start flex gap-3"
            onClick={() => navigate(`${paths.HOME}`)}
          >
            <FontAwesomeIcon size="2x" icon={faUtensils} />
            <h2 className="">Gourmet Library</h2>
            <FontAwesomeIcon size="2x" icon={faUtensils} />
          </div>
          <div className="px-5 h-full">
            <Menubar
              model={items}
              start={start}
              end={displayMobileFilters() ? end : null}
              className="w-full bg-transparent border-none flex px-0"
            />
          </div>
        </div>
      </div>
    </>
  );
};
