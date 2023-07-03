import { redirect } from "react-router";

export function checkToken() {
  const token = localStorage.getItem("token");

  if (token) {
    return token;
  } else {
    return redirect("/");
  }
}
