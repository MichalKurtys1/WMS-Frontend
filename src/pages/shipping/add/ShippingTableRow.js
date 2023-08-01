import { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import style from "./ShippingTableRow.module.css";

const ShippingTableRow = (props) => {
  const [isClickedRow, setIsClickedRow] = useState(false);
  const [isCheckClicked, setIsCheckClicked] = useState(false);

  const clickRowHandler = () => {
    if (isClickedRow) {
      setIsClickedRow(false);
    } else {
      setIsClickedRow(true);
    }
  };

  const checkClickHandler = () => {
    if (isCheckClicked) {
      setIsCheckClicked(false);
      props.deleteHandler(props.id);
    } else {
      setIsCheckClicked(true);
      props.selectedRowsAdd(props.id);
    }
  };

  return (
    <>
      <tr className={style.tr} key={props.id}>
        <td className={style.checkBox}>
          <label className={style.container}>
            <input type="checkbox" />
            <span
              className={style.checkmark}
              onClick={checkClickHandler}
            ></span>
          </label>
        </td>
        {props.keys.map((value) => {
          if (value === "id") return null;
          return (
            <td onClick={clickRowHandler} key={`${props.id}-${value}`}>
              {props.record[value] || "-"}
            </td>
          );
        })}
        <td key="options" onClick={clickRowHandler}>
          {isClickedRow && <FaAngleUp />}
          {!isClickedRow && <FaAngleDown />}
        </td>
      </tr>
      {isClickedRow && (
        <tr className={style.detailsRow} key={props.id + "_1"}>
          <td colspan="6">
            {props.products &&
              JSON.parse(JSON.parse(props.products)).map((item) => (
                <div className={style.productBox}>
                  <h4>{item.product}</h4>
                  <div className={style.numbersBox}>
                    <p>
                      <strong>{item.quantity}x</strong> {item.unit}
                    </p>
                  </div>
                </div>
              ))}
          </td>
        </tr>
      )}
    </>
  );
};

export default ShippingTableRow;
