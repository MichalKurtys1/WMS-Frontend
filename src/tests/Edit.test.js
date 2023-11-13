import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import {
  GET_CLIENT,
  GET_DELIVERY,
  GET_EMPLOYEE,
  GET_ORDER,
  GET_PRODUCT,
  GET_SUPPLIER,
  LOGIN,
  UPDATE_CLIENT,
  UPDATE_DELIVERY,
  UPDATE_EMPLOYEE,
  UPDATE_ORDER,
  UPDATE_PRODUCT,
  UPDATE_SUPPLIER,
} from "../utils/apollo/apolloMutations";
import ClientsEditPage from "../pages/clients/ClientsEditPage";
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import EmployeeEditPage from "../pages/employee/EmployeeEditPage";
import SuppliersEditPage from "../pages/suppliers/SuppliersEditPage";
import { GET_SUPPLIERS } from "../utils/apollo/apolloQueries";
import ProductEditPage from "../pages/products/ProductEditPage";
import LoginForm from "../pages/auth/LoginForm";
import { useDispatch } from "react-redux";
import OrdersEditPage from "../pages/orders/OrdersEditPage";
import {
  GET_CLIENTS_STOCK_PRODUCTS,
  GET_PRODUCTS_SUPPLIERS,
} from "../utils/apollo/apolloMultipleQueries";
import DeliveriesEditPage from "../pages/deliveries/DeliveriesEditPage";

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");

  return {
    ...originalModule,
    useLocation: jest.fn(),
    useNavigate: jest.fn(),
  };
});

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => jest.fn(),
}));

jest.mock("react-redux", () => {
  const originalModule = jest.requireActual("react-redux");

  return {
    ...originalModule,
    useDispatch: jest.fn(),
  };
});

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

describe("Clients", () => {
  it("ClientsEditWorkingProperly", async () => {
    const mockLocation = {
      state: {
        clientId: "a30495aa-db43-4c25-a604-948d044892a9",
      },
    };

    const mockUseNavigate = jest.fn();
    useLocation.mockReturnValue(mockLocation);
    useNavigate.mockReturnValue(mockUseNavigate);

    const mocks = [
      {
        request: {
          query: GET_CLIENT,
          variables: {
            getClientId: "a30495aa-db43-4c25-a604-948d044892a9",
          },
        },
        result: {
          data: {
            getClient: {
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
      {
        request: {
          query: UPDATE_CLIENT,
          variables: {
            updateClientId: "a30495aa-db43-4c25-a604-948d044892a9",
            name: "TexJan",
            email: "texjan@test.pl",
            phone: "222222222",
            city: "Gdańsk",
            street: "Głośna",
            number: "16",
            nip: "654321",
          },
        },
        result: {
          data: {
            updateClient: {
              id: "a30495aa-db43-4c25-a604-948d044892a9",
              name: "TexJan",
              email: "texjan@test.pl",
              phone: "222222222",
              city: "Gdańsk",
              street: "Głośna",
              number: "16",
              nip: "654321",
            },
          },
        },
      },
    ];

    render(
      <Router>
        <MockedProvider mocks={mocks} addTypename={false}>
          <ClientsEditPage />
        </MockedProvider>
      </Router>
    );

    const input1 = await screen.findByPlaceholderText("Nazwa *");
    await waitFor(() => expect(input1).toHaveValue("Jan"));

    const input2 = await screen.findByPlaceholderText("Numer telefonu *");
    await waitFor(() => expect(input2).toHaveValue("111111111"));

    const input3 = await screen.findByPlaceholderText("Adres e-mail *");
    await waitFor(() => expect(input3).toHaveValue("jan@test.pl"));

    const input4 = await screen.findByPlaceholderText("Miejscowość *");
    await waitFor(() => expect(input4).toHaveValue("Bydgoszcz"));

    const input5 = await screen.findByPlaceholderText("Ulica *");
    await waitFor(() => expect(input5).toHaveValue("Cicha"));

    const input6 = await screen.findByPlaceholderText("Numer *");
    await waitFor(() => expect(input6).toHaveValue(13));

    const input7 = await screen.findByPlaceholderText("NIP");
    await waitFor(() => expect(input7).toHaveValue("123456"));

    fireEvent.change(input1, { target: { value: "TexJan" } });
    fireEvent.change(input2, { target: { value: "222222222" } });
    fireEvent.change(input3, { target: { value: "texjan@test.pl" } });
    fireEvent.change(input4, { target: { value: "Gdańsk" } });
    fireEvent.change(input5, { target: { value: "Głośna" } });
    fireEvent.change(input6, { target: { value: "16" } });
    fireEvent.change(input7, { target: { value: "654321" } });

    const submitBtn = await screen.findByTestId("SubmitBtn");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUseNavigate).toHaveBeenCalledWith("/clients", {
        state: {
          update: true,
        },
      });
    });
  });
});

describe("Employee", () => {
  it("EmployeeEditWorkingProperly", async () => {
    const mockLocation = {
      state: {
        userId: "a30495aa-db43-4c25-a604-948d044892a9",
      },
    };

    const mockUseNavigate = jest.fn();
    useLocation.mockReturnValue(mockLocation);
    useNavigate.mockReturnValue(mockUseNavigate);

    const mocks = [
      {
        request: {
          query: GET_EMPLOYEE,
          variables: {
            getUserId: "a30495aa-db43-4c25-a604-948d044892a9",
          },
        },
        result: {
          data: {
            getUser: {
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
      {
        request: {
          query: UPDATE_EMPLOYEE,
          variables: {
            updateUserId: "a30495aa-db43-4c25-a604-948d044892a9",
            firstname: "Andrzej",
            lastname: "Nowak",
            email: "andrzej@test.pl",
            phone: "111111111",
            position: "Magazynier",
            adres: "ul. Cicha 13 Bydgoszcz",
          },
        },
        result: {
          data: {
            updateUser: {
              id: "a30495aa-db43-4c25-a604-948d044892a9",
              firstname: "Andrzej",
              lastname: "Nowak",
              email: "andrzej@test.pl",
              phone: "111111111",
              position: "Magazynier",
              adres: "ul. Cicha 13 Bydgoszcz",
            },
          },
        },
      },
    ];

    render(
      <Router>
        <MockedProvider mocks={mocks} addTypename={false}>
          <EmployeeEditPage />
        </MockedProvider>
      </Router>
    );

    const input1 = await screen.findByPlaceholderText("Imię");
    await waitFor(() => expect(input1).toHaveValue("Jan"));

    const input2 = await screen.findByPlaceholderText("Nazwisko");
    await waitFor(() => expect(input2).toHaveValue("Kowalski"));

    const input3 = await screen.findByPlaceholderText("Adres e-mail");
    await waitFor(() => expect(input3).toHaveValue("jan@test.pl"));

    const input4 = await screen.findByPlaceholderText("Numer telefonu");
    await waitFor(() => expect(input4).toHaveValue(111111111));

    const input5 = await screen.findByPlaceholderText("Adres zamieszkania");
    await waitFor(() => expect(input5).toHaveValue("ul. Cicha 13 Bydgoszcz"));

    const input6 = await screen.findByPlaceholderText("Wybierz Stanowisko");
    await waitFor(() => expect(input6).toHaveValue("Magazynier"));

    fireEvent.change(input1, { target: { value: "Andrzej" } });
    fireEvent.change(input2, { target: { value: "Nowak" } });
    fireEvent.change(input3, { target: { value: "andrzej@test.pl" } });
    fireEvent.change(input4, { target: { value: "111111111" } });
    fireEvent.change(input5, { target: { value: "ul. Cicha 13 Bydgoszcz" } });
    fireEvent.change(input6, { target: { value: "Magazynier" } });

    const submitBtn = await screen.findByTestId("SubmitBtn");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUseNavigate).toHaveBeenCalledWith("/employees", {
        state: {
          update: true,
        },
      });
    });
  });
});

describe("Suppliers", () => {
  it("SuppliersEditWorkingProperly", async () => {
    const mockLocation = {
      state: {
        supplierId: "a30495aa-db43-4c25-a604-948d044892a9",
      },
    };

    const mockUseNavigate = jest.fn();
    useLocation.mockReturnValue(mockLocation);
    useNavigate.mockReturnValue(mockUseNavigate);

    const mocks = [
      {
        request: {
          query: GET_SUPPLIER,
          variables: {
            getSupplierId: "a30495aa-db43-4c25-a604-948d044892a9",
          },
        },
        result: {
          data: {
            getSupplier: {
              id: "a30495aa-db43-4c25-a604-948d044892a9",
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
          },
        },
      },
      {
        request: {
          query: UPDATE_SUPPLIER,
          variables: {
            updateSupplierId: "a30495aa-db43-4c25-a604-948d044892a9",
            name: "Hellena Inc.",
            email: "hellena.marketing@wp.pl",
            phone: "111222333",
            city: "Gdańsk",
            street: "Głośna",
            number: "16",
            bank: "PKO Bank Polski O/Bydgoszcz",
            accountNumber: "11 2222 3333 4444 5555 6666",
            nip: "654321",
          },
        },
        result: {
          data: {
            updateSupplier: {
              id: "a30495aa-db43-4c25-a604-948d044892a9",
              name: "Hellena Inc.",
              email: "hellena.marketing@wp.pl",
              phone: "111222333",
              city: "Gdańsk",
              street: "Głośna",
              number: "16",
              bank: "PKO Bank Polski O/Bydgoszcz",
              accountNumber: "11 2222 3333 4444 5555 6666",
              nip: "654321",
            },
          },
        },
      },
    ];

    render(
      <Router>
        <MockedProvider mocks={mocks} addTypename={false}>
          <SuppliersEditPage />
        </MockedProvider>
      </Router>
    );

    const input1 = await screen.findByPlaceholderText("Nazwa *");
    await waitFor(() => expect(input1).toHaveValue("Hellena S.A."));

    const input2 = await screen.findByPlaceholderText("Numer telefonu *");
    await waitFor(() => expect(input2).toHaveValue("111222333"));

    const input3 = await screen.findByPlaceholderText("Adres e-mail *");
    await waitFor(() => expect(input3).toHaveValue("hellena@admin.pl"));

    const input4 = await screen.findByPlaceholderText("Miejscowość *");
    await waitFor(() => expect(input4).toHaveValue("Bydgoszcz"));

    const input5 = await screen.findByPlaceholderText("Ulica *");
    await waitFor(() => expect(input5).toHaveValue("Leśna"));

    const input6 = await screen.findByPlaceholderText("Numer *");
    await waitFor(() => expect(input6).toHaveValue(60));

    const input7 = await screen.findByPlaceholderText("NIP");
    await waitFor(() => expect(input7).toHaveValue("12345678989"));

    const input8 = await screen.findByPlaceholderText("Nazwa banku");
    await waitFor(() =>
      expect(input8).toHaveValue("PKO Bank Polski O/Bydgoszcz")
    );

    const input9 = await screen.findByPlaceholderText("Numer konta");
    await waitFor(() =>
      expect(input9).toHaveValue("11 2222 3333 4444 5555 6666")
    );

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
          update: true,
        },
      });
    });
  });
});

describe("Products", () => {
  it("ProductsEditWorkingProperly", async () => {
    const mockLocation = {
      state: {
        userId: "a30495aa-db43-4c25-a604-948d044892a9",
      },
    };

    const mockUseNavigate = jest.fn();
    useLocation.mockReturnValue(mockLocation);
    useNavigate.mockReturnValue(mockUseNavigate);

    const mocks = [
      {
        request: {
          query: GET_PRODUCT,
          variables: {
            getProductId: "a30495aa-db43-4c25-a604-948d044892a9",
          },
        },
        result: {
          data: {
            getProduct: {
              id: "a30495aa-db43-4c25-a604-948d044892a9",
              supplierId: "f611a553-81e3-40ea-b988-b27f3689d2d5",
              name: "Oranżada",
              type: "Żółta",
              capacity: "2L",
              unit: "op(8szt)",
              pricePerUnit: 42,
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
            ],
          },
        },
      },
      {
        request: {
          query: UPDATE_PRODUCT,
          variables: {
            updateProductId: "a30495aa-db43-4c25-a604-948d044892a9",
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
            updateProduct: {
              id: "a30495aa-db43-4c25-a604-948d044892a9",
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
    ];

    render(
      <Router>
        <MockedProvider mocks={mocks} addTypename={false}>
          <ProductEditPage />
        </MockedProvider>
      </Router>
    );

    const input1 = await screen.findByPlaceholderText("Wybierz Dostawcę");
    await waitFor(() => expect(input1).toHaveValue("Hellena S.A."));

    const input2 = await screen.findByPlaceholderText("Nazwa");
    await waitFor(() => expect(input2).toHaveValue("Oranżada"));

    const input3 = await screen.findByPlaceholderText("Typ");
    await waitFor(() => expect(input3).toHaveValue("Żółta"));

    const input4 = await screen.findByPlaceholderText("Pojemność");
    await waitFor(() => expect(input4).toHaveValue("2L"));

    const input5 = await screen.findByPlaceholderText("Cena za jednostkę");
    await waitFor(() => expect(input5).toHaveValue(42));

    const input6 = await screen.findByPlaceholderText("Wybierz Jednostkę");
    await waitFor(() => expect(input6).toHaveValue("op(8szt)"));

    fireEvent.change(input4, { target: { value: "3L" } });
    fireEvent.change(input5, {
      target: { value: 44 },
    });

    const submitBtn = await screen.findByTestId("SubmitBtn");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUseNavigate).toHaveBeenCalledWith("/products", {
        state: {
          update: true,
        },
      });
    });
  });
});

describe("Auth", () => {
  it("LoginWorkingProperly", async () => {
    const mocks = [
      {
        request: {
          query: LOGIN,
          variables: { email: "test@test.com", password: "12345678" },
        },
        result: {
          data: {
            login: {
              token: "token",
              expiresIn: 3600,
              firstname: "Jan",
              lastname: "Kowalski",
              position: "Admin",
              firstLogin: false,
            },
          },
        },
      },
    ];

    const mockUseNavigate = jest.fn();
    const mockUseDispatch = jest.fn();
    useDispatch.mockReturnValue(mockUseDispatch);
    useNavigate.mockReturnValue(mockUseNavigate);

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LoginForm />
      </MockedProvider>
    );

    fireEvent.change(await screen.findByPlaceholderText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(await screen.findByPlaceholderText("Hasło"), {
      target: { value: "12345678" },
    });

    fireEvent.submit(await screen.findByText("Zaloguj"));

    await waitFor(() => {
      expect(mockUseNavigate).toHaveBeenCalledWith("/", { replace: true });
    });
    await waitFor(() => {
      expect(mockUseDispatch).toHaveBeenCalledWith({
        payload: {
          expiresIn: 3600,
          name: "Jan Kowalski",
          position: "Admin",
          token: "token",
        },
        type: "authentication/logIn",
      });
    });
  });
});

describe("Orders", () => {
  it("OrdersEditWorkingProperly", async () => {
    const mockLocation = {
      state: {
        orderId: "a30495aa-db43-4c25-a604-948d044892a9",
      },
    };

    const mockUseNavigate = jest.fn();
    useLocation.mockReturnValue(mockLocation);
    useNavigate.mockReturnValue(mockUseNavigate);

    const mocks = [
      {
        request: {
          query: GET_ORDER,
          variables: {
            getOrderId: "a30495aa-db43-4c25-a604-948d044892a9",
          },
        },
        result: {
          data: {
            getOrder: {
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
                '"[{\\"id\\":0,\\"product\\":\\"Oranżada Czerwona 1.5L\\",\\"unit\\":\\"op(6szt)\\",\\"quantity\\":\\"10\\"},{\\"id\\":1,\\"product\\":\\"Oranżada Żółta 2L\\",\\"unit\\":\\"op(8szt)\\",\\"quantity\\":\\"15\\"}]"',
              state: "Zakończono",
              transportType: "shipment",
              totalPrice: 1635.9,
            },
          },
        },
      },
      {
        request: {
          query: UPDATE_ORDER,
          variables: {
            updateOrderId: "a30495aa-db43-4c25-a604-948d044892a9",
            clientId: "JanTexx",
            expectedDate: "2023-12-24",
            products:
              '[{"id":0,"product":"Oranżada Czerwona 1.5L","unit":"op(6szt)","quantity":"90"},{"id":1,"product":"Oranżada Żółta 2L","unit":"op(8szt)","quantity":"140"}]',
            totalPrice: 13466.04,
          },
        },
        result: {
          data: {
            updateOrder: {
              id: "a30495aa-db43-4c25-a604-948d044892a9",
              date: "",
              state: "Zamówiono",
              clientId: "JanTexx",
              expectedDate: "2023-12-24",
              products:
                '[{"id":0,"product":"Oranżada Czerwona 1.5L","unit":"op(6szt)","quantity":"90"},{"id":1,"product":"Oranżada Żółta 2L","unit":"op(8szt)","quantity":"140"}]',
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
        <OrdersEditPage />
      </MockedProvider>
    );

    const quantityInput = await screen.findAllByPlaceholderText("Ilość");
    fireEvent.change(quantityInput[0], { target: { value: 90 } });
    fireEvent.change(quantityInput[1], { target: { value: 140 } });

    const submitBtn = await screen.findByTestId("SubmitBtn");
    fireEvent.click(submitBtn);

    expect(mocks[1].request.variables).toEqual({
      updateOrderId: "a30495aa-db43-4c25-a604-948d044892a9",
      clientId: "JanTexx",
      expectedDate: "2023-12-24",
      products:
        '[{"id":0,"product":"Oranżada Czerwona 1.5L","unit":"op(6szt)","quantity":"90"},{"id":1,"product":"Oranżada Żółta 2L","unit":"op(8szt)","quantity":"140"}]',
      totalPrice: 13466.04,
    });
  });
});

describe("Deliveries", () => {
  it("DeliveriesEditWorkingProperly", async () => {
    const mockLocation = {
      state: {
        deliveryId: "a30495aa-db43-4c25-a604-948d044892a9",
      },
    };

    const mockUseNavigate = jest.fn();
    useLocation.mockReturnValue(mockLocation);
    useNavigate.mockReturnValue(mockUseNavigate);

    const mocks = [
      {
        request: {
          query: GET_DELIVERY,
          variables: {
            getDeliveryId: "a30495aa-db43-4c25-a604-948d044892a9",
          },
        },
        result: {
          data: {
            getDelivery: {
              id: "a30495aa-db43-4c25-a604-948d044892a9",
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
                '"[{\\"id\\":0,\\"product\\":\\"Oranżada Czerwona 1.5L\\",\\"unit\\":\\"op(6szt)\\",\\"quantity\\":\\"100\\",\\"delivered\\":\\"100\\",\\"damaged\\":\\"5\\"},{\\"id\\":1,\\"product\\":\\"Oranżada Żółta 2L\\",\\"unit\\":\\"op(8szt)\\",\\"quantity\\":\\"100\\",\\"delivered\\":\\"100\\",\\"damaged\\":\\"0\\"}]"',
              state: "Rozlokowano",
              totalPrice: 9102,
            },
          },
        },
      },
      {
        request: {
          query: UPDATE_DELIVERY,
          variables: {
            updateDeliveryId: "a30495aa-db43-4c25-a604-948d044892a9",
            supplierId: "JanTexx",
            expectedDate: "2023-12-24",
            products:
              '[{"id":0,"product":"Oranżada Czerwona 1.5L","unit":"op(6szt)","quantity":"90"},{"id":1,"product":"Oranżada Żółta 2L","unit":"op(8szt)","quantity":"140"}]',
            totalPrice: 13466.04,
          },
        },
        result: {
          data: {
            updateDelivery: {
              id: "a30495aa-db43-4c25-a604-948d044892a9",
              date: "",
              state: "Zamówiono",
              supplierId: "JanTexx",
              expectedDate: "2023-12-24",
              products:
                '[{"id":0,"product":"Oranżada Czerwona 1.5L","unit":"op(6szt)","quantity":"90"},{"id":1,"product":"Oranżada Żółta 2L","unit":"op(8szt)","quantity":"140"}]',
              totalPrice: 13466.04,
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
        <DeliveriesEditPage />
      </MockedProvider>
    );

    const quantityInput = await screen.findAllByPlaceholderText("Ilość");
    fireEvent.change(quantityInput[0], { target: { value: 90 } });
    fireEvent.change(quantityInput[1], { target: { value: 140 } });

    const submitBtn = await screen.findByTestId("SubmitBtn");
    fireEvent.click(submitBtn);

    expect(mocks[1].request.variables).toEqual({
      updateDeliveryId: "a30495aa-db43-4c25-a604-948d044892a9",
      supplierId: "JanTexx",
      expectedDate: "2023-12-24",
      products:
        '[{"id":0,"product":"Oranżada Czerwona 1.5L","unit":"op(6szt)","quantity":"90"},{"id":1,"product":"Oranżada Żółta 2L","unit":"op(8szt)","quantity":"140"}]',
      totalPrice: 13466.04,
    });
  });
});
