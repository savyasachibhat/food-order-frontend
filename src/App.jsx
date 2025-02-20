// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import MainPage from "./components/MainPage";
// import Admin from "./components/Admin";
// import ThanksPage from "./components/ThanksPage";
// import { CartContextProvider } from "./store/CartContext";
// import {UserProgressContextProvider} from "./store/UserProgressContext";
// import MyMeals from "./components/MyMeals";

// const router = createBrowserRouter([
//   { path: "/", element: <MainPage /> },
//   { path: "/admin", element: <Admin /> },
//   { path: "/thankyou", element: <ThanksPage /> },
//   { path: "/mymeals", element: <MyMeals /> },
// ]);
// const App = () => {
//   return (
//     <div>
//       <UserProgressContextProvider>
//         <CartContextProvider>
//           <RouterProvider router={router} />
//         </CartContextProvider>
//       </UserProgressContextProvider>
//     </div>
//   );
// };

// export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import Admin from "./components/Admin";
import ThanksPage from "./components/ThanksPage";
import MyMeals from "./components/MyMeals";
import { CartContextProvider } from "./store/CartContext";
import { UserProgressContextProvider } from "./store/UserProgressContext";
import Header from "./components/Header";

const App = () => {
  return (
    <UserProgressContextProvider>
      <CartContextProvider>
        <Router>  {/* Replace RouterProvider with BrowserRouter */}
           {/* Ensure header is inside Router so navigation works */}
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/thankyou" element={<ThanksPage />} />
            <Route path="/mymeals" element={<MyMeals />} />
          </Routes>
        </Router>
      </CartContextProvider>
    </UserProgressContextProvider>
  );
};

export default App;
