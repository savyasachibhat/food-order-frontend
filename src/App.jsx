import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./components/MainPage";
import Admin from "./components/Admin";
import ThanksPage from "./components/ThanksPage";
import { CartContextProvider } from "./store/CartContext";
import {UserProgressContextProvider} from "./store/UserProgressContext";

const router = createBrowserRouter([
  { path: "/", element: <MainPage /> },
  { path: "/admin", element: <Admin /> },
  { path: "/thankyou", element: <ThanksPage /> },
]);
const App = () => {
  return (
    <div>
      <UserProgressContextProvider>
        <CartContextProvider>
          <RouterProvider router={router} />
        </CartContextProvider>
      </UserProgressContextProvider>
    </div>
  );
};

export default App;
