import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import PageNotFound from "./pages/errors/PageNotFound";
import MessagesPage from "./pages/messages/MessagesPage";
import CalendarPage from "./pages/calendar/CalendarPage";
import EmployeePage from "./pages/employee/EmployeePage";
import RootLayout from "./components/RootLayout";
import EmployeeAddPage from "./pages/employee/add/EmployeeAddPage";
import { checkToken } from "./utils/auth";
import ProfilePage from "./pages/profile/ProfilePage";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";
import EmployeeEditPage from "./pages/employee/edit/EmployeeEditPage";
import ClientsPage from "./pages/clients/ClientsPage";
import ClientsAddPage from "./pages/clients/add/ClientsAddPage";
import ClientsEditPage from "./pages/clients/edit/ClientsEditPage";
import SuppliersAddPage from "./pages/suppliers/add/SuppliersAddPage";
import SuppliersEditPage from "./pages/suppliers/edit/SuppliersEditPage";
import SuppliersDetailsPage from "./pages/suppliers/details/SuppliersDetailsPage";
import SuppliersPage from "./pages/suppliers/SuppliersPage";
import DeliveriesPage from "./pages/deliveries/DeliveriesPage";
import DeliveriesAddPage from "./pages/deliveries/add/DeliveriesAddPage";
import DeliveriesEditPage from "./pages/deliveries/edit/DeliveriesEditPage";
import DeliveriesDetailsPage from "./pages/deliveries/details/DeliveriesDetailsPage";
import ProductsPage from "./pages/products/ProductsPage";
import ProductsAddPage from "./pages/products/add/ProductsAddPage";
import ProductEditPage from "./pages/products/edit/ProductEditPage";
import OrdersPage from "./pages/orders/OrdersPage";
import OrdersAddPage from "./pages/orders/add/OrdersAddPage";
import OrdersEditPage from "./pages/orders/edit/OrdersEditPage";
import OrdersDetailsPage from "./pages/orders/details/OrdersDetailsPage";
import StockPage from "./pages/stock/StockPage";
import SortingPage from "./pages/deliveries/sorting/SortingPage";

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
            path: "orders",
            children: [
              { index: true, element: <OrdersPage /> },
              {
                path: "add",
                element: <OrdersAddPage />,
              },
              {
                path: "edit",
                element: <OrdersEditPage />,
              },
              {
                path: "details",
                element: <OrdersDetailsPage />,
              },
            ],
          },
          {
            path: "change-password",
            element: <ChangePasswordPage />,
          },
          {
            path: "stock",
            children: [{ index: true, element: <StockPage /> }],
          },
          {
            path: "clients",
            children: [
              { index: true, element: <ClientsPage /> },
              {
                path: "add",
                element: <ClientsAddPage />,
              },
              {
                path: "edit",
                element: <ClientsEditPage />,
              },
            ],
          },
          {
            path: "deliveries",
            children: [
              { index: true, element: <DeliveriesPage /> },
              {
                path: "add",
                element: <DeliveriesAddPage />,
              },
              {
                path: "edit",
                element: <DeliveriesEditPage />,
              },
              {
                path: "details",
                element: <DeliveriesDetailsPage />,
              },
              {
                path: "sorting",
                element: <SortingPage />,
              },
            ],
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
            ],
          },
          {
            path: "products",
            children: [
              { index: true, element: <ProductsPage /> },
              {
                path: "add",
                element: <ProductsAddPage />,
              },
              {
                path: "edit",
                element: <ProductEditPage />,
              },
            ],
          },
          {
            path: "suppliers",
            children: [
              { index: true, element: <SuppliersPage /> },
              {
                path: "add",
                element: <SuppliersAddPage />,
              },
              {
                path: "edit",
                element: <SuppliersEditPage />,
              },
              {
                path: "details",
                element: <SuppliersDetailsPage />,
              },
            ],
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
