import { useLocation } from "react-router";
import style from "./Navigation.module.css";
import {
  BsPeopleFill,
  BsGridFill,
  BsFillFileEarmarkTextFill,
  BsBarChartLineFill,
  BsFillFileEarmarkArrowDownFill,
  BsFillFileEarmarkArrowUpFill,
  BsGearFill,
} from "react-icons/bs";
import { FaCalendarAlt, FaEnvelope, FaUser, FaBoxes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  return (
    <div className={style.container}>
      <div className={style.menuContainer}>
        <div className={style.menu}>
          <div className={style.upperBox}>
            <Link to={"/main/profile"} style={{ textDecoration: "none" }}>
              <div
                className={style.linkBox}
                style={{
                  color: `${
                    location.pathname === "/main/profile"
                      ? "#3054F2"
                      : "#424d58"
                  }`,
                }}
              >
                <FaUser className={style.icon} />
              </div>
            </Link>
            <Link to={"/main/messages"} style={{ textDecoration: "none" }}>
              <div
                className={style.linkBox}
                style={{
                  color: `${
                    location.pathname === "/main/messages"
                      ? "#3054F2"
                      : "#424d58"
                  }`,
                }}
              >
                <FaEnvelope className={style.icon} />
              </div>
            </Link>
            <Link to={"/main/calendar"} style={{ textDecoration: "none" }}>
              <div
                className={style.linkBox}
                style={{
                  color: `${
                    location.pathname === "/main/calendar"
                      ? "#3054F2"
                      : "#424d58"
                  }`,
                }}
              >
                <FaCalendarAlt className={style.icon} />
              </div>
            </Link>
          </div>
          <div className={style.lowerBox}>
            <Link to={"/main"} style={{ textDecoration: "none" }}>
              <div
                className={style.linkBox}
                style={{
                  color: `${
                    location.pathname === "/main" ? "#3054F2" : "#646e78"
                  }`,
                }}
              >
                <BsGridFill className={style.iconS} />
                <h2>Dashboard</h2>
              </div>
            </Link>
            <div
              className={style.linkBox}
              style={{
                color: `${
                  location.pathname === "/main/employees" ||
                  location.pathname === "/main/clients" ||
                  location.pathname === "/main/suppliers"
                    ? "#3054F2"
                    : "#646e78"
                }`,
              }}
            >
              <BsPeopleFill className={style.iconS} />
              <h2>Spis osobowy</h2>
            </div>
            <div className={style.linkContainer}>
              <div className={style.link}>
                <h3>
                  <Link
                    to={"/main/employees"}
                    style={{
                      textDecoration: "none",
                      color: `${
                        location.pathname === "/main/employees"
                          ? "#3054F2"
                          : "#646e78"
                      }`,
                    }}
                  >
                    Pracownicy
                  </Link>
                </h3>
              </div>
              <div className={style.link}>
                <h3>
                  <Link
                    to={"/main/clients"}
                    style={{
                      textDecoration: "none",
                      color: `${
                        location.pathname === "/main/clients"
                          ? "#3054F2"
                          : "#646e78"
                      }`,
                    }}
                  >
                    Klienci
                  </Link>
                </h3>
              </div>
              <div className={style.link}>
                <h3>
                  <Link
                    to={"/main/suppliers"}
                    style={{
                      textDecoration: "none",
                      color: `${
                        location.pathname === "/main/suppliers"
                          ? "#3054F2"
                          : "#646e78"
                      }`,
                    }}
                  >
                    Dostwacy
                  </Link>
                </h3>
              </div>
            </div>
            <div
              className={style.linkBox}
              style={{
                color: `${
                  location.pathname === "/main/products" ||
                  location.pathname === "/main/visualisation"
                    ? "#3054F2"
                    : "#646e78"
                }`,
              }}
            >
              <FaBoxes className={style.iconS} />
              <h2>Magazyn</h2>
            </div>
            <div className={style.linkContainer}>
              <div className={style.link}>
                <h3>
                  <Link
                    to={"/main/products"}
                    style={{
                      textDecoration: "none",
                      color: `${
                        location.pathname === "/main/products"
                          ? "#3054F2"
                          : "#646e78"
                      }`,
                    }}
                  >
                    Lista produktów
                  </Link>
                </h3>
              </div>
              <div className={style.link}>
                <h3>
                  <Link
                    to={"/main/visualisation"}
                    style={{
                      textDecoration: "none",
                      color: `${
                        location.pathname === "/main/visualisation"
                          ? "#3054F2"
                          : "#646e78"
                      }`,
                    }}
                  >
                    Wizualizacja
                  </Link>
                </h3>
              </div>
            </div>
            <Link to={"/main/deliveries"} style={{ textDecoration: "none" }}>
              <div
                className={style.linkBox}
                style={{
                  color: `${
                    location.pathname === "/main/deliveries"
                      ? "#3054F2"
                      : "#646e78"
                  }`,
                }}
              >
                <BsFillFileEarmarkArrowUpFill className={style.iconS} />
                <h2>Dostawy</h2>
              </div>
            </Link>
            <Link to={"/main/orders"} style={{ textDecoration: "none" }}>
              <div
                className={style.linkBox}
                style={{
                  color: `${
                    location.pathname === "/main/orders" ? "#3054F2" : "#646e78"
                  }`,
                }}
              >
                <BsFillFileEarmarkArrowDownFill className={style.iconS} />
                <h2>Zamówienia</h2>
              </div>
            </Link>
            <Link to={"/main/operations"} style={{ textDecoration: "none" }}>
              <div
                className={style.linkBox}
                style={{
                  color: `${
                    location.pathname === "/main/operations"
                      ? "#3054F2"
                      : "#646e78"
                  }`,
                }}
              >
                <BsGearFill className={style.iconS} />
                <h2>Operacje</h2>
              </div>
            </Link>
            <Link to={"/main/files"} style={{ textDecoration: "none" }}>
              <div
                className={style.linkBox}
                style={{
                  color: `${
                    location.pathname === "/main/files" ? "#3054F2" : "#646e78"
                  }`,
                }}
              >
                <BsFillFileEarmarkTextFill className={style.iconS} />
                <h2>Dokumenty</h2>
              </div>
            </Link>
            <Link to={"/main/raports"} style={{ textDecoration: "none" }}>
              <div
                className={style.linkBox}
                style={{
                  color: `${
                    location.pathname === "/main/raports"
                      ? "#3054F2"
                      : "#646e78"
                  }`,
                }}
              >
                <BsBarChartLineFill className={style.iconS} />
                <h2>Raporty</h2>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
