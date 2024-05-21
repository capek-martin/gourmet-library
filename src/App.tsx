import { BrowserRouter } from "react-router-dom";
import "./App.scss";
import { RouterContainer } from "./utils/core/routerContainer";
import { Provider } from "react-redux";
import store from "./store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <RouterContainer />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
