import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

export const encryptData = (name, data) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();
  localStorage.setItem(name, encrypted);
};

export const decryptData = (name) => {
  const encrypted = localStorage.getItem(name);
  if (encrypted) {
    const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(
      CryptoJS.enc.Utf8
    );
    return JSON.parse(decrypted);
  }
  return null;
};
