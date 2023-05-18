import { Outlet, useLocation } from "react-router";
import style from "./Navigation.module.css";
import {
  BsCalendar3,
  BsPerson,
  BsEnvelope,
  BsPeople,
  BsColumnsGap,
  BsFileText,
  BsBoxSeam,
  BsFileEarmarkText,
  BsBarChartLine,
  BsBoxes,
} from "react-icons/bs";
import NavigationItem from "./NavigationItem";
import { Link } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  return (
    <div className={style.container}>
      ,
      <div className={style.menuContainer}>
        <div className={style.menu}>
          <div className={style.upperBox}>
            <Link to={"/main/profile"} style={{ textDecoration: "none" }}>
              <div
                className={style.linkBox}
                style={{
                  color: `${
                    location.pathname === "/profile" ? "#3054F2" : "#000e4d"
                  }`,
                }}
              >
                <BsPerson className={style.icon} />
                <h2 className={style.h2Color}>Jan Kowalski</h2>
              </div>
            </Link>
            <Link to={"/main/messages"} style={{ textDecoration: "none" }}>
              <div
                className={style.linkBox}
                style={{
                  color: `${
                    location.pathname === "/messages" ? "#3054F2" : "#000e4d"
                  }`,
                }}
              >
                <BsEnvelope className={style.icon} />
                <h2 className={style.h2Color}>Wiadomości</h2>
              </div>
            </Link>
            <Link to={"/main/calendar"} style={{ textDecoration: "none" }}>
              <div
                className={style.linkBox}
                style={{
                  color: `${
                    location.pathname === "/calendar" ? "#3054F2" : "#000e4d"
                  }`,
                }}
              >
                <BsCalendar3 className={style.icon} />
                <h2 className={style.h2Color}>Kalendarz</h2>
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
                <BsColumnsGap className={style.iconS} />
                <h2>Dashboard</h2>
              </div>
            </Link>
            <NavigationItem
              iconMain={BsPeople}
              mainName="Spis osobowy"
              namesList={[
                { name: "Pracownicy", link: "employees" },
                { name: "Klienci", link: "clients" },
                { name: "Dostwacy", link: "suppliers" },
              ]}
            />
            <NavigationItem
              iconMain={BsFileText}
              mainName="Zamówienia"
              namesList={[
                { name: "Do Dostawców", link: "from-suppliers" },
                { name: "Od Klientów", link: "from-clients" },
              ]}
            />
            <NavigationItem
              iconMain={BsBoxes}
              mainName="Magazyn"
              namesList={[
                { name: "Lista produktów", link: "product-list" },
                { name: "Stan magazynowy", link: "werehouse-state" },
                { name: "Wizualizacja", link: "visualisation" },
              ]}
            />
            <NavigationItem
              iconMain={BsBoxSeam}
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
                <BsFileEarmarkText className={style.iconS} />
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
                <BsBarChartLine className={style.iconS} />
                <h2>Raporty</h2>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Navigation;
