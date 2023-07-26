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
    <div
      className={style.locationBox}
      key={props.item.id}
      onClick={props.item.state === "Transferring" ? null : clickHandler}
      style={{
        top: `${+props.item.posY - 5}px`,
        left: `${+props.item.posX + 15}px`,
        backgroundColor: isClicked
          ? "#B2FFC4"
          : props.item.state === "Transferring"
          ? "#FFE1B2"
          : "#ffb6b2",
      }}
    >
      <MdLocationOn
        className={style.icon}
        style={{
          color: isClicked
            ? "#B2FFC4"
            : props.item.state === "Transferring"
            ? "#FFE1B2"
            : "#FFB6B2",
          backgroundColor: isClicked
            ? "#22E650"
            : props.item.state === "Transferring"
            ? "#F2A530"
            : "#f03a30",
        }}
      />
      <p className={style.description}>
        {props.item.numberOfProducts}x {props.item.product.name}{" "}
        {props.item.product.type} {props.item.product.capacity}
      </p>
    </div>
  );
};

export default LocationItem;
