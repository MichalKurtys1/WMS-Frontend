import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import {
  GET_CLIENTS_STOCK_PRODUCTS,
  GET_FORMATED_CALENDAR,
  GET_PRODUCTS_SUPPLIERS,
} from "../utils/apollo/apolloMultipleQueries";
import CalendarPage from "../pages/calendar/CalendarPage";
import {
  ADD_CALENDAR,
  ADD_CLIENT,
  ADD_DELIVERY,
  ADD_EMPLOYEE,
  ADD_ORDER,
  ADD_PRODUCT,
  ADD_SUPPLIER,
  DELETE_CALENDAR,
  FILE_DELETE,
} from "../utils/apollo/apolloMutations";
import { GET_FILES, GET_SUPPLIERS } from "../utils/apollo/apolloQueries";
import DocumentsPage from "../pages/documents/DocumentsPage";
import ClientsAddPage from "../pages/clients/ClientsAddPage";
import EmployeeAddPage from "../pages/employee/EmployeeAddPage";
import SuppliersAddPage from "../pages/suppliers/SuppliersAddPage";
import ProductsAddPage from "../pages/products/ProductsAddPage";
import DeliveriesAddPage from "../pages/deliveries/DeliveriesAddPage";
import OrdersAddPage from "../pages/orders/OrdersAddPage";

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

// describe("CalendarPage", () => {
//   it("AddingEventWorkingProperly", async () => {
//     const mocks = [
//       {
//         request: {
//           query: GET_FORMATED_CALENDAR,
//         },
//         result: {
//           data: {
//             formatedCalendar: {
//               standardData: [
//                 {
//                   id: "1",
//                   date: "1701817200000",
//                   time: "14:00",
//                   event: "dd",
//                   createdAt: "2023-12-15T09:28:47.000Z",
//                   updatedAt: "2023-12-15T09:28:47.000Z",
//                 },
//               ],
//               carrierData: [
//                 {
//                   id: "3",
//                   date: "1701817200000",
//                   time: "14:00",
//                   event: "dd",
//                   createdAt: "2023-12-15T09:28:47.000Z",
//                   updatedAt: "2023-12-15T09:28:47.000Z",
//                 },
//               ],
//             },
//           },
//         },
//       },
//       {
//         request: {
//           query: ADD_CALENDAR,
//           variables: {
//             date: "1702594800000",
//             time: "10:00",
//             event: "wydarzenie1",
//           },
//         },
//         result: {
//           data: {
//             createCalendar: true,
//           },
//         },
//       },
//       {
//         request: {
//           query: GET_FORMATED_CALENDAR,
//         },
//         result: {
//           data: {
//             formatedCalendar: {
//               standardData: [
//                 {
//                   id: "1",
//                   date: "1701817200000",
//                   time: "14:00",
//                   event: "dd",
//                   createdAt: "2024-01-15T09:28:47.000Z",
//                   updatedAt: "2024-01-15T09:28:47.000Z",
//                 },
//                 {
//                   id: "2",
//                   date: "1701817200000",
//                   time: "14:00",
//                   event: "wydarzenie1",
//                   createdAt: "2024-01-15T09:28:47.000Z",
//                   updatedAt: "2024-01-15T09:28:47.000Z",
//                 },
//               ],
//               carrierData: [
//                 {
//                   id: "3",
//                   date: "1701817200000",
//                   time: "14:00",
//                   event: "dd",
//                   createdAt: "2024-01-15T09:28:47.000Z",
//                   updatedAt: "2024-01-15T09:28:47.000Z",
//                 },
//                 {
//                   id: "2",
//                   date: "1701817200000",
//                   time: "14:00",
//                   event: "wydarzenie1",
//                   createdAt: "2024-01-15T09:28:47.000Z",
//                   updatedAt: "2024-01-15T09:28:47.000Z",
//                 },
//               ],
//             },
//           },
//         },
//       },
//     ];

//     render(
//       <MockedProvider mocks={mocks} addTypename={false}>
//         <CalendarPage />
//       </MockedProvider>
//     );

//     const day = await screen.findByText("15");
//     fireEvent.click(day);

//     const faPlusIcon = await screen.findByTestId("PlusBtn");
//     fireEvent.click(faPlusIcon);

//     const timeInput = await screen.findByPlaceholderText("godzina");
//     const eventInput = await screen.findByPlaceholderText("Wydarzenie");
//     fireEvent.change(timeInput, { target: { value: "10:00" } });
//     fireEvent.change(eventInput, { target: { value: "wydarzenie1" } });

//     const submitBtn = await screen.findByTestId("SubmitBtn");
//     fireEvent.click(submitBtn);

//     expect(await screen.findByText("wydarzenie1")).toBeInTheDocument();
//   });

//   it("DeletingEventWorkingProperly", async () => {
//     const mocks = [
//       {
//         request: {
//           query: GET_FORMATED_CALENDAR,
//         },
//         result: {
//           data: {
//             formatedCalendar: {
//               standardData: [
//                 {
//                   id: "2",
//                   date: "1702594800000",
//                   time: "10:00",
//                   event: "wydarzenie1",
//                   createdAt: "2024-01-15T09:28:47.000Z",
//                   updatedAt: "2024-01-15T09:28:47.000Z",
//                 },
//               ],
//               carrierData: [],
//             },
//           },
//         },
//       },
//       {
//         request: {
//           query: DELETE_CALENDAR,
//           variables: {
//             deleteCalendarId: "2",
//           },
//         },
//         result: {
//           data: {
//             deleteCalendar: true,
//           },
//         },
//       },
//       {
//         request: {
//           query: GET_FORMATED_CALENDAR,
//         },
//         result: {
//           data: {
//             formatedCalendar: {
//               standardData: [],
//               carrierData: [],
//             },
//           },
//         },
//       },
//     ];

//     render(
//       <MockedProvider mocks={mocks} addTypename={false}>
//         <CalendarPage />
//       </MockedProvider>
//     );

//     const day = await screen.findByText("15");
//     fireEvent.click(day);

//     const DeleteBtn = await screen.findByTestId("DeleteBtn");
//     fireEvent.click(DeleteBtn);

//     expect(await screen.findByText("wydarzenie1")).not.toBeInTheDocument();
//   });
// });

describe("Documents", () => {
  it("DeleteFilesProperly", async () => {
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
      {
        request: {
          query: FILE_DELETE,
          variables: {
            filename: "99068314.pdf",
          },
        },
        result: {
          data: {
            fileDelete: true,
          },
        },
      },
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
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DocumentsPage />
      </MockedProvider>
    );

    const deleteBtns = await screen.findAllByTestId("DeleteBtn");
    fireEvent.click(deleteBtns[0]);

    await waitFor(() => {
      expect(
        screen.queryByText(/FAKTURA\/2023-11-08\/99068314/)
      ).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText("99068314.pdf")).not.toBeInTheDocument();
    });
  });

  it("FiltersFilesProperly", async () => {
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
                category: "Zamówienia",
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
              {
                id: "11ad6ef2-9ec5-4239-9993-1170cbd26392",
                name: "FAKTURA/2023-11-08/11068314",
                filename: "11068314.pdf",
                date: "2023-11-07T13:20:53.319Z",
                category: "Zamówienia",
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

    await waitFor(() => {
      expect(
        screen.queryByText("FAKTURA/2023-11-23/65611443")
      ).not.toBeInTheDocument();
    });

    const selectInput = await screen.findByTestId("Select");
    fireEvent.change(selectInput, { target: { value: "Zamówienia" } });

    await waitFor(() => {
      expect(
        screen.getByText("FAKTURA/2023-11-23/65611443")
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText("FAKTURA/2023-11-08/11068314")
      ).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Wpisz nazwę...");
    fireEvent.change(searchInput, { target: { value: "65611443" } });

    await waitFor(() => {
      expect(
        screen.queryByText("FAKTURA/2023-11-08/11068314")
      ).not.toBeInTheDocument();
    });
  });
});

describe("Clients", () => {
  it("ClientsAddWorkingProperly", async () => {
    const mocks = [
      {
        request: {
          query: ADD_CLIENT,
          variables: {
            name: "Jan",
            email: "jan@test.pl",
            phone: "111111111",
            city: "Bydgoszcz",
            street: "Cicha",
            number: "13",
            nip: "123456",
          },
        },
        result: {
          data: {
            createClient: {
              id: "a30495aa-db43-4c25-a604-948d044892a9",
              name: "Jan",
              email: "jan@test.pl",
              phone: "111111111",
              city: "Bydgoszcz",
              street: "Cicha",
              number: "13",
              nip: "123456",
            },
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ClientsAddPage />
      </MockedProvider>
    );

    const input1 = screen.getByPlaceholderText("Nazwa *");
    const input2 = screen.getByPlaceholderText("Numer telefonu *");
    const input3 = screen.getByPlaceholderText("Adres e-mail *");
    const input4 = screen.getByPlaceholderText("Miejscowość *");
    const input5 = screen.getByPlaceholderText("Ulica *");
    const input6 = screen.getByPlaceholderText("Numer *");
    const input7 = screen.getByPlaceholderText("NIP");
    fireEvent.change(input1, { target: { value: "Jan" } });
    fireEvent.change(input2, { target: { value: "111111111" } });
    fireEvent.change(input3, { target: { value: "jan@test.pl" } });
    fireEvent.change(input4, { target: { value: "Bydgoszcz" } });
    fireEvent.change(input5, { target: { value: "Cicha" } });
    fireEvent.change(input6, { target: { value: "13" } });
    fireEvent.change(input7, { target: { value: "123456" } });

    const submitBtn = await screen.findByTestId("SubmitBtn");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUseNavigate).toHaveBeenCalledWith("/clients", {
        state: {
          userData: {
            city: "Bydgoszcz",
            email: "jan@test.pl",
            id: "a30495aa-db43-4c25-a604-948d044892a9",
            name: "Jan",
            nip: "123456",
            number: "13",
            phone: "111111111",
            street: "Cicha",
          },
        },
      });
    });
  });
});

describe("Employee", () => {
  it("EmployeeAddWorkingProperly", async () => {
    const mocks = [
      {
        request: {
          query: ADD_EMPLOYEE,
          variables: {
            firstname: "Jan",
            lastname: "Kowalski",
            email: "jan@test.pl",
            phone: "111111111",
            position: "Magazynier",
            adres: "ul. Cicha 13 Bydgoszcz",
          },
        },
        result: {
          data: {
            createUser: {
              id: "a30495aa-db43-4c25-a604-948d044892a9",
              firstname: "Jan",
              lastname: "Kowalski",
              email: "jan@test.pl",
              phone: "111111111",
              position: "Magazynier",
              adres: "ul. Cicha 13 Bydgoszcz",
            },
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EmployeeAddPage />
      </MockedProvider>
    );

    const input1 = screen.getByPlaceholderText("Imię");
    const input2 = screen.getByPlaceholderText("Nazwisko");
    const input3 = screen.getByPlaceholderText("Adres e-mail");
    const input4 = screen.getByPlaceholderText("Numer telefonu");
    const input5 = screen.getByPlaceholderText("Adres zamieszkania");
    const input6 = screen.getByPlaceholderText("Wybierz Stanowisko");
    fireEvent.change(input1, { target: { value: "Jan" } });
    fireEvent.change(input2, { target: { value: "Kowalski" } });
    fireEvent.change(input3, { target: { value: "jan@test.pl" } });
    fireEvent.change(input4, { target: { value: "111111111" } });
    fireEvent.change(input5, { target: { value: "ul. Cicha 13 Bydgoszcz" } });
    fireEvent.change(input6, { target: { value: "Magazynier" } });

    const submitBtn = await screen.findByTestId("SubmitBtn");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUseNavigate).toHaveBeenCalledWith("/employees", {
        state: {
          userData: {
            id: "a30495aa-db43-4c25-a604-948d044892a9",
            firstname: "Jan",
            lastname: "Kowalski",
            email: "jan@test.pl",
            phone: "111111111",
            position: "Magazynier",
            adres: "ul. Cicha 13 Bydgoszcz",
          },
        },
      });
    });
  });
});

describe("Suppliers", () => {
  it("SuppliersAddWorkingProperly", async () => {
    const mocks = [
      {
        request: {
          query: ADD_SUPPLIER,
          variables: {
            name: "Hellena Inc.",
            email: "hellena.marketing@wp.pl",
            phone: "111222333",
            city: "Gdańsk",
            street: "Głośna",
            number: "16",
            nip: "654321",
            bank: "PKO Bank Polski O/Bydgoszcz",
            accountNumber: "11 2222 3333 4444 5555 6666",
          },
        },
        result: {
          data: {
            createSupplier: {
              id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
              name: "Hellena Inc.",
              email: "hellena.marketing@wp.pl",
              phone: "111222333",
              city: "Gdańsk",
              street: "Głośna",
              number: "16",
              nip: "654321",
              bank: "PKO Bank Polski O/Bydgoszcz",
              accountNumber: "11 2222 3333 4444 5555 6666",
            },
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SuppliersAddPage />
      </MockedProvider>
    );

    const input1 = await screen.findByPlaceholderText("Nazwa *");
    const input2 = await screen.findByPlaceholderText("Numer telefonu *");
    const input3 = await screen.findByPlaceholderText("Adres e-mail *");
    const input4 = await screen.findByPlaceholderText("Miejscowość *");
    const input5 = await screen.findByPlaceholderText("Ulica *");
    const input6 = await screen.findByPlaceholderText("Numer *");
    const input7 = await screen.findByPlaceholderText("NIP");
    const input8 = await screen.findByPlaceholderText("Nazwa banku");
    const input9 = await screen.findByPlaceholderText("Numer konta");

    fireEvent.change(input1, { target: { value: "Hellena Inc." } });
    fireEvent.change(input2, {
      target: { value: "111222333" },
    });
    fireEvent.change(input3, { target: { value: "hellena.marketing@wp.pl" } });
    fireEvent.change(input4, { target: { value: "Gdańsk" } });
    fireEvent.change(input5, { target: { value: "Głośna" } });
    fireEvent.change(input6, { target: { value: "16" } });
    fireEvent.change(input7, { target: { value: "654321" } });
    fireEvent.change(input8, {
      target: { value: "PKO Bank Polski O/Bydgoszcz" },
    });
    fireEvent.change(input9, {
      target: { value: "11 2222 3333 4444 5555 6666" },
    });

    const submitBtn = await screen.findByTestId("SubmitBtn");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUseNavigate).toHaveBeenCalledWith("/suppliers", {
        state: {
          userData: {
            id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
            name: "Hellena Inc.",
            email: "hellena.marketing@wp.pl",
            phone: "111222333",
            city: "Gdańsk",
            street: "Głośna",
            number: "16",
            nip: "654321",
            bank: "PKO Bank Polski O/Bydgoszcz",
            accountNumber: "11 2222 3333 4444 5555 6666",
          },
        },
      });
    });
  });
});

describe("Products", () => {
  it("ProductsAddWorkingProperly", async () => {
    const mocks = [
      {
        request: {
          query: ADD_PRODUCT,
          variables: {
            supplierId: "Hellena S.A.",
            name: "Oranżada",
            type: "Żółta",
            capacity: "3L",
            unit: "op(8szt)",
            pricePerUnit: 44,
          },
        },
        result: {
          data: {
            createProduct: {
              id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
              supplierId: "Hellena S.A.",
              name: "Oranżada",
              type: "Żółta",
              capacity: "3L",
              unit: "op(8szt)",
              pricePerUnit: 44,
            },
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
        <ProductsAddPage />
      </MockedProvider>
    );

    const input1 = await screen.findByPlaceholderText("Wybierz Dostawcę");
    const input2 = await screen.findByPlaceholderText("Nazwa");
    const input3 = await screen.findByPlaceholderText("Typ");
    const input4 = await screen.findByPlaceholderText("Pojemność");
    const input5 = await screen.findByPlaceholderText("Cena za jednostkę");
    const input6 = await screen.findByPlaceholderText("Wybierz Jednostkę");

    fireEvent.change(input1, { target: { value: "Hellena S.A." } });
    fireEvent.change(input2, {
      target: { value: "Oranżada" },
    });
    fireEvent.change(input3, {
      target: { value: "Żółta" },
    });
    fireEvent.change(input4, {
      target: { value: "3L" },
    });
    fireEvent.change(input5, {
      target: { value: 44 },
    });
    fireEvent.change(input6, {
      target: { value: "op(8szt)" },
    });

    const submitBtn = await screen.findByTestId("SubmitBtn");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUseNavigate).toHaveBeenCalledWith("/products", {
        state: {
          userData: {
            id: "f611a553-81e3-40ea-b988-b27f3689d2d5",
            supplierId: "Hellena S.A.",
            name: "Oranżada",
            type: "Żółta",
            capacity: "3L",
            unit: "op(8szt)",
            pricePerUnit: 44,
          },
        },
      });
    });
  });
});

describe("Deliveries", () => {
  it("DeliveriesAddWorkingProperly", async () => {
    const mocks = [
      {
        request: {
          query: ADD_DELIVERY,
          variables: {
            supplierId: "Hellena S.A.",
            expectedDate: "2023-12-24",
            products:
              '[{"id":0,"product":"Oranżada Czerwona 1.5L","unit":"op(6szt)","quantity":"100"},{"id":1,"product":"Oranżada Żółta 2L","unit":"op(8szt)","quantity":"110"}]',
            totalPrice: 9618.6,
          },
        },
        result: {
          data: {
            createDelivery: {
              id: "7c27511f-96d6-4542-bce5-9ec07c965979",
              supplierId: "Hellena S.A.",
              date: "",
              expectedDate: "2023-12-24",
              products:
                '[{"id":0,"product":"Oranżada Czerwona 1.5L","unit":"op(6szt)","quantity":"100"},{"id":1,"product":"Oranżada Żółta 2L","unit":"op(8szt)","quantity":"110"}]',
              state: "Zamówiono",
              totalPrice: 9618.6,
            },
          },
        },
      },
      {
        request: {
          query: GET_PRODUCTS_SUPPLIERS,
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
    ];
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DeliveriesAddPage />
      </MockedProvider>
    );

    const input1 = await screen.findByPlaceholderText("Wybierz Dostawcę");
    const input2 = await screen.findByPlaceholderText("date");

    fireEvent.change(input1, { target: { value: "Hellena S.A." } });
    fireEvent.change(input2, {
      target: { value: "2023-12-24" },
    });

    const addBtn = await screen.findByTestId("addBtn");
    fireEvent.click(addBtn);

    const productSelect = await screen.findAllByPlaceholderText(
      "Wybierz produkt"
    );
    fireEvent.change(productSelect[0], {
      target: { value: "Oranżada Czerwona 1.5L" },
    });
    fireEvent.change(productSelect[1], {
      target: { value: "Oranżada Żółta 2L" },
    });

    const unitSelect = await screen.findAllByPlaceholderText(
      "Wybierz jednostkę"
    );
    fireEvent.change(unitSelect[0], { target: { value: "op(6szt)" } });
    fireEvent.change(unitSelect[1], { target: { value: "op(8szt)" } });

    const quantityInput = await screen.findAllByPlaceholderText("Ilość");
    fireEvent.change(quantityInput[0], { target: { value: 100 } });
    fireEvent.change(quantityInput[1], { target: { value: 110 } });

    const submitBtn = await screen.findByTestId("SubmitBtn");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUseNavigate).toHaveBeenCalledWith("/deliveries", {
        state: {
          userData: true,
        },
      });
    });
  });
});

describe("Orders", () => {
  it("OrdersAddWorkingProperly", async () => {
    const mocks = [
      {
        request: {
          query: ADD_ORDER,
          variables: {
            clientId: "JanTexx",
            expectedDate: "2023-12-24",
            products:
              '[{"id":0,"product":"Oranżada Czerwona 1.5L","unit":"op(6szt)","quantity":"100"},{"id":1,"product":"Oranżada Żółta 2L","unit":"op(8szt)","quantity":"110"}]',
            totalPrice: 13466.04,
          },
        },
        result: {
          data: {
            createOrder: {
              id: "7c27511f-96d6-4542-bce5-9ec07c965979",
              date: "",
              state: "Zamówiono",
              clientId: "JanTexx",
              expectedDate: "2023-12-24",
              products:
                '[{"id":0,"product":"Oranżada Czerwona 1.5L","unit":"op(6szt)","quantity":"100"},{"id":1,"product":"Oranżada Żółta 2L","unit":"op(8szt)","quantity":"110"}]',
              totalPrice: 13466.04,
            },
          },
        },
      },
      {
        request: {
          query: GET_CLIENTS_STOCK_PRODUCTS,
        },
        result: {
          data: {
            clients: [
              {
                id: "6ff8ae18-011d-4271-9093-265cba3355e9",
                name: "JanTexx",
                phone: "111222333",
                email: "janTex@admin.pl",
                city: "Bydgoszcz",
                street: "Cichaa",
                number: "13",
                nip: "999999998",
              },
            ],
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
        <OrdersAddPage />
      </MockedProvider>
    );

    const input1 = await screen.findByPlaceholderText("Wybierz Klienta");
    const input2 = await screen.findByPlaceholderText("date");

    fireEvent.change(input1, { target: { value: "JanTexx" } });
    fireEvent.change(input2, {
      target: { value: "2023-12-24" },
    });

    const addBtn = await screen.findByTestId("addBtn");
    fireEvent.click(addBtn);

    const productSelect = await screen.findAllByPlaceholderText(
      "Wybierz produkt"
    );
    fireEvent.change(productSelect[0], {
      target: { value: "Oranżada Czerwona 1.5L" },
    });
    fireEvent.change(productSelect[1], {
      target: { value: "Oranżada Żółta 2L" },
    });

    const unitSelect = await screen.findAllByPlaceholderText(
      "Wybierz jednostkę"
    );
    fireEvent.change(unitSelect[0], { target: { value: "op(6szt)" } });
    fireEvent.change(unitSelect[1], { target: { value: "op(8szt)" } });

    const quantityInput = await screen.findAllByPlaceholderText("Ilość");
    fireEvent.change(quantityInput[0], { target: { value: 100 } });
    fireEvent.change(quantityInput[1], { target: { value: 110 } });

    const submitBtn = await screen.findByTestId("SubmitBtn");
    fireEvent.click(submitBtn);

    expect(mocks[0].request.variables).toEqual({
      clientId: "JanTexx",
      expectedDate: "2023-12-24",
      products:
        '[{"id":0,"product":"Oranżada Czerwona 1.5L","unit":"op(6szt)","quantity":"100"},{"id":1,"product":"Oranżada Żółta 2L","unit":"op(8szt)","quantity":"110"}]',
      totalPrice: 13466.04,
    });
  });
});
