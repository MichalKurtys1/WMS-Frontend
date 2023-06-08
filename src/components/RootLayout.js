import { Outlet } from "react-router";
import Navigation from "./Navigation";

const RootLayout = () => {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
};

export default RootLayout;
