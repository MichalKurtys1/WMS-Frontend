import { Outlet } from "react-router";
import Navigation from "./Navigation";
import style from "./RootLayout.module.css";

const RootLayout = () => {
  return (
    <>
      <Navigation />
      <div className={style.container}>
        <Outlet />
      </div>
    </>
  );
};

export default RootLayout;
