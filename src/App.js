import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import Navigation from "./components/Navigation";
import ClientsPage from "./pages/clients/ClientsPage";
import PageNotFound from "./pages/errors/PageNotFound";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <PageNotFound />,
    children: [
      { index: true, element: <LoginPage /> },
      {
        path: "/main",
        element: <Navigation />,
        children: [
          { index: true, element: <DashboardPage /> },
          {
            path: "clients",
            element: <ClientsPage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
