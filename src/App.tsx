import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { useUserAuth } from "./auth/auth";

function App() {
  useUserAuth();
  return <RouterProvider router={router} />;
}

export default App;
