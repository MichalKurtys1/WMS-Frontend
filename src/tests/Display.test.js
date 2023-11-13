import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import {
  GET_DASHBOARD_DATA,
  GET_DELIVERIES_RAPORTS,
  GET_FORMATED_CALENDAR,
  GET_GENERAL_RAPORTS,
  GET_ORDERS_RAPORTS,
  GET_ORDERS_STOCK,
  GET_STOCK_RAPORTS,
} from "../utils/apollo/apolloMultipleQueries";
import CalendarPage from "../pages/calendar/CalendarPage";
import { FILE_DOWNLOAD } from "../utils/apollo/apolloMutations";
import DashboardPage from "../pages/dashboard/DashboardPage";
import {
  GET_CLIENTS,
  GET_DELIVERIES,
  GET_EMPLOYYES,
  GET_FILES,
  GET_PRODUCTS,
  GET_SHIPMENTS,
  GET_SUPPLIERS,
} from "../utils/apollo/apolloQueries";
import DocumentsPage from "../pages/documents/DocumentsPage";
import RaportsPage from "../pages/raports/RaportsPage";
import ClientsPage from "../pages/clients/ClientsPage";
import EmployeePage from "../pages/employee/EmployeePage";
import SuppliersPage from "../pages/suppliers/SuppliersPage";
import ProductsPage from "../pages/products/ProductsPage";
import DeliveriesPage from "../pages/deliveries/DeliveriesPage";
import OrdersPage from "../pages/orders/OrdersPage";
import ShippingPage from "../pages/shipping/ShippingPage";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({
    pathname: "",
    state: null,
  }),
}));

const mockUseNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockUseNavigate,
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => {},
}));

jest.mock("@react-pdf/renderer", () => ({
  pdf: jest.fn().mockReturnValue({
    toBlob: jest.fn().mockImplementation(async () => {
      const data = "data";
      const blob = new Blob([data], { type: "application/pdf" });
      return blob;
    }),
  }),
}));

jest.mock("../pages/PDFs/OrderPDF", () => ({
  __esModule: true,
  default: () => {
    return <div>OrderPDF</div>;
  },
}));

const NivoPieChart = () => {
  return <div>Nivo Pie Chart</div>;
};

const NivoBarChart = () => {
  return <div>Nivo Bar Chart</div>;
};

const NivoLineChart = () => {
  return <div>Nivo Line Chart</div>;
};

jest.mock("@nivo/pie", () => ({
  ResponsivePie: NivoPieChart,
}));

jest.mock("@nivo/bar", () => ({
  ResponsiveBar: NivoBarChart,
}));

jest.mock("@nivo/line", () => ({
  ResponsiveLine: NivoLineChart,
}));

describe("CalendarPage", () => {
  it("RendersProperly", async () => {
    const mocks = [
      {
        request: {
          query: GET_FORMATED_CALENDAR,
        },
        result: {
          data: {
            formatedCalendar: {
              standardData: [
                {
                  id: "1",
                  date: "1701817200000",
                  time: "14:00",
                  event: "dd",
                  createdAt: "2023-12-15T09:28:47.000Z",
                  updatedAt: "2023-12-15T09:28:47.000Z",
                },
              ],
              carrierData: [
                {
                  id: "3",
                  date: "1701817200000",
                  time: "14:00",
                  event: "dd",
                  createdAt: "2023-12-15T09:28:47.000Z",
                  updatedAt: "2023-12-15T09:28:47.000Z",
                },
              ],
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CalendarPage />
      </MockedProvider>
    );

    expect(await screen.findByText("Kalendarz")).toBeInTheDocument();
  });

  it("DayClickWorkingProperly", async () => {
    const mocks = [
      {
        request: {
          query: GET_FORMATED_CALENDAR,
        },
        result: {
          data: {
            formatedCalendar: {
              standardData: [
                {
                  id: "1",
                  date: "1701817200000",
                  time: "14:00",
                  event: "dd",
                  createdAt: "2023-12-15T09:28:47.000Z",
                  updatedAt: "2023-12-15T09:28:47.000Z",
                },
              ],
              carrierData: [
                {
                  id: "3",
                  date: "1701817200000",
                  time: "14:00",
                  event: "dd",
                  createdAt: "2023-12-15T09:28:47.000Z",
                  updatedAt: "2023-12-15T09:28:47.000Z",
                },
              ],
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CalendarPage />
      </MockedProvider>
    );

    const day = await screen.findByText("15");
    fireEvent.click(day);

    expect(await screen.findByText("15 stycznia 2024")).toBeInTheDocument();
  });
});

describe("Dashboard", () => {
  it("RendersDataProperly", async () => {
    const mocks = [
      {
        request: {
          query: GET_DASHBOARD_DATA,
        },
        result: {
          data: {
            formatedCalendar: {
              standardData: [
                {
                  id: "1",
                  date: "1701817200000",
                  time: "14:00",
                  event: "event1",
                  createdAt: "2023-12-15T09:28:47.000Z",
                  updatedAt: "2023-12-15T09:28:47.000Z",
                },
              ],
              carrierData: [
                {
                  id: "3",
                  date: "1701817200000",
                  time: "14:00",
                  event: "event2",
                  createdAt: "2023-12-15T09:28:47.000Z",
                  updatedAt: "2023-12-15T09:28:47.000Z",
                },
              ],
            },
            dashboardReport: {
              dashboardData:
                '{"started":10,"during":12,"finished":0,"income":"0","expenses":"0","bilans":"0","incomming":0,"outgoing":0}',
            },
            stocks: [
              {
                id: "1ddbbdb5-49a7-4a0f-bf52-abc30d8c44ae",
                productId: "7c27511f-96d6-4542-bce5-9ec07c965976",
                code: "A00001",
                totalQuantity: 106,
                availableStock: 100,
                ordered: 400,
                preOrdered: 0,
                product: {
                  id: "7c27511f-96d6-4542-bce5-9ec07c965976",
                  supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Oranżada",
                  type: "Czerwona",
                  capacity: "1.5L",
                  unit: "op(6szt)",
                  pricePerUnit: 32,
                  supplier: {
                    id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                    name: "Hellena S.A.",
                    phone: "111222333",
                    email: "hellena@admin.pl",
                    city: "Bachorza",
                    street: "Leśna",
                    number: "60",
                    bank: "PKO Bank Polski O/Bydgoszcz",
                    accountNumber: "11 2222 3333 4444 5555 6666",
                    nip: "12345678989",
                  },
                },
              },
            ],
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DashboardPage />
      </MockedProvider>
    );

    expect(await screen.findByText("Dashboard")).toBeInTheDocument();
    expect(await screen.findByText("Wydarzenia")).toBeInTheDocument();
    expect(await screen.findByText("10")).toBeInTheDocument();
    expect(await screen.findByText("12")).toBeInTheDocument();
  });
});

describe("Documents", () => {
  it("RendersDataProperly", async () => {
    const mocks = [
      {
        request: {
          query: GET_FILES,
        },
        result: {
          data: {
            files: [
              {
                id: "022df3f9-dc66-4cbc-955a-57a6ecf693b2",
                name: "FAKTURA/2023-11-23/65611443",
                filename: "65611443.pdf",
                date: "2023-11-23T16:42:52.234Z",
                category: "Dostawy",
                subcategory: "JanTex",
              },
              {
                id: "11ad6ef2-9ec5-4239-9993-f770cbd26392",
                name: "FAKTURA/2023-11-08/99068314",
                filename: "99068314.pdf",
                date: "2023-11-07T13:20:53.319Z",
                category: "Dostawy",
                subcategory: "JanTex",
              },
            ],
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DocumentsPage />
      </MockedProvider>
    );

    expect(await screen.findByText("Dokumenty")).toBeInTheDocument();
    expect(await screen.findByText("JanTex")).toBeInTheDocument();
    expect(
      await screen.findByText("FAKTURA/2023-11-23/65611443")
    ).toBeInTheDocument();
    expect(await screen.findByText("65611443.pdf")).toBeInTheDocument();
  });

  it("DownloadsAndDisplaysFilesProperly", async () => {
    const mocks = [
      {
        request: {
          query: GET_FILES,
        },
        result: {
          data: {
            files: [
              {
                id: "022df3f9-dc66-4cbc-955a-57a6ecf693b2",
                name: "FAKTURA/2023-11-23/65611443",
                filename: "65611443.pdf",
                date: "2023-11-23T16:42:52.234Z",
                category: "Dostawy",
                subcategory: "JanTex",
              },
            ],
          },
        },
      },
      {
        request: {
          query: FILE_DOWNLOAD,
          variables: {
            filename: "65611443.pdf",
          },
        },
        result: {
          data: {
            fileDownload: "http://localhost:3001/65611443.pdf",
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DocumentsPage />
      </MockedProvider>
    );

    const originalOpen = window.open;
    window.open = jest.fn();

    const downloadBtns = await screen.findAllByTestId("DownloadBtn");
    fireEvent.click(downloadBtns[0]);

    await waitFor(() => {
      expect(window.open).toHaveBeenCalled();
    });

    window.open = originalOpen;
  });
});

describe("Raports", () => {
  it("RaportsTypeChangeWorkingProperly", async () => {
    const mocks = [
      {
        request: {
          query: GET_GENERAL_RAPORTS,
        },
        result: {
          data: {
            generalRaports: {
              weekData:
                '{"data":[{"x":"Poniedziałek","Przychody":0,"Wydatki":0,"z":"2023-12-11"},{"x":"Wtorek","Przychody":0,"Wydatki":0,"z":"2023-12-12"},{"x":"Środa","Przychody":0,"Wydatki":0,"z":"2023-12-13"},{"x":"Czwartek","Przychody":0,"Wydatki":0,"z":"2023-12-14"},{"x":"Piątek","Przychody":0,"Wydatki":0,"z":"2023-12-15"},{"x":"Sobota","Przychody":0,"Wydatki":0,"z":"2023-12-16"},{"x":"Niedziela","Przychody":0,"Wydatki":0,"z":"2023-12-17"}],"income":"101","expenses":"100","bilans":"1"}',
              monthData:
                '{"data":[{"x":"2023-12-01","Przychody":0,"Wydatki":0},{"x":"2023-12-02","Przychody":0,"Wydatki":0},{"x":"2023-12-03","Przychody":0,"Wydatki":0},{"x":"2023-12-04","Przychody":1446,"Wydatki":0},{"x":"2023-12-05","Przychody":0,"Wydatki":0},{"x":"2023-12-06","Przychody":0,"Wydatki":0},{"x":"2023-12-07","Przychody":0,"Wydatki":0},{"x":"2023-12-08","Przychody":0,"Wydatki":0},{"x":"2023-12-09","Przychody":0,"Wydatki":0},{"x":"2023-12-10","Przychody":0,"Wydatki":0},{"x":"2023-12-11","Przychody":0,"Wydatki":0},{"x":"2023-12-12","Przychody":0,"Wydatki":0},{"x":"2023-12-13","Przychody":0,"Wydatki":0},{"x":"2023-12-14","Przychody":0,"Wydatki":0},{"x":"2023-12-15","Przychody":0,"Wydatki":0},{"x":"2023-12-16","Przychody":0,"Wydatki":0},{"x":"2023-12-17","Przychody":0,"Wydatki":0},{"x":"2023-12-18","Przychody":0,"Wydatki":0},{"x":"2023-12-19","Przychody":0,"Wydatki":0},{"x":"2023-12-20","Przychody":0,"Wydatki":0},{"x":"2023-12-21","Przychody":0,"Wydatki":0},{"x":"2023-12-22","Przychody":0,"Wydatki":0},{"x":"2023-12-23","Przychody":0,"Wydatki":0},{"x":"2023-12-24","Przychody":0,"Wydatki":0},{"x":"2023-12-25","Przychody":0,"Wydatki":0},{"x":"2023-12-26","Przychody":0,"Wydatki":0},{"x":"2023-12-27","Przychody":0,"Wydatki":0},{"x":"2023-12-28","Przychody":0,"Wydatki":0},{"x":"2023-12-29","Przychody":0,"Wydatki":0},{"x":"2023-12-30","Przychody":0,"Wydatki":0},{"x":"2023-12-31","Przychody":0,"Wydatki":0}],"income":"202","expenses":"200","bilans":"2"}',
              yearData:
                '{"data":[{"x":"2023-01","Przychody":0,"Wydatki":0},{"x":"2023-02","Przychody":0,"Wydatki":0},{"x":"2023-03","Przychody":0,"Wydatki":0},{"x":"2023-04","Przychody":0,"Wydatki":0},{"x":"2023-05","Przychody":0,"Wydatki":0},{"x":"2023-06","Przychody":0,"Wydatki":0},{"x":"2023-07","Przychody":0,"Wydatki":0},{"x":"2023-08","Przychody":0,"Wydatki":0},{"x":"2023-09","Przychody":0,"Wydatki":0},{"x":"2023-10","Przychody":0,"Wydatki":0},{"x":"2023-11","Przychody":8593,"Wydatki":0},{"x":"2023-12","Przychody":1446,"Wydatki":0}],"income":"303","expenses":"300","bilans":"3"}',
            },
            stocks: [
              {
                id: "1ddbbdb5-49a7-4a0f-bf52-abc30d8c44ae",
                productId: "7c27511f-96d6-4542-bce5-9ec07c965976",
                code: "A00001",
                totalQuantity: 106,
                availableStock: 100,
                ordered: 400,
                product: {
                  id: "7c27511f-96d6-4542-bce5-9ec07c965976",
                  supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Oranżada",
                  type: "Czerwona",
                  capacity: "1.5L",
                  unit: "op(6szt)",
                  pricePerUnit: 32,
                  supplier: {
                    name: "Hellena S.A.",
                  },
                },
                preOrdered: 0,
              },
              {
                id: "ea93e086-17fe-4065-ae13-89070bd2feda",
                productId: "b17a2e30-00e6-4571-aa41-1478f7bab214",
                code: "A00002",
                totalQuantity: 129,
                availableStock: 129,
                ordered: 300,
                product: {
                  id: "b17a2e30-00e6-4571-aa41-1478f7bab214",
                  supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Oranżada",
                  type: "Żółta",
                  capacity: "2L",
                  unit: "op(8szt)",
                  pricePerUnit: 42,
                  supplier: {
                    name: "Hellena S.A.",
                  },
                },
                preOrdered: 0,
              },
            ],
          },
        },
      },
      {
        request: {
          query: GET_DELIVERIES_RAPORTS,
        },
        result: {
          data: {
            deliveriesRaport: {
              weekData:
                '{"clientResults":[{"suppliers":"Hellena S.A."}],"ordersResults":[{"id":"orders","data":[{"x":"Poniedziałek","y":0,"z":"2023-12-11","v":0},{"x":"Wtorek","y":0,"z":"2023-12-12","v":0},{"x":"Środa","y":0,"z":"2023-12-13","v":0},{"x":"Czwartek","y":0,"z":"2023-12-14","v":0},{"x":"Piątek","y":0,"z":"2023-12-15","v":0},{"x":"Sobota","y":0,"z":"2023-12-16","v":0},{"x":"Niedziela","y":0,"z":"2023-12-17","v":0}]}],"sum":0,"avg":"NaN","earned":"0"}',
              monthData:
                '{"clientResults":[{"suppliers":"Hellena S.A.","Oranżada Czerwona 1.5L":100,"Oranżada Żółta 2L":100}],"ordersResults":[{"id":"orders","data":[{"x":"2023-12-01","y":0,"v":0},{"x":"2023-12-02","y":0,"v":0},{"x":"2023-12-03","y":0,"v":0},{"x":"2023-12-04","y":1,"v":9102},{"x":"2023-12-05","y":0,"v":0},{"x":"2023-12-06","y":0,"v":0},{"x":"2023-12-07","y":0,"v":0},{"x":"2023-12-08","y":0,"v":0},{"x":"2023-12-09","y":0,"v":0},{"x":"2023-12-10","y":0,"v":0},{"x":"2023-12-11","y":0,"v":0},{"x":"2023-12-12","y":0,"v":0},{"x":"2023-12-13","y":0,"v":0},{"x":"2023-12-14","y":0,"v":0},{"x":"2023-12-15","y":0,"v":0},{"x":"2023-12-16","y":0,"v":0},{"x":"2023-12-17","y":0,"v":0},{"x":"2023-12-18","y":0,"v":0},{"x":"2023-12-19","y":0,"v":0},{"x":"2023-12-20","y":0,"v":0},{"x":"2023-12-21","y":0,"v":0},{"x":"2023-12-22","y":0,"v":0},{"x":"2023-12-23","y":0,"v":0},{"x":"2023-12-24","y":0,"v":0},{"x":"2023-12-25","y":0,"v":0},{"x":"2023-12-26","y":0,"v":0},{"x":"2023-12-27","y":0,"v":0},{"x":"2023-12-28","y":0,"v":0},{"x":"2023-12-29","y":0,"v":0},{"x":"2023-12-30","y":0,"v":0},{"x":"2023-12-31","y":0,"v":0}]}],"sum":1,"avg":"200","earned":"9102"}',
              yearData:
                '{"clientResults":[{"suppliers":"Hellena S.A.","Oranżada Czerwona 1.5L":100,"Oranżada Żółta 2L":100}],"ordersResults":[{"id":"orders","data":[{"x":"2023-01","y":0,"v":0},{"x":"2023-02","y":0,"v":0},{"x":"2023-03","y":0,"v":0},{"x":"2023-04","y":0,"v":0},{"x":"2023-05","y":0,"v":0},{"x":"2023-06","y":0,"v":0},{"x":"2023-07","y":0,"v":0},{"x":"2023-08","y":0,"v":0},{"x":"2023-09","y":0,"v":0},{"x":"2023-10","y":0,"v":0},{"x":"2023-11","y":0,"v":0},{"x":"2023-12","y":1,"v":9102}]}],"sum":1,"avg":"200","earned":"9102"}',
            },
            products: [
              {
                id: "7c27511f-96d6-4542-bce5-9ec07c965976",
                supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                name: "Oranżada",
                type: "Czerwona",
                capacity: "1.5L",
                unit: "op(6szt)",
                pricePerUnit: 32,
                supplier: {
                  id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Hellena S.A.",
                  phone: "111222333",
                  email: "hellena@admin.pl",
                  city: "Bachorza",
                  street: "Leśna",
                  number: "60",
                  bank: "PKO Bank Polski O/Bydgoszcz",
                  accountNumber: "11 2222 3333 4444 5555 6666",
                  nip: "12345678989",
                },
              },
              {
                id: "b17a2e30-00e6-4571-aa41-1478f7bab214",
                supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                name: "Oranżada",
                type: "Żółta",
                capacity: "2L",
                unit: "op(8szt)",
                pricePerUnit: 42,
                supplier: {
                  id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Hellena S.A.",
                  phone: "111222333",
                  email: "hellena@admin.pl",
                  city: "Bachorza",
                  street: "Leśna",
                  number: "60",
                  bank: "PKO Bank Polski O/Bydgoszcz",
                  accountNumber: "11 2222 3333 4444 5555 6666",
                  nip: "12345678989",
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: GET_ORDERS_RAPORTS,
        },
        result: {
          data: {
            ordersRaport: {
              weekData:
                '{"clientResults":[{"client":"JanTex"}],"ordersResults":[{"id":"orders","data":[{"x":"Poniedziałek","y":0,"z":"2023-12-11","v":0},{"x":"Wtorek","y":0,"z":"2023-12-12","v":0},{"x":"Środa","y":0,"z":"2023-12-13","v":0},{"x":"Czwartek","y":0,"z":"2023-12-14","v":0},{"x":"Piątek","y":0,"z":"2023-12-15","v":0},{"x":"Sobota","y":0,"z":"2023-12-16","v":0},{"x":"Niedziela","y":0,"z":"2023-12-17","v":0}]}],"sum":0,"avg":"NaN","earned":"0"}',
              monthData:
                '{"clientResults":[{"client":"JanTex","Oranżada Żółta 2L":20,"Oranżada Czerwona 1.5L":5}],"ordersResults":[{"id":"orders","data":[{"x":"2023-12-01","y":0,"v":0},{"x":"2023-12-02","y":0,"v":0},{"x":"2023-12-03","y":0,"v":0},{"x":"2023-12-04","y":2,"v":1722},{"x":"2023-12-05","y":0,"v":0},{"x":"2023-12-06","y":0,"v":0},{"x":"2023-12-07","y":0,"v":0},{"x":"2023-12-08","y":0,"v":0},{"x":"2023-12-09","y":0,"v":0},{"x":"2023-12-10","y":0,"v":0},{"x":"2023-12-11","y":0,"v":0},{"x":"2023-12-12","y":0,"v":0},{"x":"2023-12-13","y":0,"v":0},{"x":"2023-12-14","y":0,"v":0},{"x":"2023-12-15","y":0,"v":0},{"x":"2023-12-16","y":0,"v":0},{"x":"2023-12-17","y":0,"v":0},{"x":"2023-12-18","y":0,"v":0},{"x":"2023-12-19","y":0,"v":0},{"x":"2023-12-20","y":0,"v":0},{"x":"2023-12-21","y":0,"v":0},{"x":"2023-12-22","y":0,"v":0},{"x":"2023-12-23","y":0,"v":0},{"x":"2023-12-24","y":0,"v":0},{"x":"2023-12-25","y":0,"v":0},{"x":"2023-12-26","y":0,"v":0},{"x":"2023-12-27","y":0,"v":0},{"x":"2023-12-28","y":0,"v":0},{"x":"2023-12-29","y":0,"v":0},{"x":"2023-12-30","y":0,"v":0},{"x":"2023-12-31","y":0,"v":0}]}],"sum":2,"avg":"13","earned":"1722"}',
              yearData:
                '{"clientResults":[{"client":"JanTex","Oranżada Czerwona 1.5L":95,"Oranżada Żółta 2L":71}],"ordersResults":[{"id":"orders","data":[{"x":"2023-01","y":0,"v":0},{"x":"2023-02","y":0,"v":0},{"x":"2023-03","y":0,"v":0},{"x":"2023-04","y":0,"v":0},{"x":"2023-05","y":0,"v":0},{"x":"2023-06","y":0,"v":0},{"x":"2023-07","y":0,"v":0},{"x":"2023-08","y":0,"v":0},{"x":"2023-09","y":0,"v":0},{"x":"2023-10","y":0,"v":0},{"x":"2023-11","y":9,"v":8648},{"x":"2023-12","y":2,"v":1722}]}],"sum":11,"avg":"15","earned":"10370"}',
            },
            products: [
              {
                id: "7c27511f-96d6-4542-bce5-9ec07c965976",
                supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                name: "Oranżada",
                type: "Czerwona",
                capacity: "1.5L",
                unit: "op(6szt)",
                pricePerUnit: 32,
                supplier: {
                  id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Hellena S.A.",
                  phone: "111222333",
                  email: "hellena@admin.pl",
                  city: "Bachorza",
                  street: "Leśna",
                  number: "60",
                  bank: "PKO Bank Polski O/Bydgoszcz",
                  accountNumber: "11 2222 3333 4444 5555 6666",
                  nip: "12345678989",
                },
              },
              {
                id: "b17a2e30-00e6-4571-aa41-1478f7bab214",
                supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                name: "Oranżada",
                type: "Żółta",
                capacity: "2L",
                unit: "op(8szt)",
                pricePerUnit: 42,
                supplier: {
                  id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Hellena S.A.",
                  phone: "111222333",
                  email: "hellena@admin.pl",
                  city: "Bachorza",
                  street: "Leśna",
                  number: "60",
                  bank: "PKO Bank Polski O/Bydgoszcz",
                  accountNumber: "11 2222 3333 4444 5555 6666",
                  nip: "12345678989",
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: GET_STOCK_RAPORTS,
        },
        result: {
          data: {
            stockRaport: {
              generalData:
                '[{"id":"Oranżada Czerwona 1.5L ","value":106,"idColor":"#e5eaff"},{"id":"Oranżada Czerwona 1.5L - Dostępne","value":100,"idColor":"#e5eaff"},{"id":"Oranżada Czerwona 1.5L - Zamówione","value":400,"idColor":"#e5eaff"},{"id":"Oranżada Żółta 2L ","value":129,"idColor":"#ced8ff"},{"id":"Oranżada Żółta 2L - Dostępne","value":129,"idColor":"#ced8ff"},{"id":"Oranżada Żółta 2L - Zamówione","value":300,"idColor":"#ced8ff"}]',
              operationsData:
                '{"startedOrders":0,"startedDeliveries":0,"duringOrders":2,"duringDeliveries":1,"finishedOrders":9,"finishedDeliveries":0}',
              weekData:
                '[{"product":"Oranżada Czerwona 1.5L","Dostarczone":0,"Wysłane":0,"Bilans":0},{"product":"Oranżada Żółta 2L","Dostarczone":0,"Wysłane":0,"Bilans":0}]',
              monthData:
                '[{"product":"Oranżada Czerwona 1.5L","Dostarczone":0,"Wysłane":0,"Bilans":0},{"product":"Oranżada Żółta 2L","Dostarczone":0,"Wysłane":20,"Bilans":-20}]',
              yearData:
                '[{"product":"Oranżada Czerwona 1.5L","Dostarczone":0,"Wysłane":89,"Bilans":-89},{"product":"Oranżada Żółta 2L","Dostarczone":0,"Wysłane":71,"Bilans":-71}]',
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RaportsPage />
      </MockedProvider>
    );

    const nextBtn = await screen.findByTestId("NextBtn");

    expect(await screen.findByText("Ogólne")).toBeInTheDocument();
    expect(await screen.findByText("Nivo Bar Chart")).toBeInTheDocument();

    fireEvent.click(nextBtn);
    expect(await screen.findByText("Dostawy")).toBeInTheDocument();
    expect(await screen.findByText("Nivo Bar Chart")).toBeInTheDocument();
    expect(await screen.findByText("Nivo Line Chart")).toBeInTheDocument();

    fireEvent.click(nextBtn);
    expect(await screen.findByText("Stan Magazynowy")).toBeInTheDocument();
    expect(await screen.findByText("Nivo Pie Chart")).toBeInTheDocument();
    expect(await screen.findByText("Nivo Bar Chart")).toBeInTheDocument();

    fireEvent.click(nextBtn);
    expect(await screen.findByText("Zamówienia")).toBeInTheDocument();
    expect(await screen.findByText("Nivo Bar Chart")).toBeInTheDocument();
    expect(await screen.findByText("Nivo Line Chart")).toBeInTheDocument();
  });

  it("RaportsTimescopeChangeWorkingProperly", async () => {
    const mocks = [
      {
        request: {
          query: GET_GENERAL_RAPORTS,
        },
        result: {
          data: {
            generalRaports: {
              weekData:
                '{"data":[{"x":"Poniedziałek","Przychody":0,"Wydatki":0,"z":"2023-12-11"},{"x":"Wtorek","Przychody":0,"Wydatki":0,"z":"2023-12-12"},{"x":"Środa","Przychody":0,"Wydatki":0,"z":"2023-12-13"},{"x":"Czwartek","Przychody":0,"Wydatki":0,"z":"2023-12-14"},{"x":"Piątek","Przychody":0,"Wydatki":0,"z":"2023-12-15"},{"x":"Sobota","Przychody":0,"Wydatki":0,"z":"2023-12-16"},{"x":"Niedziela","Przychody":0,"Wydatki":0,"z":"2023-12-17"}],"income":"101","expenses":"100","bilans":"1"}',
              monthData:
                '{"data":[{"x":"2023-12-01","Przychody":0,"Wydatki":0},{"x":"2023-12-02","Przychody":0,"Wydatki":0},{"x":"2023-12-03","Przychody":0,"Wydatki":0},{"x":"2023-12-04","Przychody":1446,"Wydatki":0},{"x":"2023-12-05","Przychody":0,"Wydatki":0},{"x":"2023-12-06","Przychody":0,"Wydatki":0},{"x":"2023-12-07","Przychody":0,"Wydatki":0},{"x":"2023-12-08","Przychody":0,"Wydatki":0},{"x":"2023-12-09","Przychody":0,"Wydatki":0},{"x":"2023-12-10","Przychody":0,"Wydatki":0},{"x":"2023-12-11","Przychody":0,"Wydatki":0},{"x":"2023-12-12","Przychody":0,"Wydatki":0},{"x":"2023-12-13","Przychody":0,"Wydatki":0},{"x":"2023-12-14","Przychody":0,"Wydatki":0},{"x":"2023-12-15","Przychody":0,"Wydatki":0},{"x":"2023-12-16","Przychody":0,"Wydatki":0},{"x":"2023-12-17","Przychody":0,"Wydatki":0},{"x":"2023-12-18","Przychody":0,"Wydatki":0},{"x":"2023-12-19","Przychody":0,"Wydatki":0},{"x":"2023-12-20","Przychody":0,"Wydatki":0},{"x":"2023-12-21","Przychody":0,"Wydatki":0},{"x":"2023-12-22","Przychody":0,"Wydatki":0},{"x":"2023-12-23","Przychody":0,"Wydatki":0},{"x":"2023-12-24","Przychody":0,"Wydatki":0},{"x":"2023-12-25","Przychody":0,"Wydatki":0},{"x":"2023-12-26","Przychody":0,"Wydatki":0},{"x":"2023-12-27","Przychody":0,"Wydatki":0},{"x":"2023-12-28","Przychody":0,"Wydatki":0},{"x":"2023-12-29","Przychody":0,"Wydatki":0},{"x":"2023-12-30","Przychody":0,"Wydatki":0},{"x":"2023-12-31","Przychody":0,"Wydatki":0}],"income":"202","expenses":"200","bilans":"2"}',
              yearData:
                '{"data":[{"x":"2023-01","Przychody":0,"Wydatki":0},{"x":"2023-02","Przychody":0,"Wydatki":0},{"x":"2023-03","Przychody":0,"Wydatki":0},{"x":"2023-04","Przychody":0,"Wydatki":0},{"x":"2023-05","Przychody":0,"Wydatki":0},{"x":"2023-06","Przychody":0,"Wydatki":0},{"x":"2023-07","Przychody":0,"Wydatki":0},{"x":"2023-08","Przychody":0,"Wydatki":0},{"x":"2023-09","Przychody":0,"Wydatki":0},{"x":"2023-10","Przychody":0,"Wydatki":0},{"x":"2023-11","Przychody":8593,"Wydatki":0},{"x":"2023-12","Przychody":1446,"Wydatki":0}],"income":"303","expenses":"300","bilans":"3"}',
            },
            stocks: [
              {
                id: "1ddbbdb5-49a7-4a0f-bf52-abc30d8c44ae",
                productId: "7c27511f-96d6-4542-bce5-9ec07c965976",
                code: "A00001",
                totalQuantity: 106,
                availableStock: 100,
                ordered: 400,
                product: {
                  id: "7c27511f-96d6-4542-bce5-9ec07c965976",
                  supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Oranżada",
                  type: "Czerwona",
                  capacity: "1.5L",
                  unit: "op(6szt)",
                  pricePerUnit: 32,
                  supplier: {
                    name: "Hellena S.A.",
                  },
                },
                preOrdered: 0,
              },
              {
                id: "ea93e086-17fe-4065-ae13-89070bd2feda",
                productId: "b17a2e30-00e6-4571-aa41-1478f7bab214",
                code: "A00002",
                totalQuantity: 129,
                availableStock: 129,
                ordered: 300,
                product: {
                  id: "b17a2e30-00e6-4571-aa41-1478f7bab214",
                  supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Oranżada",
                  type: "Żółta",
                  capacity: "2L",
                  unit: "op(8szt)",
                  pricePerUnit: 42,
                  supplier: {
                    name: "Hellena S.A.",
                  },
                },
                preOrdered: 0,
              },
            ],
          },
        },
      },
      {
        request: {
          query: GET_DELIVERIES_RAPORTS,
        },
        result: {
          data: {
            deliveriesRaport: {
              weekData:
                '{"clientResults":[{"suppliers":"Hellena S.A."}],"ordersResults":[{"id":"orders","data":[{"x":"Poniedziałek","y":0,"z":"2023-12-11","v":0},{"x":"Wtorek","y":0,"z":"2023-12-12","v":0},{"x":"Środa","y":0,"z":"2023-12-13","v":0},{"x":"Czwartek","y":0,"z":"2023-12-14","v":0},{"x":"Piątek","y":0,"z":"2023-12-15","v":0},{"x":"Sobota","y":0,"z":"2023-12-16","v":0},{"x":"Niedziela","y":0,"z":"2023-12-17","v":0}]}],"sum":400,"avg":"401","earned":"402"}',
              monthData:
                '{"clientResults":[{"suppliers":"Hellena S.A.","Oranżada Czerwona 1.5L":100,"Oranżada Żółta 2L":100}],"ordersResults":[{"id":"orders","data":[{"x":"2023-12-01","y":0,"v":0},{"x":"2023-12-02","y":0,"v":0},{"x":"2023-12-03","y":0,"v":0},{"x":"2023-12-04","y":1,"v":9102},{"x":"2023-12-05","y":0,"v":0},{"x":"2023-12-06","y":0,"v":0},{"x":"2023-12-07","y":0,"v":0},{"x":"2023-12-08","y":0,"v":0},{"x":"2023-12-09","y":0,"v":0},{"x":"2023-12-10","y":0,"v":0},{"x":"2023-12-11","y":0,"v":0},{"x":"2023-12-12","y":0,"v":0},{"x":"2023-12-13","y":0,"v":0},{"x":"2023-12-14","y":0,"v":0},{"x":"2023-12-15","y":0,"v":0},{"x":"2023-12-16","y":0,"v":0},{"x":"2023-12-17","y":0,"v":0},{"x":"2023-12-18","y":0,"v":0},{"x":"2023-12-19","y":0,"v":0},{"x":"2023-12-20","y":0,"v":0},{"x":"2023-12-21","y":0,"v":0},{"x":"2023-12-22","y":0,"v":0},{"x":"2023-12-23","y":0,"v":0},{"x":"2023-12-24","y":0,"v":0},{"x":"2023-12-25","y":0,"v":0},{"x":"2023-12-26","y":0,"v":0},{"x":"2023-12-27","y":0,"v":0},{"x":"2023-12-28","y":0,"v":0},{"x":"2023-12-29","y":0,"v":0},{"x":"2023-12-30","y":0,"v":0},{"x":"2023-12-31","y":0,"v":0}]}],"sum":500,"avg":"501","earned":"502"}',
              yearData:
                '{"clientResults":[{"suppliers":"Hellena S.A.","Oranżada Czerwona 1.5L":100,"Oranżada Żółta 2L":100}],"ordersResults":[{"id":"orders","data":[{"x":"2023-01","y":0,"v":0},{"x":"2023-02","y":0,"v":0},{"x":"2023-03","y":0,"v":0},{"x":"2023-04","y":0,"v":0},{"x":"2023-05","y":0,"v":0},{"x":"2023-06","y":0,"v":0},{"x":"2023-07","y":0,"v":0},{"x":"2023-08","y":0,"v":0},{"x":"2023-09","y":0,"v":0},{"x":"2023-10","y":0,"v":0},{"x":"2023-11","y":0,"v":0},{"x":"2023-12","y":1,"v":9102}]}],"sum":600,"avg":"601","earned":"602"}',
            },
            products: [
              {
                id: "7c27511f-96d6-4542-bce5-9ec07c965976",
                supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                name: "Oranżada",
                type: "Czerwona",
                capacity: "1.5L",
                unit: "op(6szt)",
                pricePerUnit: 32,
                supplier: {
                  id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Hellena S.A.",
                  phone: "111222333",
                  email: "hellena@admin.pl",
                  city: "Bachorza",
                  street: "Leśna",
                  number: "60",
                  bank: "PKO Bank Polski O/Bydgoszcz",
                  accountNumber: "11 2222 3333 4444 5555 6666",
                  nip: "12345678989",
                },
              },
              {
                id: "b17a2e30-00e6-4571-aa41-1478f7bab214",
                supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                name: "Oranżada",
                type: "Żółta",
                capacity: "2L",
                unit: "op(8szt)",
                pricePerUnit: 42,
                supplier: {
                  id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Hellena S.A.",
                  phone: "111222333",
                  email: "hellena@admin.pl",
                  city: "Bachorza",
                  street: "Leśna",
                  number: "60",
                  bank: "PKO Bank Polski O/Bydgoszcz",
                  accountNumber: "11 2222 3333 4444 5555 6666",
                  nip: "12345678989",
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: GET_ORDERS_RAPORTS,
        },
        result: {
          data: {
            ordersRaport: {
              weekData:
                '{"clientResults":[{"client":"JanTex"}],"ordersResults":[{"id":"orders","data":[{"x":"Poniedziałek","y":0,"z":"2023-12-11","v":0},{"x":"Wtorek","y":0,"z":"2023-12-12","v":0},{"x":"Środa","y":0,"z":"2023-12-13","v":0},{"x":"Czwartek","y":0,"z":"2023-12-14","v":0},{"x":"Piątek","y":0,"z":"2023-12-15","v":0},{"x":"Sobota","y":0,"z":"2023-12-16","v":0},{"x":"Niedziela","y":0,"z":"2023-12-17","v":0}]}],"sum":0,"avg":"NaN","earned":"0"}',
              monthData:
                '{"clientResults":[{"client":"JanTex","Oranżada Żółta 2L":20,"Oranżada Czerwona 1.5L":5}],"ordersResults":[{"id":"orders","data":[{"x":"2023-12-01","y":0,"v":0},{"x":"2023-12-02","y":0,"v":0},{"x":"2023-12-03","y":0,"v":0},{"x":"2023-12-04","y":2,"v":1722},{"x":"2023-12-05","y":0,"v":0},{"x":"2023-12-06","y":0,"v":0},{"x":"2023-12-07","y":0,"v":0},{"x":"2023-12-08","y":0,"v":0},{"x":"2023-12-09","y":0,"v":0},{"x":"2023-12-10","y":0,"v":0},{"x":"2023-12-11","y":0,"v":0},{"x":"2023-12-12","y":0,"v":0},{"x":"2023-12-13","y":0,"v":0},{"x":"2023-12-14","y":0,"v":0},{"x":"2023-12-15","y":0,"v":0},{"x":"2023-12-16","y":0,"v":0},{"x":"2023-12-17","y":0,"v":0},{"x":"2023-12-18","y":0,"v":0},{"x":"2023-12-19","y":0,"v":0},{"x":"2023-12-20","y":0,"v":0},{"x":"2023-12-21","y":0,"v":0},{"x":"2023-12-22","y":0,"v":0},{"x":"2023-12-23","y":0,"v":0},{"x":"2023-12-24","y":0,"v":0},{"x":"2023-12-25","y":0,"v":0},{"x":"2023-12-26","y":0,"v":0},{"x":"2023-12-27","y":0,"v":0},{"x":"2023-12-28","y":0,"v":0},{"x":"2023-12-29","y":0,"v":0},{"x":"2023-12-30","y":0,"v":0},{"x":"2023-12-31","y":0,"v":0}]}],"sum":2,"avg":"13","earned":"1722"}',
              yearData:
                '{"clientResults":[{"client":"JanTex","Oranżada Czerwona 1.5L":95,"Oranżada Żółta 2L":71}],"ordersResults":[{"id":"orders","data":[{"x":"2023-01","y":0,"v":0},{"x":"2023-02","y":0,"v":0},{"x":"2023-03","y":0,"v":0},{"x":"2023-04","y":0,"v":0},{"x":"2023-05","y":0,"v":0},{"x":"2023-06","y":0,"v":0},{"x":"2023-07","y":0,"v":0},{"x":"2023-08","y":0,"v":0},{"x":"2023-09","y":0,"v":0},{"x":"2023-10","y":0,"v":0},{"x":"2023-11","y":9,"v":8648},{"x":"2023-12","y":2,"v":1722}]}],"sum":11,"avg":"15","earned":"10370"}',
            },
            products: [
              {
                id: "7c27511f-96d6-4542-bce5-9ec07c965976",
                supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                name: "Oranżada",
                type: "Czerwona",
                capacity: "1.5L",
                unit: "op(6szt)",
                pricePerUnit: 32,
                supplier: {
                  id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Hellena S.A.",
                  phone: "111222333",
                  email: "hellena@admin.pl",
                  city: "Bachorza",
                  street: "Leśna",
                  number: "60",
                  bank: "PKO Bank Polski O/Bydgoszcz",
                  accountNumber: "11 2222 3333 4444 5555 6666",
                  nip: "12345678989",
                },
              },
              {
                id: "b17a2e30-00e6-4571-aa41-1478f7bab214",
                supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                name: "Oranżada",
                type: "Żółta",
                capacity: "2L",
                unit: "op(8szt)",
                pricePerUnit: 42,
                supplier: {
                  id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Hellena S.A.",
                  phone: "111222333",
                  email: "hellena@admin.pl",
                  city: "Bachorza",
                  street: "Leśna",
                  number: "60",
                  bank: "PKO Bank Polski O/Bydgoszcz",
                  accountNumber: "11 2222 3333 4444 5555 6666",
                  nip: "12345678989",
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: GET_STOCK_RAPORTS,
        },
        result: {
          data: {
            stockRaport: {
              generalData:
                '[{"id":"Oranżada Czerwona 1.5L ","value":106,"idColor":"#e5eaff"},{"id":"Oranżada Czerwona 1.5L - Dostępne","value":100,"idColor":"#e5eaff"},{"id":"Oranżada Czerwona 1.5L - Zamówione","value":400,"idColor":"#e5eaff"},{"id":"Oranżada Żółta 2L ","value":129,"idColor":"#ced8ff"},{"id":"Oranżada Żółta 2L - Dostępne","value":129,"idColor":"#ced8ff"},{"id":"Oranżada Żółta 2L - Zamówione","value":300,"idColor":"#ced8ff"}]',
              operationsData:
                '{"startedOrders":0,"startedDeliveries":0,"duringOrders":2,"duringDeliveries":1,"finishedOrders":9,"finishedDeliveries":0}',
              weekData:
                '[{"product":"Oranżada Czerwona 1.5L","Dostarczone":0,"Wysłane":0,"Bilans":0},{"product":"Oranżada Żółta 2L","Dostarczone":0,"Wysłane":0,"Bilans":0}]',
              monthData:
                '[{"product":"Oranżada Czerwona 1.5L","Dostarczone":0,"Wysłane":0,"Bilans":0},{"product":"Oranżada Żółta 2L","Dostarczone":0,"Wysłane":20,"Bilans":-20}]',
              yearData:
                '[{"product":"Oranżada Czerwona 1.5L","Dostarczone":0,"Wysłane":89,"Bilans":-89},{"product":"Oranżada Żółta 2L","Dostarczone":0,"Wysłane":71,"Bilans":-71}]',
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RaportsPage />
      </MockedProvider>
    );

    const selectInput = await screen.findByTestId("TimescopeSelect");

    expect(await screen.findByText("$101")).toBeInTheDocument();
    expect(await screen.findByText("$100")).toBeInTheDocument();
    expect(await screen.findByText("$1")).toBeInTheDocument();

    fireEvent.change(selectInput, { target: { value: "Miesiąc" } });

    expect(await screen.findByText("$202")).toBeInTheDocument();
    expect(await screen.findByText("$200")).toBeInTheDocument();
    expect(await screen.findByText("$2")).toBeInTheDocument();

    fireEvent.change(selectInput, { target: { value: "Rok" } });

    expect(await screen.findByText("$303")).toBeInTheDocument();
    expect(await screen.findByText("$300")).toBeInTheDocument();
    expect(await screen.findByText("$3")).toBeInTheDocument();
  });
});

describe("Clients", () => {
  it("ClientsDisplayAndRefreshWorkingProperly", async () => {
    const mocks = [
      {
        request: {
          query: GET_CLIENTS,
        },
        result: {
          data: {
            clients: [
              {
                id: "6ff8ae18-011d-4271-9093-265cba3355e9",
                name: "JanTex",
                phone: "111111111",
                email: "janTex@admin.pl",
                city: "Bydgoszcz",
                street: "Cicha",
                number: "13",
                nip: "999999999",
              },
            ],
          },
        },
      },
      {
        request: {
          query: GET_CLIENTS,
        },
        result: {
          data: {
            clients: [
              {
                id: "6ff8ae18-011d-4271-9093-265cba3355e9",
                name: "JanTex",
                phone: "111111111",
                email: "janTex@admin.pl",
                city: "Bydgoszcz",
                street: "Cicha",
                number: "13",
                nip: "999999999",
              },
              {
                id: "6ff8ae18-011d-4271-9093-265cba335se8",
                name: "Cortez",
                phone: "222222222",
                email: "Cortez@admin.pl",
                city: "Gdańsk",
                street: "Głośna",
                number: "11",
                nip: "3333333",
              },
            ],
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ClientsPage />
      </MockedProvider>
    );

    expect(await screen.findByText("JanTex")).toBeInTheDocument();
    expect(await screen.findByText("janTex@admin.pl")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Cortez")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText("Cortez@admin.pl")).not.toBeInTheDocument();
    });

    const refreshBtn = await screen.findByTestId("RefreshBtn");
    fireEvent.click(refreshBtn);

    expect(await screen.findByText("JanTex")).toBeInTheDocument();
    expect(await screen.findByText("janTex@admin.pl")).toBeInTheDocument();
    expect(await screen.findByText("Cortez")).toBeInTheDocument();
    expect(await screen.findByText("Cortez@admin.pl")).toBeInTheDocument();
  });
});

describe("Employee", () => {
  it("EmployeeDisplayAndRefreshWorkingProperly", async () => {
    const mocks = [
      {
        request: {
          query: GET_EMPLOYYES,
        },
        result: {
          data: {
            users: [
              {
                id: "02d4d677-874c-4a51-9e7d-e2cd63d80989",
                email: "atak2001@wp.pl",
                password:
                  "$2b$10$RTv1A9P.rx1zznwcIMxdWe0GqArjt15j9Fmhl9D1wUSAEyNLmLGqq",
                firstname: "Michał",
                lastname: "Kurtys",
                phone: "111222333",
                position: "Admin",
                adres: "ul.Cicha 4 bydgoszcz",
                token:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAyZDRkNjc3LTg3NGMtNGE1MS05ZTdkLWUyY2Q2M2Q4MDk4OSIsImVtYWlsIjoiYXRhazIwMDFAd3AucGwiLCJpYXQiOjE3MDMxNTAxMjQsImV4cCI6MTcwMzE1NzMyNH0.LmF1PIjVSIgh-g1CcLrhEkY2yIv8P9nOMktOiPUPwDQ",
                firstLogin: false,
              },
            ],
          },
        },
      },
      {
        request: {
          query: GET_EMPLOYYES,
        },
        result: {
          data: {
            users: [
              {
                id: "02d4d677-874c-4a51-9e7d-e2cd63d80989",
                email: "atak2001@wp.pl",
                password:
                  "$2b$10$RTv1A9P.rx1zznwcIMxdWe0GqArjt15j9Fmhl9D1wUSAEyNLmLGqq",
                firstname: "Michał",
                lastname: "Kurtys",
                phone: "111222333",
                position: "Admin",
                adres: "ul.Cicha 4 bydgoszcz",
                token:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAyZDRkNjc3LTg3NGMtNGE1MS05ZTdkLWUyY2Q2M2Q4MDk4OSIsImVtYWlsIjoiYXRhazIwMDFAd3AucGwiLCJpYXQiOjE3MDMxNTAxMjQsImV4cCI6MTcwMzE1NzMyNH0.LmF1PIjVSIgh-g1CcLrhEkY2yIv8P9nOMktOiPUPwDQ",
                firstLogin: false,
              },
              {
                id: "97a6ff8f-0b04-413f-b1b1-2b3a9eaae7f4",
                email: "michal-kurtys@wp.pl",
                password:
                  "$2b$10$8ee5dFw45l68UlnkBkE7heztWpoPopBs/ymOCF6GZFTGTZYoqGzqu",
                firstname: "Jan",
                lastname: "Kowalski",
                phone: "111222331",
                position: "Magazynier",
                adres: "ul. Głośna 21 Bydgoszcz",
                token:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk3YTZmZjhmLTBiMDQtNDEzZi1iMWIxLTJiM2E5ZWFhZTdmNCIsImVtYWlsIjoibWljaGFsLWt1cnR5c0B3cC5wbCIsImlhdCI6MTcwMjQ1NzA2NCwiZXhwIjoxNzAyNDY0MjY0fQ.NhIOol7f4-4b_eDhtv7XB55-VSAlwYVf49Xajeh-zrg",
                firstLogin: false,
              },
            ],
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EmployeePage />
      </MockedProvider>
    );

    expect(await screen.findByText("Michał")).toBeInTheDocument();
    expect(await screen.findByText("Admin")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Jan")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText("Magazynier")).not.toBeInTheDocument();
    });

    const refreshBtn = await screen.findByTestId("RefreshBtn");
    fireEvent.click(refreshBtn);

    expect(await screen.findByText("Michał")).toBeInTheDocument();
    expect(await screen.findByText("Admin")).toBeInTheDocument();
    expect(await screen.findByText("Jan")).toBeInTheDocument();
    expect(await screen.findByText("Magazynier")).toBeInTheDocument();
  });
});

describe("Suppliers", () => {
  it("SuppliersDisplayAndRefreshWorkingProperly", async () => {
    const mocks = [
      {
        request: {
          query: GET_SUPPLIERS,
        },
        result: {
          data: {
            suppliers: [
              {
                id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                name: "Hellena S.A.",
                phone: "111222333",
                email: "hellena@admin.pl",
                city: "Bachorza",
                street: "Leśna",
                number: "60",
                bank: "PKO Bank Polski O/Bydgoszcz",
                accountNumber: "11 2222 3333 4444 5555 6666",
                nip: "12345678989",
              },
            ],
          },
        },
      },
      {
        request: {
          query: GET_SUPPLIERS,
        },
        result: {
          data: {
            suppliers: [
              {
                id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                name: "Hellena S.A.",
                phone: "111222333",
                email: "hellena@admin.pl",
                city: "Bachorza",
                street: "Leśna",
                number: "60",
                bank: "PKO Bank Polski O/Bydgoszcz",
                accountNumber: "11 2222 3333 4444 5555 6666",
                nip: "12345678989",
              },
              {
                id: "f611a553-81e3-40ea-b988-b27f3689d2d6",
                name: "TomTex",
                phone: "111222333",
                email: "tomtex@admin.pl",
                city: "Bachorza",
                street: "Leśna",
                number: "60",
                bank: "PKO Bank Polski O/Bydgoszcz",
                accountNumber: "11 2222 3333 4444 5555 6666",
                nip: "12345678989",
              },
            ],
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SuppliersPage />
      </MockedProvider>
    );

    expect(await screen.findByText("Hellena S.A.")).toBeInTheDocument();
    expect(await screen.findByText("hellena@admin.pl")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("TomTex")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText("tomtex@admin.pl")).not.toBeInTheDocument();
    });

    const refreshBtn = await screen.findByTestId("RefreshBtn");
    fireEvent.click(refreshBtn);

    expect(await screen.findByText("Hellena S.A.")).toBeInTheDocument();
    expect(await screen.findByText("hellena@admin.pl")).toBeInTheDocument();
    expect(await screen.findByText("TomTex")).toBeInTheDocument();
    expect(await screen.findByText("tomtex@admin.pl")).toBeInTheDocument();
  });
});

describe("Products", () => {
  it("ProductsDisplayAndRefreshWorkingProperly", async () => {
    const mocks = [
      {
        request: {
          query: GET_PRODUCTS,
        },
        result: {
          data: {
            products: [
              {
                id: "7c27511f-96d6-4542-bce5-9ec07c965976",
                supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                name: "Oranżada",
                type: "Czerwona",
                capacity: "1.5L",
                unit: "op(6szt)",
                pricePerUnit: 32,
                supplier: {
                  id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Hellena S.A.",
                  phone: "111222333",
                  email: "hellena@admin.pl",
                  city: "Bachorza",
                  street: "Leśna",
                  number: "60",
                  bank: "PKO Bank Polski O/Bydgoszcz",
                  accountNumber: "11 2222 3333 4444 5555 6666",
                  nip: "12345678989",
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: GET_PRODUCTS,
        },
        result: {
          data: {
            products: [
              {
                id: "7c27511f-96d6-4542-bce5-9ec07c965976",
                supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                name: "Oranżada",
                type: "Czerwona",
                capacity: "1.5L",
                unit: "op(6szt)",
                pricePerUnit: 32,
                supplier: {
                  id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Hellena S.A.",
                  phone: "111222333",
                  email: "hellena@admin.pl",
                  city: "Bachorza",
                  street: "Leśna",
                  number: "60",
                  bank: "PKO Bank Polski O/Bydgoszcz",
                  accountNumber: "11 2222 3333 4444 5555 6666",
                  nip: "12345678989",
                },
              },
              {
                id: "b17a2e30-00e6-4571-aa41-1478f7bab214",
                supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                name: "Oranżada",
                type: "Żółta",
                capacity: "2L",
                unit: "op(8szt)",
                pricePerUnit: 42,
                supplier: {
                  id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Hellena S.A.",
                  phone: "111222333",
                  email: "hellena@admin.pl",
                  city: "Bachorza",
                  street: "Leśna",
                  number: "60",
                  bank: "PKO Bank Polski O/Bydgoszcz",
                  accountNumber: "11 2222 3333 4444 5555 6666",
                  nip: "12345678989",
                },
              },
            ],
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProductsPage />
      </MockedProvider>
    );

    expect(await screen.findByText("op(6szt)")).toBeInTheDocument();
    expect(await screen.findByText("Czerwona")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("op(8szt)")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText("Żółta")).not.toBeInTheDocument();
    });

    const refreshBtn = await screen.findByTestId("RefreshBtn");
    fireEvent.click(refreshBtn);

    expect(await screen.findByText("op(6szt)")).toBeInTheDocument();
    expect(await screen.findByText("Czerwona")).toBeInTheDocument();
    expect(await screen.findByText("op(8szt)")).toBeInTheDocument();
    expect(await screen.findByText("Żółta")).toBeInTheDocument();
  });
});

describe("Deliveries", () => {
  it("DeliveriesDisplayAndRefreshWorkingProperly", async () => {
    const mocks = [
      {
        request: {
          query: GET_DELIVERIES,
        },
        result: {
          data: {
            deliveries: [
              {
                id: "9ff61295-c04d-4c47-b54a-251d69e384e2",
                supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                supplier: {
                  id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Hellena S.A.",
                  phone: "111222333",
                  email: "hellena@admin.pl",
                  city: "Bachorza",
                  street: "Leśna",
                  number: "60",
                  bank: "PKO Bank Polski O/Bydgoszcz",
                  accountNumber: "11 2222 3333 4444 5555 6666",
                  nip: "12345678989",
                },
                date: "1701679827000",
                expectedDate: "1701734400000",
                products:
                  '[{\\"id\\":0,\\"product\\":\\"Oranżada Czerwona 1.5L\\",\\"unit\\":\\"op(6szt)\\",\\"quantity\\":\\"100\\",\\"delivered\\":\\"100\\",\\"damaged\\":\\"5\\"},{\\"id\\":1,\\"product\\":\\"Oranżada Żółta 2L\\",\\"unit\\":\\"op(8szt)\\",\\"quantity\\":\\"100\\",\\"delivered\\":\\"100\\",\\"damaged\\":\\"0\\"}]',
                state: "Rozlokowano",
                totalPrice: 9102,
              },
            ],
          },
        },
      },
      {
        request: {
          query: GET_DELIVERIES,
        },
        result: {
          data: {
            deliveries: [
              {
                id: "9ff61295-c04d-4c47-b54a-251d69e384e2",
                supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                supplier: {
                  id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Hellena S.A.",
                  phone: "111222333",
                  email: "hellena@admin.pl",
                  city: "Bydgoszcz",
                  street: "Leśna",
                  number: "60",
                  bank: "PKO Bank Polski O/Bydgoszcz",
                  accountNumber: "11 2222 3333 4444 5555 6666",
                  nip: "12345678989",
                },
                date: "1701679827000",
                expectedDate: "1701734400000",
                products:
                  '[{\\"id\\":0,\\"product\\":\\"Oranżada Czerwona 1.5L\\",\\"unit\\":\\"op(6szt)\\",\\"quantity\\":\\"100\\",\\"delivered\\":\\"100\\",\\"damaged\\":\\"5\\"},{\\"id\\":1,\\"product\\":\\"Oranżada Żółta 2L\\",\\"unit\\":\\"op(8szt)\\",\\"quantity\\":\\"100\\",\\"delivered\\":\\"100\\",\\"damaged\\":\\"0\\"}]',
                state: "Rozlokowano",
                totalPrice: 9000,
              },
              {
                id: "9ff61295-c04d-4c47-b54a-251d69e384e3",
                supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                supplier: {
                  id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "JanTex",
                  phone: "111222333",
                  email: "jantex@admin.pl",
                  city: "Bydgoszcz",
                  street: "Leśna",
                  number: "60",
                  bank: "PKO Bank Polski O/Bydgoszcz",
                  accountNumber: "11 2222 3333 4444 5555 6666",
                  nip: "12345678989",
                },
                date: "1701679827000",
                expectedDate: "1701734400000",
                products:
                  '[{\\"id\\":0,\\"product\\":\\"Oranżada Czerwona 1.5L\\",\\"unit\\":\\"op(6szt)\\",\\"quantity\\":\\"100\\",\\"delivered\\":\\"100\\",\\"damaged\\":\\"5\\"},{\\"id\\":1,\\"product\\":\\"Oranżada Żółta 2L\\",\\"unit\\":\\"op(8szt)\\",\\"quantity\\":\\"100\\",\\"delivered\\":\\"100\\",\\"damaged\\":\\"0\\"}]',
                state: "Zakończono",
                totalPrice: 10000,
              },
            ],
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DeliveriesPage />
      </MockedProvider>
    );

    expect(await screen.findByText("Hellena S.A.")).toBeInTheDocument();
    expect(await screen.findByText("Rozlokowano")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("JanTex")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText("Zakończono")).not.toBeInTheDocument();
    });

    const refreshBtn = await screen.findByTestId("RefreshBtn");
    fireEvent.click(refreshBtn);

    expect(await screen.findByText("Hellena S.A.")).toBeInTheDocument();
    expect(await screen.findByText("Rozlokowano")).toBeInTheDocument();
    expect(await screen.findByText("JanTex")).toBeInTheDocument();
    expect(await screen.findByText("Zakończono")).toBeInTheDocument();
  });
});

describe("Shipping", () => {
  it("ShippingDisplayAndRefreshWorkingProperly", async () => {
    const mocks = [
      {
        request: {
          query: GET_SHIPMENTS,
        },
        result: {
          data: {
            shipments: [
              {
                id: "18ebad49-c46b-4022-acfa-65676dc51c73",
                employee: "Janusz Kowalski",
                registrationNumber: "CB 75TM",
                deliveryDate: "2023-11-05",
                orders:
                  '[{\\"id\\":\\"d60062f6-5285-4a19-82ff-ed61152d07a3\\"}]',
                pickingList:
                  '{"createDate":1699178696143,"picklistID":"20740853","orders":[{"orderID":"OUT00002","orderDate":"1699142400000","products":[{"productCode":"A00001","productQuantity":"15","productUnit":"op(6szt)","productName":"Oranżada Czerwona 1.5L"},{"productCode":"A00002","productQuantity":"10","productUnit":"op(8szt)","productName":"Oranżada Żółta 2L"}]}]}',
                waybill:
                  '[{"employeeName":"Janusz Kowalski","registrationNumber":"CAL 75TM","deliveryDate":"2023-11-05","warehouseAddress":"ul. Cicha 2 Bydgoszcz","orderId":"d60062f6-5285-4a19-82ff-ed61152d07a3","clientName":"JanTex","clientAddress":"Cicha 13 Bydgoszcz","destinationAddress":"Cicha 13 Bydgoszcz","products":[{"orderId":"d60062f6-5285-4a19-82ff-ed61152d07a3","id":0,"product":"Oranżada Czerwona 1.5L","unit":"op(6szt)","quantity":"15","delivered":0,"damaged":0,"weight":"1"},{"orderId":"d60062f6-5285-4a19-82ff-ed61152d07a3","id":1,"product":"Oranżada Żółta 2L","unit":"op(8szt)","quantity":"10","delivered":0,"damaged":0,"weight":"2"}]}]',
                state: "Zakończono",
              },
            ],
          },
        },
      },
      {
        request: {
          query: GET_SHIPMENTS,
        },
        result: {
          data: {
            shipments: [
              {
                id: "18ebad49-c46b-4022-acfa-65676dc51c73",
                employee: "Janusz Kowalski",
                registrationNumber: "CB 75TM",
                deliveryDate: "2023-11-05",
                orders:
                  '[{\\"id\\":\\"d60062f6-5285-4a19-82ff-ed61152d07a3\\"}]',
                pickingList:
                  '{"createDate":1699178696143,"picklistID":"20740853","orders":[{"orderID":"OUT00002","orderDate":"1699142400000","products":[{"productCode":"A00001","productQuantity":"15","productUnit":"op(6szt)","productName":"Oranżada Czerwona 1.5L"},{"productCode":"A00002","productQuantity":"10","productUnit":"op(8szt)","productName":"Oranżada Żółta 2L"}]}]}',
                waybill:
                  '[{"employeeName":"Janusz Kowalski","registrationNumber":"CAL 75TM","deliveryDate":"2023-11-05","warehouseAddress":"ul. Cicha 2 Bydgoszcz","orderId":"d60062f6-5285-4a19-82ff-ed61152d07a3","clientName":"JanTex","clientAddress":"Cicha 13 Bydgoszcz","destinationAddress":"Cicha 13 Bydgoszcz","products":[{"orderId":"d60062f6-5285-4a19-82ff-ed61152d07a3","id":0,"product":"Oranżada Czerwona 1.5L","unit":"op(6szt)","quantity":"15","delivered":0,"damaged":0,"weight":"1"},{"orderId":"d60062f6-5285-4a19-82ff-ed61152d07a3","id":1,"product":"Oranżada Żółta 2L","unit":"op(8szt)","quantity":"10","delivered":0,"damaged":0,"weight":"2"}]}]',
                state: "Zakończono",
              },
              {
                id: "9efab1e0-45a6-4889-8abe-04e72906984d",
                employee: "Andrzej Nowak",
                registrationNumber: "CB 88ZZ",
                deliveryDate: "2023-11-12",
                orders: "",
                pickingList:
                  '{"createDate":1699363002228,"picklistID":"14079408","orders":[]}',
                waybill: "",
                state: "Pakowanie",
              },
            ],
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ShippingPage />
      </MockedProvider>
    );

    expect(await screen.findByText("Janusz Kowalski")).toBeInTheDocument();
    expect(await screen.findByText("CB 75TM")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Andrzej Nowak")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText("CB 88ZZ")).not.toBeInTheDocument();
    });

    const refreshBtn = await screen.findByTestId("RefreshBtn");
    fireEvent.click(refreshBtn);

    expect(await screen.findByText("Janusz Kowalski")).toBeInTheDocument();
    expect(await screen.findByText("CB 75TM")).toBeInTheDocument();
    expect(await screen.findByText("Andrzej Nowak")).toBeInTheDocument();
    expect(await screen.findByText("CB 88ZZ")).toBeInTheDocument();
  });
});

describe("Orders", () => {
  it("OrdersDisplayAndRefreshWorkingProperly", async () => {
    const mocks = [
      {
        request: {
          query: GET_ORDERS_STOCK,
        },
        result: {
          data: {
            orders: [
              {
                id: "4ebd076b-f816-49e3-b573-f1edd99fb3df",
                clientId: "6ff8ae18-011d-4271-9093-265cba3355e9",
                client: {
                  id: "6ff8ae18-011d-4271-9093-265cba3355e9",
                  name: "JanTexx",
                  phone: "111222333",
                  email: "janTex@admin.pl",
                  city: "Bydgoszcz",
                  street: "Cichaa",
                  number: "13",
                  nip: "999999998",
                },
                orderID: "OUT00004",
                date: "1699179800000",
                expectedDate: "1699142400000",
                products:
                  '[{\\"id\\":0,\\"product\\":\\"Oranżada Czerwona 1.5L\\",\\"unit\\":\\"op(6szt)\\",\\"quantity\\":\\"10\\"},{\\"id\\":1,\\"product\\":\\"Oranżada Żółta 2L\\",\\"unit\\":\\"op(8szt)\\",\\"quantity\\":\\"15\\"}]',
                state: "Zakończono",
                transportType: "shipment",
                totalPrice: 1635.9,
              },
            ],
            stocks: [
              {
                id: "1ddbbdb5-49a7-4a0f-bf52-abc30d8c44ae",
                productId: "7c27511f-96d6-4542-bce5-9ec07c965976",
                code: "A00001",
                totalQuantity: 106,
                availableStock: 100,
                ordered: 400,
                product: {
                  id: "7c27511f-96d6-4542-bce5-9ec07c965976",
                  supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Oranżada",
                  type: "Czerwona",
                  capacity: "1.5L",
                  unit: "op(6szt)",
                  pricePerUnit: 32,
                  supplier: {
                    id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                    name: "Hellena S.A.",
                    phone: "111222333",
                    email: "hellena@admin.pl",
                    city: "Bachorza",
                    street: "Leśna",
                    number: "60",
                    bank: "PKO Bank Polski O/Bydgoszcz",
                    accountNumber: "11 2222 3333 4444 5555 6666",
                    nip: "12345678989",
                  },
                },
                preOrdered: 0,
              },
              {
                id: "ea93e086-17fe-4065-ae13-89070bd2feda",
                productId: "b17a2e30-00e6-4571-aa41-1478f7bab214",
                code: "A00002",
                totalQuantity: 129,
                availableStock: 129,
                ordered: 300,
                product: {
                  id: "b17a2e30-00e6-4571-aa41-1478f7bab214",
                  supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Oranżada",
                  type: "Żółta",
                  capacity: "2L",
                  unit: "op(8szt)",
                  pricePerUnit: 42,
                  supplier: {
                    id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                    name: "Hellena S.A.",
                    phone: "111222333",
                    email: "hellena@admin.pl",
                    city: "Bachorza",
                    street: "Leśna",
                    number: "60",
                    bank: "PKO Bank Polski O/Bydgoszcz",
                    accountNumber: "11 2222 3333 4444 5555 6666",
                    nip: "12345678989",
                  },
                },
                preOrdered: 0,
              },
            ],
          },
        },
      },
      {
        request: {
          query: GET_ORDERS_STOCK,
        },
        result: {
          data: {
            orders: [
              {
                id: "4ebd076b-f816-49e3-b573-f1edd99fb3df",
                clientId: "6ff8ae18-011d-4271-9093-265cba3355e9",
                client: {
                  id: "6ff8ae18-011d-4271-9093-265cba3355e9",
                  name: "JanTexx",
                  phone: "111222333",
                  email: "janTex@admin.pl",
                  city: "Bydgoszcz",
                  street: "Cichaa",
                  number: "13",
                  nip: "999999998",
                },
                orderID: "OUT00004",
                date: "1699179800000",
                expectedDate: "1699142400000",
                products:
                  '[{\\"id\\":0,\\"product\\":\\"Oranżada Czerwona 1.5L\\",\\"unit\\":\\"op(6szt)\\",\\"quantity\\":\\"10\\"},{\\"id\\":1,\\"product\\":\\"Oranżada Żółta 2L\\",\\"unit\\":\\"op(8szt)\\",\\"quantity\\":\\"15\\"}]',
                state: "Zakończono",
                transportType: "shipment",
                totalPrice: 1635.9,
              },
              {
                id: "4f982a25-9eee-438f-93bb-4f2d2fc87d96",
                clientId: "6ff8ae18-011d-4271-9093-265cba3355e9",
                client: {
                  id: "6ff8ae18-011d-4271-9093-265cba3355e9",
                  name: "JanTexx",
                  phone: "111222333",
                  email: "janTex@admin.pl",
                  city: "Bydgoszcz",
                  street: "Cichaa",
                  number: "13",
                  nip: "999999998",
                },
                orderID: "OUT00008",
                date: "1700408513000",
                expectedDate: "1699747200000",
                products:
                  '[{\\"id\\":0,\\"product\\":\\"Oranżada Czerwona 1.5L\\",\\"unit\\":\\"op(6szt)\\",\\"quantity\\":\\"5\\"}]',
                state: "Potwierdzono",
                transportType: "personal",
                totalPrice: 275.52,
              },
            ],
            stocks: [
              {
                id: "1ddbbdb5-49a7-4a0f-bf52-abc30d8c44ae",
                productId: "7c27511f-96d6-4542-bce5-9ec07c965976",
                code: "A00001",
                totalQuantity: 106,
                availableStock: 100,
                ordered: 400,
                product: {
                  id: "7c27511f-96d6-4542-bce5-9ec07c965976",
                  supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Oranżada",
                  type: "Czerwona",
                  capacity: "1.5L",
                  unit: "op(6szt)",
                  pricePerUnit: 32,
                  supplier: {
                    id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                    name: "Hellena S.A.",
                    phone: "111222333",
                    email: "hellena@admin.pl",
                    city: "Bachorza",
                    street: "Leśna",
                    number: "60",
                    bank: "PKO Bank Polski O/Bydgoszcz",
                    accountNumber: "11 2222 3333 4444 5555 6666",
                    nip: "12345678989",
                  },
                },
                preOrdered: 0,
              },
              {
                id: "ea93e086-17fe-4065-ae13-89070bd2feda",
                productId: "b17a2e30-00e6-4571-aa41-1478f7bab214",
                code: "A00002",
                totalQuantity: 129,
                availableStock: 129,
                ordered: 300,
                product: {
                  id: "b17a2e30-00e6-4571-aa41-1478f7bab214",
                  supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                  name: "Oranżada",
                  type: "Żółta",
                  capacity: "2L",
                  unit: "op(8szt)",
                  pricePerUnit: 42,
                  supplier: {
                    id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
                    name: "Hellena S.A.",
                    phone: "111222333",
                    email: "hellena@admin.pl",
                    city: "Bachorza",
                    street: "Leśna",
                    number: "60",
                    bank: "PKO Bank Polski O/Bydgoszcz",
                    accountNumber: "11 2222 3333 4444 5555 6666",
                    nip: "12345678989",
                  },
                },
                preOrdered: 0,
              },
            ],
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <OrdersPage />
      </MockedProvider>
    );

    expect(await screen.findByText("OUT00004")).toBeInTheDocument();
    expect(await screen.findByText("Zakończono")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("OUT00008")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText("Potwierdzono")).not.toBeInTheDocument();
    });

    const refreshBtn = await screen.findByTestId("RefreshBtn");
    fireEvent.click(refreshBtn);

    expect(await screen.findByText("OUT00004")).toBeInTheDocument();
    expect(await screen.findByText("Zakończono")).toBeInTheDocument();
    expect(await screen.findByText("OUT00008")).toBeInTheDocument();
    expect(await screen.findByText("Potwierdzono")).toBeInTheDocument();
  });
});
