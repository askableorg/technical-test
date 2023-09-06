import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UsersPage } from "./pages/users/UsersPage";
import { RootPage } from "./pages/root/RootPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
  },
  {
    path: "/users",
    element: <UsersPage />,
  },
  {
    path: "/products",
    element: <div>Your product app will be here!</div>,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
