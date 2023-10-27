import { useNavigate } from "react-router";
import style from "./Navigation.module.css";
import {
  BsPeopleFill,
  BsGridFill,
  BsFillFileEarmarkTextFill,
  BsBarChartLineFill,
  BsFillFileEarmarkArrowDownFill,
  BsFillFileEarmarkArrowUpFill,
  BsX,
} from "react-icons/bs";
import {
  FaCalendarAlt,
  FaBoxes,
  FaTruck,
  FaUserCircle,
  FaPowerOff,
  FaBars,
} from "react-icons/fa";
import NavigationLink from "./NavigationLink";
import NavigationLinkGroup from "./NavigationLinkGroup";
import { useDispatch } from "react-redux";
import { authActions } from "../context/auth";
import { useState } from "react";
import { useEffect } from "react";
import { getAuth } from "../context/index";
import { useMediaQuery } from "react-responsive";

const Navigation = ({ toggleMenuHandler, menuIsOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [nameValue, setNameValue] = useState("");
  const [positionValue, setPositionValue] = useState("");
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

  useEffect(() => {
    const { name, position } = getAuth();
    setNameValue(name);
    setPositionValue(position);
  }, []);

  const logoutHandler = () => {
    dispatch(authActions.logOut());
    navigate("/login");
  };

  return (
    <>
      {(!isTablet || !isPortrait) && (
        <div className={style.container}>
          {nameValue !== "" && positionValue !== "" && (
            <div className={style.menu}>
              <div className={style.upperBox}>
                <div className={style.userPanel}>
                  <FaUserCircle className={style.userIcon} />
                  <h4>{nameValue}</h4>
                  <div className={style.powerOff}>
                    <FaPowerOff
                      className={style.powerOffIcon}
                      onClick={logoutHandler}
                    />
                  </div>
                </div>
              </div>
              <div className={style.lowerBox}>
                <NavigationLink
                  path={"/"}
                  title={"Dashboard"}
                  main={true}
                  icon={<BsGridFill className={style.iconS} />}
                />
                <NavigationLink
                  path={"/calendar"}
                  title={"Kalendarz"}
                  icon={<FaCalendarAlt className={style.iconS} />}
                />
                {(positionValue === "Admin" ||
                  positionValue === "Menadżer" ||
                  positionValue === "Księgowy") && (
                  <NavigationLinkGroup
                    title={"Spis osobowy"}
                    icon={<BsPeopleFill className={style.iconS} />}
                    links={[
                      { title: "Pracownicy", link: "/employees" },
                      { title: "Klienci", link: "/clients" },
                      { title: "Dostawcy", link: "/suppliers" },
                    ]}
                  />
                )}
                {(positionValue === "Admin" ||
                  positionValue === "Menadżer" ||
                  positionValue === "Księgowy" ||
                  positionValue === "Magazynier") && (
                  <NavigationLinkGroup
                    title={"Magazyn"}
                    icon={<FaBoxes className={style.iconS} />}
                    links={[
                      { title: "Lista produktów", link: "/products" },
                      { title: "Spis towarów", link: "/stock" },
                    ]}
                  />
                )}
                {(positionValue === "Admin" ||
                  positionValue === "Menadżer" ||
                  positionValue === "Księgowy" ||
                  positionValue === "Magazynier") && (
                  <NavigationLink
                    path={"/deliveries"}
                    title={"Dostawy"}
                    icon={
                      <BsFillFileEarmarkArrowUpFill className={style.iconS} />
                    }
                  />
                )}
                {(positionValue === "Admin" ||
                  positionValue === "Menadżer" ||
                  positionValue === "Księgowy" ||
                  positionValue === "Magazynier") && (
                  <NavigationLink
                    path={"/orders"}
                    title={"Zamówienia"}
                    icon={
                      <BsFillFileEarmarkArrowDownFill className={style.iconS} />
                    }
                  />
                )}
                {(positionValue === "Admin" ||
                  positionValue === "Menadżer" ||
                  positionValue === "Księgowy" ||
                  positionValue === "Przewoźnik" ||
                  positionValue === "Magazynier") && (
                  <NavigationLink
                    path={"/shipping"}
                    title={"Wysyłki"}
                    icon={<FaTruck className={style.iconS} />}
                  />
                )}
                {(positionValue === "Admin" ||
                  positionValue === "Menadżer" ||
                  positionValue === "Księgowy") && (
                  <NavigationLink
                    path={"/documents"}
                    title={"Dokumenty"}
                    icon={<BsFillFileEarmarkTextFill className={style.iconS} />}
                  />
                )}
                {(positionValue === "Admin" ||
                  positionValue === "Menadżer") && (
                  <NavigationLink
                    path={"/raports"}
                    title={"Raporty"}
                    icon={<BsBarChartLineFill className={style.iconS} />}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {isPortrait && isTablet && (
        <>
          <div className={style.barsContainer}>
            {menuIsOpen && (
              <BsX className={style.xIcon} onClick={toggleMenuHandler} />
            )}
            {!menuIsOpen && (
              <FaBars className={style.barsIcon} onClick={toggleMenuHandler} />
            )}
          </div>
          {menuIsOpen && (
            <>
              <div
                className={style.container}
                style={{
                  backgroundColor: menuIsOpen ? "#f5f5f5" : "transparent",
                  boxShadow: menuIsOpen ? null : "none",
                  pointerEvents: menuIsOpen ? null : "none",
                }}
              >
                {nameValue !== "" && positionValue !== "" && (
                  <div className={style.menu}>
                    <div className={style.upperBox}>
                      <div className={style.userPanel}>
                        <FaUserCircle className={style.userIcon} />
                        <h4>{nameValue}</h4>
                        <div className={style.powerOff}>
                          <FaPowerOff
                            className={style.powerOffIcon}
                            onClick={logoutHandler}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={style.lowerBox}>
                      <NavigationLink
                        path={"/"}
                        title={"Dashboard"}
                        main={true}
                        icon={<BsGridFill className={style.iconS} />}
                      />
                      <NavigationLink
                        path={"/calendar"}
                        title={"Kalendarz"}
                        icon={<FaCalendarAlt className={style.iconS} />}
                      />
                      {(positionValue === "Admin" ||
                        positionValue === "Menadżer" ||
                        positionValue === "Księgowy") && (
                        <NavigationLinkGroup
                          title={"Spis osobowy"}
                          icon={<BsPeopleFill className={style.iconS} />}
                          links={[
                            { title: "Pracownicy", link: "/employees" },
                            { title: "Klienci", link: "/clients" },
                            { title: "Dostawcy", link: "/suppliers" },
                          ]}
                        />
                      )}
                      {(positionValue === "Admin" ||
                        positionValue === "Menadżer" ||
                        positionValue === "Księgowy" ||
                        positionValue === "Magazynier") && (
                        <NavigationLinkGroup
                          title={"Magazyn"}
                          icon={<FaBoxes className={style.iconS} />}
                          links={[
                            { title: "Lista produktów", link: "/products" },
                            { title: "Spis towarów", link: "/stock" },
                          ]}
                        />
                      )}
                      {(positionValue === "Admin" ||
                        positionValue === "Menadżer" ||
                        positionValue === "Księgowy" ||
                        positionValue === "Magazynier") && (
                        <NavigationLink
                          path={"/deliveries"}
                          title={"Dostawy"}
                          icon={
                            <BsFillFileEarmarkArrowUpFill
                              className={style.iconS}
                            />
                          }
                        />
                      )}
                      {(positionValue === "Admin" ||
                        positionValue === "Menadżer" ||
                        positionValue === "Księgowy" ||
                        positionValue === "Magazynier") && (
                        <NavigationLink
                          path={"/orders"}
                          title={"Zamówienia"}
                          icon={
                            <BsFillFileEarmarkArrowDownFill
                              className={style.iconS}
                            />
                          }
                        />
                      )}
                      {(positionValue === "Admin" ||
                        positionValue === "Menadżer" ||
                        positionValue === "Księgowy" ||
                        positionValue === "Przewoźnik" ||
                        positionValue === "Magazynier") && (
                        <NavigationLink
                          path={"/shipping"}
                          title={"Wysyłki"}
                          icon={<FaTruck className={style.iconS} />}
                        />
                      )}
                      {(positionValue === "Admin" ||
                        positionValue === "Menadżer" ||
                        positionValue === "Księgowy") && (
                        <NavigationLink
                          path={"/documents"}
                          title={"Dokumenty"}
                          icon={
                            <BsFillFileEarmarkTextFill
                              className={style.iconS}
                            />
                          }
                        />
                      )}
                      {(positionValue === "Admin" ||
                        positionValue === "Menadżer") && (
                        <NavigationLink
                          path={"/raports"}
                          title={"Raporty"}
                          icon={<BsBarChartLineFill className={style.iconS} />}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className={style.backdrop} onClick={toggleMenuHandler}></div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Navigation;
