import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import http, { apiUrl } from "../utils/core/api";
import { useNavigate } from "react-router-dom";
import { paths } from "../utils/core/routerContainer";
import { useForm } from "react-hook-form";
import { UserInputs } from "../types/user.types";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setUser } from "../features/userSlice";
import { AxiosError } from "axios";
import { extractErrorMessage } from "../utils/app/utils";
import { toastSetting } from "../utils/app/toastSetting";

export const RegistrationForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    reset,
    register,
    getValues,
    formState: { errors },
  } = useForm<UserInputs>();

  const registerUser = ({ email, password }: UserInputs) => {
    if (!email || !password) return;
    http
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
      });
  };

  const handleSignUp = () => {
    navigate(paths.REGISTRATION);
  };

  useEffect(() => {
    reset({ email: "", password: "" });
  }, [reset]);

  return (
    <form onSubmit={handleSubmit(registerUser)}>
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
