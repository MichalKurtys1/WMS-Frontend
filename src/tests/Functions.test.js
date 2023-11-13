import { pickProperties } from "../utils/objFormatting";
import {
  textValidator,
  emailValidator,
  selectValidator,
  phoneValidator,
  passwordValidator,
} from "../utils/inputValidators";
import { dateToInput, dateToPolish } from "../utils/dateFormatters";
import { encryptData, decryptData } from "../utils/dataEncryption";
import {
  checkToken,
  KsiPermissionCheck,
  AdmMenPermissionCheck,
  AdmMenKsiPermissionCheck,
  AdmMenKsiMagPermissionCheck,
  AdmMenKsiMagPrzPermissionCheck,
} from "../utils/auth";
import { getAuth } from "../context/index";
import { redirect } from "react-router";

jest.mock("react-router", () => ({
  redirect: jest.fn(),
}));

jest.mock("../context", () => ({
  getAuth: jest.fn(),
}));

describe("Utils - objFormatting", () => {
  test("CorrectData", () => {
    const inputObject = {
      name: "Jan",
      surname: "Kowalski",
      email: "test@test.pl",
    };
    const selectedProperties = ["name", "surname"];
    const expectedResult = {
      name: "Jan",
      surname: "Kowalski",
    };

    const result = pickProperties(inputObject, selectedProperties);
    expect(result).toEqual(expectedResult);
  });

  test("IncorrectData", () => {
    const inputObject = {
      name: "Jan",
      surname: "Kowalski",
      email: "test@test.pl",
    };
    const selectedProperties = ["age"];
    const expectedResult = {};

    const result = pickProperties(inputObject, selectedProperties);
    expect(result).toEqual(expectedResult);
  });

  test("EmptyData", () => {
    const inputObject = {};
    const selectedProperties = ["age"];
    const expectedResult = {};

    const result = pickProperties(inputObject, selectedProperties);
    expect(result).toEqual(expectedResult);
  });
});

describe("Utils - inputValidators", () => {
  test("CorrectInput", () => {
    expect(textValidator("Some value")).toBeUndefined();
    expect(emailValidator("valid@email.com")).toBeUndefined();
    expect(selectValidator("Valid Option")).toBeUndefined();
    expect(phoneValidator("123456789")).toBeUndefined();
    expect(passwordValidator("validPassword")).toBeUndefined();
  });
  test("IncorrectInput", () => {
    expect(textValidator("")).toBe("Proszę uzupełnić to pole.");
    expect(textValidator("Some value")).toBeUndefined();
    expect(emailValidator("invalidEmail")).toBe("Nie jest to email");
    expect(selectValidator("Wybierz coś")).toBe("Proszę wybrać jedną z opcji");
    expect(phoneValidator("12345678")).toBe("Nie podano numeru telefonu");
    expect(passwordValidator("short")).toBe(
      "Hasło musi posiadać przynajmniej 8 znaków"
    );
  });
  test("EmptyInput", () => {
    expect(textValidator("")).toBe("Proszę uzupełnić to pole.");
    expect(emailValidator("")).toBe("Proszę podać email");
    expect(selectValidator("")).toBe("Proszę wybrać jedną z opcji");
    expect(phoneValidator("")).toBe("Proszę podać numer telefonu");
    expect(passwordValidator("")).toBe(
      "Hasło musi posiadać przynajmniej 8 znaków"
    );
  });
});

describe("Utils - dateFormatters", () => {
  test("CorrectData", () => {
    const givenDate = 1630477200000;
    const expectedPolishDate = "1 września 2021";
    const expectedInputDate = "2021-09-01T06:20";

    const result1 = dateToPolish(givenDate);
    expect(result1).toBe(expectedPolishDate);

    const result2 = dateToInput(givenDate);
    expect(result2).toBe(expectedInputDate);
  });

  test("IncorrectData", () => {
    const givenDate = "string";
    const expectedPolishDate = "Błędna data";
    const expectedInputDate = "Błędna data";

    const result1 = dateToPolish(givenDate);
    expect(result1).toBe(expectedPolishDate);

    const result2 = dateToInput(givenDate);
    expect(result2).toBe(expectedInputDate);
  });

  test("EmptyData", () => {
    const expectedPolishDate = "Błędna data";
    const expectedInputDate = "Błędna data";

    const result1 = dateToPolish();
    expect(result1).toBe(expectedPolishDate);

    const result2 = dateToInput();
    expect(result2).toBe(expectedInputDate);
  });
});

describe("Utils - dataEncryption", () => {
  const testData = { message: "This is a secret message." };
  const storageName = "encryptedData";

  beforeAll(() => {
    process.env.REACT_APP_SECRET_KEY = "secretKey";
  });

  test("encryptingData", () => {
    encryptData(storageName, testData);
    const encryptedData = localStorage.getItem(storageName);
    expect(encryptedData).toBeDefined();
  });

  test("decryptingData", () => {
    const decryptedData = decryptData(storageName);
    expect(decryptedData).toEqual(testData);
  });
});

describe("Utils - auth", () => {
  const mockToken = "token123";
  const mockPositions = {
    Admin: "Admin",
    Manager: "Menadżer",
    Accountant: "Księgowy",
    WarehouseKeeper: "Magazynier",
    Carrier: "Przewoźnik",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Invalid", () => {
    test("checkToken", () => {
      getAuth.mockReturnValueOnce({ token: null });
      checkToken();
      expect(redirect).toHaveBeenCalledWith("/login");
    });

    test("KsiPermissionCheck", () => {
      getAuth.mockReturnValueOnce({ position: mockPositions.Accountant });
      KsiPermissionCheck();
      expect(redirect).toHaveBeenCalledWith("/");
    });

    test("AdmMenPermissionCheck", () => {
      getAuth.mockReturnValueOnce({ position: mockPositions.Accountant });
      AdmMenPermissionCheck();
      expect(redirect).toHaveBeenCalledWith("/");
    });

    test("AdmMenKsiPermissionCheck", () => {
      getAuth.mockReturnValueOnce({ position: mockPositions.WarehouseKeeper });
      AdmMenKsiPermissionCheck();
      expect(redirect).toHaveBeenCalledWith("/");
    });

    test("AdmMenKsiMagPermissionCheck", () => {
      getAuth.mockReturnValueOnce({ position: mockPositions.Carrier });
      AdmMenKsiMagPermissionCheck();
      expect(redirect).toHaveBeenCalledWith("/");
    });

    test("AdmMenKsiMagPrzPermissionCheck", () => {
      getAuth.mockReturnValueOnce({ position: null });
      AdmMenKsiMagPrzPermissionCheck();
      expect(redirect).toHaveBeenCalledWith("/");
    });
  });

  describe("Valid", () => {
    test("checkToken", () => {
      getAuth.mockReturnValueOnce({ token: mockToken });
      const result = checkToken();
      expect(result).toBe(true);
    });

    test("KsiPermissionCheck", () => {
      getAuth.mockReturnValueOnce({ position: mockPositions.Admin });
      const result = KsiPermissionCheck();
      expect(result).toBe(true);
    });

    test("AdmMenPermissionCheck", () => {
      getAuth.mockReturnValueOnce({ position: mockPositions.Admin });

      const result = AdmMenPermissionCheck();
      expect(result).toBe(true);
    });

    test("AdmMenKsiPermissionCheck", () => {
      getAuth.mockReturnValueOnce({ position: mockPositions.Admin });

      const result = AdmMenKsiPermissionCheck();
      expect(result).toBe(true);
    });

    test("AdmMenKsiMagPermissionCheck", () => {
      getAuth.mockReturnValueOnce({ position: mockPositions.Admin });

      const result = AdmMenKsiMagPermissionCheck();
      expect(result).toBe(true);
    });

    test("AdmMenKsiMagPrzPermissionCheck", () => {
      getAuth.mockReturnValueOnce({ position: mockPositions.Admin });

      const result = AdmMenKsiMagPrzPermissionCheck();
      expect(result).toBe(true);
    });
  });
});
