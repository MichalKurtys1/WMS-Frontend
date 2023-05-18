import { useState } from "react";
import style from "./NavigationItem.module.css";
import { TfiAngleDown, TfiAngleDoubleRight, TfiAngleUp } from "react-icons/tfi";
import { Link, useLocation } from "react-router-dom";

const NavigationItem = (props) => {
  const location = useLocation();
  const [isClicked, setIsCliced] = useState(false);
  let Icon;
  let IconMain = props.iconMain;

  if (isClicked) {
    Icon = TfiAngleUp;
  } else {
    Icon = TfiAngleDown;
  }

  const onClick = () => {
    if (isClicked) {
      setIsCliced(false);
    } else {
      setIsCliced(true);
    }
  };

  return (
    <>
      <div className={style.linkBox} onClick={onClick}>
        <IconMain className={style.iconS} />
        <h2>{props.mainName}</h2>
        <Icon className={style.iconDown} />
      </div>
      {isClicked && (
        <div className={style.detailsContainer}>
          {props.namesList.map((item) => (
            <Link to={`/main/${item.link}`} style={{ textDecoration: "none" }}>
              <div
                className={style.detailsBox}
                style={{
                  color: `${
                    location.pathname === "/main/" + item.link
                      ? "#3054F2"
                      : "#424D58"
                  }`,
                }}
              >
                <TfiAngleDoubleRight className={style.iconRight} />
                <h3>{item.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default NavigationItem;
