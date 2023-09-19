import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import PageNotFound from "./pages/errors/PageNotFound";
import CalendarPage from "./pages/calendar/CalendarPage";
import EmployeePage from "./pages/employee/EmployeePage";
import RootLayout from "./components/RootLayout";
import EmployeeAddPage from "./pages/employee/add/EmployeeAddPage";
import {
  AdmMenKsiMagPermissionCheck,
  AdmMenKsiMagPrzPermissionCheck,
  AdmMenKsiPermissionCheck,
  AdmMenPermissionCheck,
  checkToken,
  KsiPermissionCheck,
} from "./utils/auth";
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
import ProductsPage from "./pages/products/ProductsPage";
import ProductsAddPage from "./pages/products/add/ProductsAddPage";
import ProductEditPage from "./pages/products/edit/ProductEditPage";
import OrdersPage from "./pages/orders/OrdersPage";
import OrdersAddPage from "./pages/orders/add/OrdersAddPage";
import OrdersEditPage from "./pages/orders/edit/OrdersEditPage";
import StockPage from "./pages/stock/StockPage";
import SortingPage from "./pages/deliveries/sorting/SortingPage";
import ShippingDetails from "./pages/orders/shipping/ShippingDetails";
import ShippingPage from "./pages/shipping/ShippingPage";
import ShippingAddPage from "./pages/shipping/add/ShippingAddPage";
import OrdersUploadPage from "./pages/orders/OrdersUploadPage";
import DocumentsPage from "./pages/documents/DocumentsPage";
import OrderRenderer from "./pages/PDFs/OrderRenderer";
import ShipmentRenderer from "./pages/PDFs/ShipmentRenderer";
import DeliveriesUploadPage from "./pages/deliveries/DeliveriesUploadPage";
import ShipmentUploadPage from "./pages/shipping/ShipmentUploadPage";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <PageNotFound />,
    children: [
      { path: "/login", element: <LoginPage /> },
      {
        element: <RootLayout />,
        loader: checkToken,
        children: [
          { index: true, element: <DashboardPage /> },
          {
            path: "calendar",
            element: <CalendarPage />,
          },
          {
            path: "change-password",
            element: <ChangePasswordPage />,
          },
          {
            path: "/",
            loader: AdmMenKsiPermissionCheck,
            children: [
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
                path: "employees",
                children: [
                  { index: true, element: <EmployeePage /> },
                  {
                    path: "add",
                    loader: KsiPermissionCheck,
                    element: <EmployeeAddPage />,
                  },
                  {
                    path: "edit",
                    loader: KsiPermissionCheck,
                    element: <EmployeeEditPage />,
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
              {
                path: "documents",
                element: <DocumentsPage />,
              },
            ],
          },
          {
            path: "/",
            loader: AdmMenKsiMagPermissionCheck,
            children: [
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
                    path: "shipping",
                    element: <ShippingDetails />,
                  },
                  {
                    path: "upload",
                    element: <OrdersUploadPage />,
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
                    path: "sorting",
                    element: <SortingPage />,
                  },
                  {
                    path: "upload",
                    element: <DeliveriesUploadPage />,
                  },
                ],
              },
              {
                path: "stock",
                children: [{ index: true, element: <StockPage /> }],
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
            ],
          },
          {
            path: "shipping",
            loader: AdmMenKsiMagPrzPermissionCheck,
            children: [
              { index: true, element: <ShippingPage /> },
              {
                path: "add",
                element: <ShippingAddPage />,
              },
              {
                path: "upload",
                element: <ShipmentUploadPage />,
              },
            ],
          },
          {
            path: "raports",
            loader: AdmMenPermissionCheck,
            children: [{ index: true, element: <StockPage /> }],
          },
        ],
      },
      {
        path: "/pdf",
        loader: checkToken,
        children: [
          {
            path: "shippment",
            element: <ShipmentRenderer />,
          },
          {
            path: "order",
            element: <OrderRenderer />,
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
