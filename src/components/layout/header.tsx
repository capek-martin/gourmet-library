import { Menubar } from "primereact/menubar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUtensils } from "@fortawesome/free-solid-svg-icons";
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
          id: "favourites",
          label: "Favorites",
          icon: "pi pi-heart",
          command: () => navigate(paths.RECIPES),
          visible: isLoggedIn,
        },
        {
          id: "new-recipe",
          label: "New Recipe",
          icon: "pi pi-calendar-plus",
          command: () => navigate(`${paths.RECIPES}/new`),
          visible: isLoggedIn,
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

  return (
    <div className="bg-green-500 text-white">
      <div className="text-center">
        <div className="w-12 mx-auto sm:inline-flex align-items-center md:w-8 justify-content-between">
          <div
            className="col-12 inline-flex justify-content-center align-items-center cursor-pointer gap-2 md:col-4 md:justify-content-start"
            onClick={() => navigate(`${paths.HOME}`)}
          >
            <FontAwesomeIcon size="2x" icon={faUtensils} />
            <h2>Gourmet library</h2>
            <FontAwesomeIcon size="2x" icon={faUtensils} />
          </div>
          <div className="col-10 inline-flex gap-2 justify-content-center align-items-center md:col-3">
            <AutoComplete
              inputClassName="w-full"
              field="title"
              value={query}
              suggestions={filteredRecipes}
              completeMethod={search}
              onChange={(e) => setQuery(e.value)}
              onSelect={handleSelect}
              itemTemplate={itemTemplate}
            />
            <FontAwesomeIcon
              size="2x"
              icon={faSearch}
              className="cursor-pointer"
            />
          </div>
          <div className="col-2 inline-flex md:col-5 justify-content-end">
            <Menubar model={items} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
