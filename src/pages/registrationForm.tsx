import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import { paths } from "../utils/core/routerContainer";
import { useForm } from "react-hook-form";
import { UserInputs } from "../types/user.types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { registerUser, selectUserError } from "../features/userSlice";
import { extractErrorMessage, isValidEmail } from "../utils/app/utils";
import { toastSetting } from "../utils/app/toastSetting";
import { ThunkDispatch } from "@reduxjs/toolkit";

export const RegistrationForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const {
    handleSubmit,
    reset,
    register,
    getValues,
    formState: { errors },
  } = useForm<UserInputs>();

  const error = useSelector(selectUserError);

  const onSubmit = ({ email, password }: UserInputs) => {
    if (!isValidEmail(email) || !password) return;

    dispatch(registerUser({ email, password }))
      .unwrap()
      .then(() => {
        toast.success("Registration succesfull", { ...toastSetting });
        navigate(paths.HOME);
      })
      .catch(() => {
        reset({ email: "", password: "" });
        // TODO
        toast.error(extractErrorMessage(error), { ...toastSetting });
        if (error) toast.error(error, { ...toastSetting });
      });

    /* http
      .post(apiUrl.REGISTER, {
        email,
        password,
      })
      .then((response) => {
        dispatch(setUser(response.data));
        toast.success("Registration succesfull", { ...toastSetting });
        navigate(paths.HOME);
      })
      .catch((error: AxiosError) => {
        toast.error(extractErrorMessage(error), { ...toastSetting });
      }); */
  };

  const handleSignUp = () => {
    navigate(paths.REGISTRATION);
  };

  useEffect(() => {
    reset({ email: "", password: "" });
  }, [reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="card mx-auto mt-8 bg-white border-round-lg">
        <div className="text-center text-3xl font-bold pt-3">
          User Registration
        </div>
        <div className="flex flex-column md:flex-row">
          <div className="w-full md:w-6 flex flex-column align-items-center justify-content-center gap-3 py-3 mx-auto">
            <div className="flex justify-content-center align-items-center gap-2">
              <label className="w-8rem">Email</label>
              <InputText
                id="email"
                type="email"
                className="w-12rem"
                {...register("email", {
                  required: true,
                })}
              />
            </div>
            <div className="flex justify-content-center align-items-center gap-2">
              <label className="w-8rem">Password</label>
              <InputText
                id="password"
                type="password"
                className="w-12rem"
                {...register("password", {
                  required: true,
                })}
              />
            </div>
            <div className="inline flex justify-content-center align-items-center gap-2">
              <label className="w-8rem">Repeat password</label>
              <InputText
                id="confirmPassword"
                type="password"
                className="w-12rem"
                {...register("confirmPassword", {
                  validate: (value) => value === getValues("password"),
                })}
              />
            </div>
            {errors.confirmPassword &&
              errors.confirmPassword.type === "validate" && (
                <div className="text-red-500">Passwords do not match</div>
              )}
            <div>
              <Button
                label="Sign Up"
                icon="pi pi-user-plus"
                severity="success"
                className="w-10rem"
                onClick={() => handleSignUp()}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
