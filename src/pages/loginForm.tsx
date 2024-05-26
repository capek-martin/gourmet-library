import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UserInputs } from "../types/user.types";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { isValidEmail } from "../utils/app/utils";
import { toastSetting } from "../utils/app/toastSetting";
import { ThunkDispatch } from "@reduxjs/toolkit";

import {
  loginUser,
  selectUserError,
  selectUserLoading,
} from "../features/userSlice";
import { paths } from "../utils/core/routerContainer";

export const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { handleSubmit, reset, register } = useForm<UserInputs>();

  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  const onSubmit = ({ email, password }: UserInputs) => {
    if (!isValidEmail(email) || !password) return;

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        toast.success("Login successful", { ...toastSetting });
        navigate(paths.HOME);
      })
      .catch(() => {
        reset({ email: "", password: "" });
        if (error) toast.error(error, { ...toastSetting });
      });
  };

  useEffect(() => {
    reset({ email: "", password: "" });
  }, [reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Sign-in or sign-up</h1>
      <div className="card mx-auto bg-white border-round-lg">
        <div className="flex flex-column md:flex-row p-4">
          <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5">
            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
              <label className="w-6rem">Email</label>
              <InputText
                id="email"
                type="email"
                className="w-12rem"
                {...register("email", { required: true })}
              />
            </div>
            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
              <label className="w-6rem">Password</label>
              <InputText
                id="password"
                type="password"
                className="w-12rem"
                {...register("password", { required: true })}
              />
            </div>
            <Button
              label="Login"
              icon="pi pi-user"
              className="w-10rem mx-auto"
              loading={loading}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
          <div className="w-full md:w-2">
            <Divider layout="vertical" className="hidden md:flex">
              <b>OR</b>
            </Divider>
            <Divider
              layout="horizontal"
              className="flex md:hidden"
              align="center"
            >
              <b>OR</b>
            </Divider>
          </div>
          <div className="w-full md:w-5 flex align-items-center justify-content-center py-5">
            <Button
              label="Sign Up"
              icon="pi pi-user-plus"
              severity="success"
              className="w-10rem"
              onClick={() => navigate(paths.REGISTRATION)}
            />
          </div>
        </div>
      </div>
    </form>
  );
};
