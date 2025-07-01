import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import LayoutDefault from "./layouts/LayoutDefault";
import Register from "../pages/Register";
import Login from "../pages/Login";
import About from "../pages/About";
import Menus from "../pages/Menus";
import Dishes from "../pages/Dishes";
import LayoutSidebar from "./layouts/LayoutSidebar";
import RandomMeals from "../pages/RandomMeals";
import Error from "../pages/Error";
import DishDetails from "../pages/DishDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        path: "*",
        element: (
          <Error
            header="Oops! We overcooked this page."
            text={`The recipe you're looking for is missing... But don't worry — the rest of the kitchen is still open!`}
            showBtn={true}
            btnText="Go to CookStack Home"
            btnPath="/"
          />
        ),
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
  {
    path: "/",
    element: <LayoutSidebar />,
    children: [
      {
        path: "menus",
        element: <Menus />,
      },
      {
        path: "dishes",
        element: <Dishes />,
      },
      {
        path: `dishes/:id`,
        element: <DishDetails />,
      },
      {
        path: "random-meals",
        element: <RandomMeals />,
      },
    ],
  },
]);

export default router;
