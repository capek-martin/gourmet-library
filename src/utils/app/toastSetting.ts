import { Bounce, ToastPosition } from "react-toastify";

export const toastSetting = {
  position: "top-right" as ToastPosition,
  autoClose: 1000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
};
