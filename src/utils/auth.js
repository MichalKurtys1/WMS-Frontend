import { redirect } from "react-router";
import { getAuth } from "../context";

export function checkToken() {
  const { token } = getAuth();

  if (token) {
    return true;
  } else {
    return redirect("/login");
  }
}

export function KsiPermissionCheck() {
  const { position } = getAuth();
  if (position === "Księgowy") {
    return redirect("/");
  }
  return true;
}

export function AdmMenPermissionCheck() {
  const { position } = getAuth();
  if (position === "Admin" || position === "Menadżer") {
    return true;
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
    return true;
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
    return true;
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
    return true;
  }
  return redirect("/");
}
