import { redirect } from "react-router";
import { getAuth } from "../context";

export function checkToken() {
  const { token } = getAuth();

  if (token) {
    return token;
  } else {
    return redirect("/login");
  }
}

export function KsiPermissionCheck() {
  const { position } = getAuth();
  if (position === "Księgowy") {
    return redirect("/");
  }
  return position;
}

export function AdmMenPermissionCheck() {
  const { position } = getAuth();
  if (position === "Admin" || position === "Menadżer") {
    return position;
  }
  return redirect("/");
}

export function AdmMenKsiPermissionCheck() {
  const { position } = getAuth();
  if (
    position === "Admin" ||
    position === "Menadżer" ||
    position === "Księgowy"
  ) {
    return position;
  }
  return redirect("/");
}

export function AdmMenKsiMagPermissionCheck() {
  const { position } = getAuth();
  if (
    position === "Admin" ||
    position === "Menadżer" ||
    position === "Księgowy" ||
    position === "Magazynier"
  ) {
    return position;
  }
  return redirect("/");
}

export function AdmMenKsiMagPrzPermissionCheck() {
  const { position } = getAuth();
  if (
    position === "Admin" ||
    position === "Menadżer" ||
    position === "Księgowy" ||
    position === "Magazynier" ||
    position === "Przewoźnik"
  ) {
    return position;
  }
  return redirect("/");
}
