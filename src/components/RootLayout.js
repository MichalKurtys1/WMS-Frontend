import { Outlet } from "react-router";
import Navigation from "./Navigation";
import style from "./RootLayout.module.css";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

const RootLayout = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const toggleMenuHandler = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

  return (
    <>
      <Navigation
        menuIsOpen={menuIsOpen}
        toggleMenuHandler={toggleMenuHandler}
      />
      <div
        className={style.container}
        style={{
          width: isTablet && isPortrait ? "100%" : null,
          left: isTablet && isPortrait ? "0" : null,
        }}
      >
        <Outlet />
      </div>
    </>
  );
};

export default RootLayout;
