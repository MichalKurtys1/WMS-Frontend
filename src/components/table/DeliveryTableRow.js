import React from "react";
import style from "./DeliveryTableRow.module.css";
import { BsTrashFill } from "react-icons/bs";
import { IoLocationSharp } from "react-icons/io5";
import {
  FaClipboardList,
  FaFileInvoice,
  FaPen,
  FaTruckLoading,
} from "react-icons/fa";

function DeliveryDetailsRow(props) {
  const {
    isClickedRow,
    allowExpand,
    type,
    id,
    products,
    updateStateHandler,
    editHandler,
    deleteHandler,
    record,
  } = props;

  return (
    <>
      {isClickedRow && allowExpand && type === "Delivery" && (
        <tr className={style.detailsRow} key={id + "_1"}>
          <td colspan="6" style={{ padding: 0 }}>
            <div className={style.wrapper}>
              <div className={style.details}>
                {products &&
                  JSON.parse(JSON.parse(products)).map((item) => (
                    <div className={style.productBox}>
                      <h4>{item.product}</h4>
                      <div className={style.numbersBox}>
                        <p>
                          <strong>{item.quantity}x</strong> {item.unit}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
              <div className={style.deliveryDataBox}>
                <p>Dostarczono</p>
                {products &&
                  JSON.parse(JSON.parse(products)).map((item) => (
                    <div className={style.deliveryBox}>
                      <h4>{item.delivered}</h4>
                    </div>
                  ))}
              </div>
              <div className={style.deliveryDataBox}>
                <p>Uszkodzonych</p>

                {products &&
                  JSON.parse(JSON.parse(products)).map((item) => (
                    <div className={style.deliveryBox}>
                      <h4>{item.damaged}</h4>
                    </div>
                  ))}
              </div>
              <div className={style.optionsContainer}>
                <div className={style.optionsBox}>
                  <button
                    onClick={() => updateStateHandler(id, "Odebrano")}
                    style={{
                      pointerEvents:
                        record["state"] === "Odebrano" ||
                        record["state"] === "Posortowano" ||
                        record["state"] === "Rozlokowano" ||
                        record["state"] === "Zakończono"
                          ? "none"
                          : "all",
                    }}
                  >
                    <FaTruckLoading
                      className={style.iconReverse}
                      style={{
                        color:
                          record["state"] === "Odebrano" ||
                          record["state"] === "Posortowano" ||
                          record["state"] === "Rozlokowano" ||
                          record["state"] === "Zakończono"
                            ? "#3054F2"
                            : null,
                      }}
                    />
                    <div className={style.tooltip}>
                      <p>Odebrano</p>
                    </div>
                  </button>
                  <button
                    onClick={() => updateStateHandler(id, "Posortowano")}
                    disabled={
                      record["state"] === "Posortowano" ||
                      record["state"] === "Rozlokowano" ||
                      record["state"] === "Zamówiono" ||
                      record["state"] === "Zakończono"
                        ? true
                        : false
                    }
                    style={{
                      pointerEvents:
                        record["state"] === "Posortowano" ||
                        record["state"] === "Rozlokowano" ||
                        record["state"] === "Zamówiono" ||
                        record["state"] === "Zakończono"
                          ? "none"
                          : "all",
                    }}
                  >
                    <FaClipboardList
                      className={style.icon}
                      style={{
                        color:
                          record["state"] === "Posortowano" ||
                          record["state"] === "Rozlokowano" ||
                          record["state"] === "Zakończono"
                            ? "#3054F2"
                            : null,
                      }}
                    />
                    <div className={style.tooltip}>
                      <p>Posortowano</p>
                    </div>
                  </button>
                  <button
                    onClick={() => updateStateHandler(id, "Rozlokowano")}
                    disabled={
                      record["state"] === "Rozlokowano" ||
                      record["state"] === "Zamówiono" ||
                      record["state"] === "Odebrano" ||
                      record["state"] === "Zakończono"
                        ? true
                        : false
                    }
                    style={{
                      pointerEvents:
                        record["state"] === "Rozlokowano" ||
                        record["state"] === "Zamówiono" ||
                        record["state"] === "Odebrano" ||
                        record["state"] === "Zakończono"
                          ? "none"
                          : null,
                    }}
                  >
                    <IoLocationSharp
                      className={style.icon}
                      style={{
                        color:
                          record["state"] === "Rozlokowano" ||
                          record["state"] === "Zakończono"
                            ? "#3054F2"
                            : null,
                      }}
                    />
                    <div className={style.tooltip}>
                      <p>Rozmieszczono</p>
                    </div>
                  </button>
                  <button
                    onClick={() => updateStateHandler(id, "Zakończono")}
                    disabled={
                      record["state"] === "Odebrano" ||
                      record["state"] === "Zamówiono" ||
                      record["state"] === "Posortowano" ||
                      record["state"] === "Zakończono"
                        ? true
                        : false
                    }
                    style={{
                      pointerEvents:
                        record["state"] === "Odebrano" ||
                        record["state"] === "Zamówiono" ||
                        record["state"] === "Posortowano" ||
                        record["state"] === "Zakończono"
                          ? "none"
                          : null,
                    }}
                  >
                    <FaFileInvoice
                      className={style.icon}
                      style={{
                        color:
                          record["state"] === "Zakończono" ? "#3054F2" : null,
                      }}
                    />
                    <div className={style.tooltip}>
                      <p>Dodaj fakturę</p>
                    </div>
                  </button>
                  <button
                    onClick={() => editHandler(id)}
                    disabled={
                      record["state"] === "Odebrano" ||
                      record["state"] === "Posortowano" ||
                      record["state"] === "Rozlokowano" ||
                      record["state"] === "Zakończono" ||
                      !props.position
                        ? true
                        : false
                    }
                    style={{
                      pointerEvents:
                        record["state"] === "Odebrano" ||
                        record["state"] === "Posortowano" ||
                        record["state"] === "Rozlokowano" ||
                        record["state"] === "Zakończono" ||
                        !props.position
                          ? "none"
                          : "all",
                    }}
                  >
                    <FaPen className={style.icon} />
                    <div className={style.tooltip}>
                      <p>Edytuj</p>
                    </div>
                  </button>
                  <button
                    onClick={() => deleteHandler(id)}
                    disabled={
                      record["state"] === "Odebrano" ||
                      record["state"] === "Posortowano" ||
                      record["state"] === "Rozlokowano" ||
                      record["state"] === "Zakończono" ||
                      !props.position
                        ? true
                        : false
                    }
                    style={{
                      pointerEvents:
                        record["state"] === "Odebrano" ||
                        record["state"] === "Posortowano" ||
                        record["state"] === "Rozlokowano" ||
                        record["state"] === "Zakończono" ||
                        !props.position
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
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default DeliveryDetailsRow;
