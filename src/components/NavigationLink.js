import { useLocation } from "react-router";
import style from "./Navigation.module.css";
import { Link } from "react-router-dom";

const NavigationLink = (props) => {
  const location = useLocation();

  const colorHandler = (main, path) => {
    if (main) {
      return path === `${props.path}` ? "#3054F2" : "#646e78";
    } else {
      return location.pathname.includes(`${props.path}`)
        ? "#3054F2"
        : "#646e78";
    }
  };

  return (
    <Link to={`${props.path}`} style={{ textDecoration: "none" }}>
      <div
        className={style.linkBox}
        style={{
          color: `${colorHandler(props.main, location.pathname)}`,
        }}
      >
        {props.icon}
        <h2>{props.title}</h2>
      </div>
    </Link>
  );
};

export default NavigationLink;
