import { useLocation } from "react-router";
import style from "./Navigation.module.css";
import { Link } from "react-router-dom";

const NavigationLinkGroup = (props) => {
  const location = useLocation();

  const colorHandler = (links, path) => {
    for (const link of links) {
      if (path.includes(link.link)) {
        return "#3054F2";
      }
    }
    return "#646e78";
  };

  return (
    <>
      <div
        className={style.linkBox}
        style={{
          color: `${colorHandler(props.links, location.pathname)}`,
        }}
      >
        {props.icon}
        <h2>{props.title}</h2>
      </div>
      <div className={style.linkContainer}>
        {props.links.map((item) => (
          <div className={style.link}>
            <h3>
              <Link
                to={item.link}
                style={{
                  textDecoration: "none",
                  color: `${
                    location.pathname.includes(item.link)
                      ? "#3054F2"
                      : "#646e78"
                  }`,
                }}
              >
                {item.title}
              </Link>
            </h3>
          </div>
        ))}
      </div>
    </>
  );
};

export default NavigationLinkGroup;
