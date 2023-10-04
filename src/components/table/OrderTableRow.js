import React from "react";
import style from "./OrderTableRow.module.css";
import {
  BsTrashFill,
  BsCheckCircleFill,
  BsFillBoxSeamFill,
  BsCheckSquareFill,
} from "react-icons/bs";
import { FaListOl, FaPen, FaFileInvoiceDollar } from "react-icons/fa";

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
    transportType,
    openPicklist,
  } = props;

  return (
    <>
      {isClickedRow && allowExpand && type === "Orders" && (
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
              <div className={style.orderType}>
                <p>
                  {transportType === "-"
                    ? "-"
                    : transportType === "personal"
                    ? "Odbiór osobisty"
                    : "Dowóz"}
                </p>
              </div>
              <div className={style.optionsContainer}>
                <div className={style.optionsBox}>
                  {transportType === "-" && (
                    <button
                      onClick={() => updateStateHandler(id, "Potwierdzono")}
                      style={{
                        pointerEvents:
                          record["state"] === "Potwierdzono" ||
                          record["state"] === "Skompletowano" ||
                          record["state"] === "Do wysyłki" ||
                          record["state"] === "Dostarczono" ||
                          record["state"] === "Wysłano"
                            ? "none"
                            : "all",
                      }}
                    >
                      <BsCheckCircleFill
                        className={style.icon}
                        style={{
                          color:
                            record["state"] === "Potwierdzono" ||
                            record["state"] === "Skompletowano" ||
                            record["state"] === "Do wysyłki" ||
                            record["state"] === "Dostarczono" ||
                            record["state"] === "Wysłano"
                              ? "#3054F2"
                              : null,
                        }}
                      />
                      <div className={style.tooltip}>
                        <p>Potwierdź</p>
                      </div>
                    </button>
                  )}
                  {transportType === "personal" && (
                    <button onClick={() => openPicklist(id, products)}>
                      <p className={style.picklist}>Lista kompletacyjna</p>
                    </button>
                  )}
                  {transportType === "personal" &&
                    record["state"] === "Potwierdzono" && (
                      <button
                        onClick={() => updateStateHandler(id, "Kompletowanie")}
                      >
                        <FaListOl className={style.icon} />
                        <div className={style.tooltip}>
                          <p>Kompletowanie</p>
                        </div>
                      </button>
                    )}
                  {transportType === "personal" &&
                    record["state"] === "Kompletowanie" && (
                      <button
                        onClick={() => updateStateHandler(id, "Pakowanie")}
                      >
                        <BsFillBoxSeamFill className={style.icon} />
                        <div className={style.tooltip}>
                          <p>Pakowanie</p>
                        </div>
                      </button>
                    )}
                  {transportType === "personal" &&
                    record["state"] === "Pakowanie" && (
                      <button
                        onClick={() => updateStateHandler(id, "Do odebrania")}
                      >
                        <BsCheckSquareFill className={style.icon} />
                        <div className={style.tooltip}>
                          <p style={{ whiteSpace: "nowrap" }}>Do odebrania</p>
                        </div>
                      </button>
                    )}
                  {transportType === "personal" &&
                    record["state"] === "Do odebrania" && (
                      <button
                        onClick={() => updateStateHandler(id, "Odebrano")}
                      >
                        <FaFileInvoiceDollar className={style.icon} />
                        <div className={style.tooltip}>
                          <p>Odebrano</p>
                        </div>
                      </button>
                    )}
                  <button
                    onClick={() => editHandler(id)}
                    disabled={
                      record["state"] === "Potwierdzono" ||
                      record["state"] === "Kompletowanie" ||
                      record["state"] === "Pakowanie" ||
                      record["state"] === "Wysłano" ||
                      record["state"] === "Dostarczono" ||
                      record["state"] === "Do odebrania" ||
                      record["state"] === "Odebrano" ||
                      !props.position
                        ? true
                        : false
                    }
                    style={{
                      pointerEvents:
                        record["state"] === "Potwierdzono" ||
                        record["state"] === "Kompletowanie" ||
                        record["state"] === "Pakowanie" ||
                        record["state"] === "Wysłano" ||
                        record["state"] === "Dostarczono" ||
                        record["state"] === "Do odebrania" ||
                        record["state"] === "Odebrano" ||
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
                      record["state"] === "Potwierdzono" ||
                      record["state"] === "Kompletowanie" ||
                      record["state"] === "Pakowanie" ||
                      record["state"] === "Wysłano" ||
                      record["state"] === "Dostarczono" ||
                      record["state"] === "Do odebrania" ||
                      record["state"] === "Odebrano" ||
                      !props.position
                        ? true
                        : false
                    }
                    style={{
                      pointerEvents:
                        record["state"] === "Potwierdzono" ||
                        record["state"] === "Kompletowanie" ||
                        record["state"] === "Pakowanie" ||
                        record["state"] === "Wysłano" ||
                        record["state"] === "Dostarczono" ||
                        record["state"] === "Do odebrania" ||
                        record["state"] === "Odebrano" ||
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
