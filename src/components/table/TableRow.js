import { useEffect, useState } from "react";
import {
  BsThreeDotsVertical,
  BsTrashFill,
  BsGearFill,
  BsFillTriangleFill,
} from "react-icons/bs";
import { FaAngleDown, FaAngleUp, FaPen } from "react-icons/fa";
import style from "./TableRow.module.css";
import DeliveryTableRow from "./DeliveryTableRow";
import OrderTableRow from "./OrderTableRow";
import ShipmentTableRow from "./ShipmentTableRow";

const TableRow = (props) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isClickedRow, setIsClickedRow] = useState(false);

  useEffect(() => {
    if (props.selectedRow !== props.id) {
      setIsClicked(false);
    }
  }, [props.selectedRow, props.id]);

  const clickHandler = () => {
    if (isClicked) {
      setIsClicked(false);
    } else {
      setIsClicked(true);
      props.selectedRowHandler(props.id);
    }
  };

  const clickRowHandler = () => {
    if (isClickedRow) {
      setIsClickedRow(false);
    } else {
      setIsClickedRow(true);
    }
  };

  return (
    <>
      <tr className={style.tr} key={props.id} onClick={clickRowHandler}>
        {props.keys.map((value) => {
          if (value === "id") return null;
          if (value === "state") {
            return (
              <td style={{ width: "15%" }} key={`${props.id}-${value}`}>
                {props.record[value] || "-"}
              </td>
            );
          }
          return (
            <td key={`${props.id}-${value}`}>
              {props.record[value] ||
                (!props.record[value] && Number.isInteger(props.record[value])
                  ? "0"
                  : "-")}
            </td>
          );
        })}
        {!props.allowExpand && (
          <>
            {!props.options && (
              <td key="options" onClick={clickHandler}>
                <BsThreeDotsVertical />
                {isClicked && (
                  <div className={style.options}>
                    <div
                      className={style.option}
                      onClick={() => props.editHandler(props.id)}
                    >
                      <BsFillTriangleFill className={style.triangleIcon} />
                      <FaPen className={style.icon} />
                      <p>Edytuj</p>
                    </div>
                    <div
                      className={style.option}
                      onClick={() => props.deleteHandler(props.id)}
                    >
                      <BsTrashFill className={style.icon} />
                      <p>Usuń</p>
                    </div>
                    {props.details && (
                      <div
                        className={style.option}
                        onClick={() => props.detailsHandler(props.id)}
                      >
                        <BsGearFill className={style.icon} />
                        <p>Szczegóły</p>
                      </div>
                    )}
                  </div>
                )}
              </td>
            )}
            {props.options && <td key="options"></td>}
          </>
        )}
        {props.allowExpand && (
          <td key="options" onClick={clickHandler}>
            {isClickedRow && <FaAngleUp />}
            {!isClickedRow && <FaAngleDown />}
          </td>
        )}
      </tr>
      <DeliveryTableRow
        isClickedRow={isClickedRow}
        allowExpand={props.allowExpand}
        type={props.type}
        id={props.id}
        products={props.products}
        updateStateHandler={props.updateStateHandler}
        editHandler={props.editHandler}
        deleteHandler={props.deleteHandler}
        record={props.record}
        position={props.position}
        selectedRowHandler={props.selectedRowHandler}
      />
      <OrderTableRow
        isClickedRow={isClickedRow}
        allowExpand={props.allowExpand}
        type={props.type}
        id={props.id}
        products={props.products}
        updateStateHandler={props.updateStateHandler}
        editHandler={props.editHandler}
        deleteHandler={props.deleteHandler}
        record={props.record}
        position={props.position}
        transportType={props.transportType}
        openPicklist={props.openPicklist}
        selectedRowHandler={props.selectedRowHandler}
      />
      <ShipmentTableRow
        isClickedRow={isClickedRow}
        allowExpand={props.allowExpand}
        type={props.type}
        id={props.id}
        orders={props.orders}
        products={props.products}
        updateStateHandler={props.updateStateHandler}
        editHandler={props.editHandler}
        deleteHandler={props.deleteHandler}
        record={props.record}
        position={props.position}
        openPicklist={props.openPicklist}
        openWaybill={props.openWaybill}
        selectedRowHandler={props.selectedRowHandler}
      />
    </>
  );
};

export default TableRow;
