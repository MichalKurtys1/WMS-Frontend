import { MdLocationOn } from "react-icons/md";
import style from "./LocationItem.module.css";
import { useState } from "react";

const LocationItem = (props) => {
  const [isClicked, setIsClicked] = useState(false);

  const clickHandler = () => {
    if (isClicked) {
      setIsClicked(false);
      props.deleteSelectedLocation(props.item.id);
    } else {
      setIsClicked(true);
      props.addSelectedLocation(
        props.item.id,
        props.item.product.name +
          " " +
          props.item.product.type +
          " " +
          props.item.product.capacity,
        props.item.numberOfProducts
      );
    }
  };

  return (
    <div className={style.locationBox} key={props.item.id}>
      <MdLocationOn
        className={style.icon}
        onClick={props.item.state === "Transferring" ? null : clickHandler}
        style={{
          top: `${props.item.posY}px`,
          left: `${props.item.posX}px`,
          color: isClicked
            ? "#22E650"
            : props.item.state === "Transferring"
            ? "yellow"
            : "#f03a30",
        }}
      />
      <p
        className={style.description}
        style={{
          top: `${+props.item.posY - 5}px`,
          left: `${+props.item.posX + 15}px`,
        }}
      >
        {props.item.numberOfProducts}x {props.item.product.name}{" "}
        {props.item.product.type} {props.item.product.capacity}
      </p>
    </div>
  );
};

export default LocationItem;
