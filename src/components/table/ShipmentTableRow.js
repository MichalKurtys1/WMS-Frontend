import React from "react";
import style from "./TableRow.module.css";
import { BsTrashFill, BsCheckCircleFill } from "react-icons/bs";
import { FaClipboardList } from "react-icons/fa";

function DeliveryDetailsRow(props) {
  const {
    isClickedRow,
    allowExpand,
    type,
    id,
    orders,
    updateStateHandler,
    deleteHandler,
    record,
  } = props;

  return (
    <>
      {isClickedRow && allowExpand && type === "Shipping" && (
        <tr className={style.detailsRow} key={id + "_1"}>
          <td colspan="6">
            <div className={style.wrapper}>
              <div className={style.details}>
                {orders &&
                  JSON.parse(JSON.parse(orders))[0].map((item) => (
                    <div className={style.productBox}>
                      <h4>{item.clientName}</h4>
                      <h4>{item.clientAddress}</h4>
                      <h4>{item.destinationAddress}</h4>
                    </div>
                  ))}
              </div>
              <div className={style.optionsBox}>
                <button
                  onClick={() => updateStateHandler(id, "W trakcie")}
                  style={{
                    pointerEvents:
                      record["state"] === "W trakcie" ||
                      record["state"] === "Dostarczono"
                        ? "none"
                        : "all",
                  }}
                >
                  <BsCheckCircleFill
                    className={style.icon}
                    style={{
                      color:
                        record["state"] === "W trakcie" ||
                        record["state"] === "Dostarczono"
                          ? "#3054F2"
                          : null,
                    }}
                  />
                  <div className={style.tooltip}>
                    <p>W trakcie</p>
                  </div>
                </button>
                <button
                  onClick={() => updateStateHandler(id, "Dostarczono")}
                  disabled={record["state"] === "Dostarczono" ? true : false}
                  style={{
                    pointerEvents:
                      record["state"] === "Dostarczono" ? "none" : "all",
                  }}
                >
                  <FaClipboardList
                    className={style.icon}
                    style={{
                      color:
                        record["state"] === "Dostarczono" ? "#3054F2" : null,
                    }}
                  />
                  <div className={style.tooltip}>
                    <p>Dostarczono</p>
                  </div>
                </button>
                <button
                  onClick={() => deleteHandler(id)}
                  disabled={
                    record["state"] === "W trakcie" ||
                    record["state"] === "Dostarczono"
                      ? true
                      : false
                  }
                  style={{
                    pointerEvents:
                      record["state"] === "W trakcie" ||
                      record["state"] === "Dostarczono"
                        ? "none"
                        : "all",
                  }}
                >
                  <BsTrashFill className={style.icon} />
                  <div className={style.tooltip}>
                    <p>Usuń</p>
                  </div>
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default DeliveryDetailsRow;
