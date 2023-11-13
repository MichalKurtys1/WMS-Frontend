import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import PageNotFound from "./pages/errors/PageNotFound";
import CalendarPage from "./pages/calendar/CalendarPage";
import EmployeePage from "./pages/employee/EmployeePage";
import RootLayout from "./components/RootLayout";
import EmployeeAddPage from "./pages/employee/EmployeeAddPage";
import {
  AdmMenKsiMagPermissionCheck,
  AdmMenKsiMagPrzPermissionCheck,
  AdmMenKsiPermissionCheck,
  AdmMenPermissionCheck,
  checkToken,
  KsiPermissionCheck,
} from "./utils/auth";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";
import EmployeeEditPage from "./pages/employee/EmployeeEditPage";
import ClientsPage from "./pages/clients/ClientsPage";
import ClientsAddPage from "./pages/clients/ClientsAddPage";
import ClientsEditPage from "./pages/clients/ClientsEditPage";
import SuppliersAddPage from "./pages/suppliers/SuppliersAddPage";
import SuppliersEditPage from "./pages/suppliers/SuppliersEditPage";
import SuppliersDetailsPage from "./pages/suppliers/details/SuppliersDetailsPage";
import SuppliersPage from "./pages/suppliers/SuppliersPage";
import DeliveriesPage from "./pages/deliveries/DeliveriesPage";
import DeliveriesAddPage from "./pages/deliveries/DeliveriesAddPage";
import DeliveriesEditPage from "./pages/deliveries/DeliveriesEditPage";
import ProductsPage from "./pages/products/ProductsPage";
import ProductsAddPage from "./pages/products/ProductsAddPage";
import ProductEditPage from "./pages/products/ProductEditPage";
import OrdersPage from "./pages/orders/OrdersPage";
import OrdersAddPage from "./pages/orders/OrdersAddPage";
import OrdersEditPage from "./pages/orders/OrdersEditPage";
import StockPage from "./pages/stock/StockPage";
import SortingPage from "./pages/deliveries/sorting/SortingPage";
import ShippingDetails from "./pages/shipping/shippingDetails/ShippingDetails";
import ShippingPage from "./pages/shipping/ShippingPage";
import ShippingAddPage from "./pages/shipping/add/ShippingAddPage";
import DocumentsPage from "./pages/documents/DocumentsPage";
import OrderRenderer from "./pages/PDFs/OrderRenderer";
import ShipmentRenderer from "./pages/PDFs/ShipmentRenderer";
import ShipmentUploadPage from "./pages/shipping/ShipmentUploadPage";
import PicklistRenderer from "./pages/PDFs/PicklistRenderer";
import RaportsPage from "./pages/raports/RaportsPage";
import UploadPage from "./components/UploadPage";

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
                    path: "upload",
                    element: <UploadPage type={"/orders"} />,
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
                    element: <UploadPage type={"/deliveries"} />,
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
              {
                path: "add-details",
                element: <ShippingDetails />,
              },
            ],
          },
          {
            path: "raports",
            loader: AdmMenPermissionCheck,
            children: [{ index: true, element: <RaportsPage /> }],
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
          {
            path: "picklist",
            element: <PicklistRenderer />,
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
