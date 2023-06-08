import { useLocation } from "react-router";
import style from "./Navigation.module.css";
import {
  BsPeopleFill,
  BsGridFill,
  BsFillFileTextFill,
  BsFillBoxSeamFill,
  BsFillFileEarmarkTextFill,
  BsBarChartLineFill,
} from "react-icons/bs";
import {
  FaBoxes,
  FaRegCalendarAlt,
  FaRegEnvelope,
  FaUser,
} from "react-icons/fa";
import NavigationItem from "./NavigationItem";
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
                      : "#2D3640"
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
                      : "#2D3640"
                  }`,
                }}
              >
                <FaRegEnvelope className={style.icon} />
              </div>
            </Link>
            <Link to={"/main/calendar"} style={{ textDecoration: "none" }}>
              <div
                className={style.linkBox}
                style={{
                  color: `${
                    location.pathname === "/main/calendar"
                      ? "#3054F2"
                      : "#2D3640"
                  }`,
                }}
              >
                <FaRegCalendarAlt className={style.icon} />
              </div>
            </Link>
          </div>
          <div className={style.lowerBox}>
            <Link to={"/main"} style={{ textDecoration: "none" }}>
              <div
                className={style.linkBox}
                style={{
                  color: `${
                    location.pathname === "/main" ? "#3054F2" : "#424D58"
                  }`,
                }}
              >
                <BsGridFill className={style.iconS} />
                <h2>Dashboard</h2>
              </div>
            </Link>
            <NavigationItem
              iconMain={BsPeopleFill}
              mainName="Spis osobowy"
              namesList={[
                { name: "Pracownicy", link: "employees" },
                { name: "Klienci", link: "clients" },
                { name: "Dostwacy", link: "suppliers" },
              ]}
            />
            <NavigationItem
              iconMain={BsFillFileTextFill}
              mainName="Zamówienia"
              namesList={[
                { name: "Do Dostawców", link: "from-suppliers" },
                { name: "Od Klientów", link: "from-clients" },
              ]}
            />
            <NavigationItem
              iconMain={FaBoxes}
              mainName="Magazyn"
              namesList={[
                { name: "Lista produktów", link: "product-list" },
                { name: "Stan magazynowy", link: "werehouse-state" },
                { name: "Wizualizacja", link: "visualisation" },
              ]}
            />
            <NavigationItem
              iconMain={BsFillBoxSeamFill}
              mainName="Asortyment"
              namesList={[
                { name: "Przyjęcie", link: "delivery-acceptance" },
                { name: "Wydanie", link: "product-release" },
                { name: "Przeniesienie", link: "product-transfer" },
              ]}
            />
            <Link to={"/main/files"} style={{ textDecoration: "none" }}>
              <div
                className={style.linkBox}
                style={{
                  color: `${
                    location.pathname === "/main/files" ? "#3054F2" : "#424D58"
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
                      : "#424D58"
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
