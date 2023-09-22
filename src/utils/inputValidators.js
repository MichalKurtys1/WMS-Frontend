export const textValidator = (value) => {
  if (!value) {
    return "Proszę uzupełnić to pole.";
  }
  return undefined;
};

export const emailValidator = (value) => {
  if (!value) {
    return "Proszę podać email";
  }
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return "Nie jest to email";
  }
  return undefined;
};

export const selectValidator = (value) => {
  if (!value || value.includes("Wybierz")) {
    return "Proszę wybrać jedną z opcji";
  }
  return undefined;
};

export const phoneValidator = (value) => {
  if (!value) {
    return "Proszę podać numer telefonu";
  }
  const phoneNumberRegex = /^\+?[1-9][0-9]{8}$/;
  if (!phoneNumberRegex.test(value)) {
    return "Nie podano numeru telefonu";
  }
  return undefined;
};

export const passwordValidator = (value) => {
  if (!value || value.length < 8) {
    return "Hasło musi posiadać przynajmniej 8 znaków";
  }
  return undefined;
};
