import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ClientsPage from "./pages/clients/ClientsPage";
import PageNotFound from "./pages/errors/PageNotFound";
import MessagesPage from "./pages/messages/MessagesPage";
import CalendarPage from "./pages/calendar/CalendarPage";
import EmployeePage from "./pages/employee/EmployeePage";
import SuppliersPage from "./pages/supplier/SuppliersPage";
import RootLayout from "./components/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <PageNotFound />,
    children: [
      { index: true, element: <LoginPage /> },
      {
        path: "/main",
        element: <RootLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          {
            path: "clients",
            element: <ClientsPage />,
          },
          {
            path: "messages",
            element: <MessagesPage />,
          },
          {
            path: "calendar",
            element: <CalendarPage />,
          },
          {
            path: "employees",
            element: <EmployeePage />,
          },
          {
            path: "suppliers",
            element: <SuppliersPage />,
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
