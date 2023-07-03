import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ClientsPage from "./pages/clients/ClientsPage";
import PageNotFound from "./pages/errors/PageNotFound";
import MessagesPage from "./pages/messages/MessagesPage";
import CalendarPage from "./pages/calendar/CalendarPage";
import EmployeePage from "./pages/employee/EmployeePage";
import SuppliersPage from "./pages/supplier/SuppliersPage";
import RootLayout from "./components/RootLayout";
import EmployeeAddPage from "./pages/employee/add/EmployeeAddPage";
import { checkToken } from "./utils/auth";
import ProfilePage from "./pages/profile/ProfilePage";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";
import EmployeeEditPage from "./pages/employee/edit/EmployeeEditPage";
import EmployeeDetailsPage from "./pages/employee/details/EmployeeDetailsPage";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <PageNotFound />,
    children: [
      { index: true, element: <LoginPage /> },
      {
        path: "/main",
        element: <RootLayout />,
        loader: checkToken,
        children: [
          { index: true, element: <DashboardPage /> },
          {
            path: "change-password",
            element: <ChangePasswordPage />,
          },
          {
            path: "clients",
            element: <ClientsPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
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
            children: [
              { index: true, element: <EmployeePage /> },
              {
                path: "add",
                element: <EmployeeAddPage />,
              },
              {
                path: "edit",
                element: <EmployeeEditPage />,
              },
              {
                path: "details",
                element: <EmployeeDetailsPage />,
              },
            ],
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
