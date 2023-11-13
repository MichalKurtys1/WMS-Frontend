import React, { useState } from "react";
import {
  BsTrashFill,
  BsFillBoxSeamFill,
  BsCheckSquareFill,
} from "react-icons/bs";
import style from "./ShipmentTableRow.module.css";
import { useQuery } from "@apollo/client";
import { GET_ORDERS } from "../../utils/apollo/apolloQueries";
import { FaClipboardList, FaListOl, FaTruck } from "react-icons/fa";
import ErrorHandler from "../ErrorHandler";

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
    openPicklist,
    openWaybill,
    selectedRowHandler,
  } = props;
  const [error, setError] = useState();
  const { data } = useQuery(GET_ORDERS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  return (
    <>
      <ErrorHandler error={error} />
      {isClickedRow && allowExpand && type === "Shipping" && (
        <tr className={style.detailsRow} key={id + "_1"}>
          <td colspan="6" style={{ padding: 0 }}>
            <div className={style.wrapper}>
              <div className={style.details}>
                <h5>Klient</h5>
                {orders &&
                  data.orders
                    .filter((item) => {
                      return JSON.parse(orders).includes(item.id);
                    })
                    .map((item) => (
                      <div className={style.productBox}>
                        <p>
                          <strong>{item.client.name}</strong>
                        </p>
                      </div>
                    ))}
              </div>
              <div className={style.details}>
                <h5>Adres</h5>
                {orders &&
                  data.orders
                    .filter((item) => {
                      return JSON.parse(orders).includes(item.id);
                    })
                    .map((item) => (
                      <div className={style.productBox}>
                        <p>
                          <strong>
                            {item.client.street +
                              " " +
                              item.client.number +
                              " " +
                              item.client.city}
                          </strong>
                        </p>
                      </div>
                    ))}
              </div>
              <div className={style.optionsContainer}>
                <div className={style.optionsBox}>
                  {record["state"] === "Wysłano" && (
                    <button onClick={() => openWaybill(id)}>
                      <FaTruck
                        className={style.icon}
                        style={{ fontSize: "18px" }}
                      />
                      <div className={style.tooltip}>
                        <p style={{ whiteSpace: "nowrap" }}>List przewozowy</p>
                      </div>
                    </button>
                  )}

                  <button onClick={() => openPicklist(id)}>
                    <FaClipboardList className={style.icon} />
                    <div className={style.tooltip}>
                      <p>Pickinglist</p>
                    </div>
                  </button>
                  {record["state"] === "Zlecone" && (
                    <button
                      onClick={() => updateStateHandler(id, "Kompletowanie")}
                    >
                      <FaListOl className={style.icon} />
                      <div className={style.tooltip}>
                        <p>Kompletowanie</p>
                      </div>
                    </button>
                  )}
                  {record["state"] === "Kompletowanie" && (
                    <button onClick={() => updateStateHandler(id, "Pakowanie")}>
                      <BsFillBoxSeamFill className={style.icon} />
                      <div className={style.tooltip}>
                        <p>Pakowanie</p>
                      </div>
                    </button>
                  )}
                  {record["state"] === "Pakowanie" && (
                    <button onClick={() => updateStateHandler(id, "Wysłano")}>
                      <BsCheckSquareFill className={style.icon} />
                      <div className={style.tooltip}>
                        <p style={{ whiteSpace: "nowrap" }}>Wysyłanie</p>
                      </div>
                    </button>
                  )}
                  {record["state"] === "Wysłano" && (
                    <button
                      onClick={() => updateStateHandler(id, "Dostarczono")}
                    >
                      <BsCheckSquareFill className={style.icon} />
                      <div className={style.tooltip}>
                        <p style={{ whiteSpace: "nowrap" }}>Dostarczono</p>
                      </div>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      selectedRowHandler(id);
                      deleteHandler();
                    }}
                    disabled={
                      record["state"] === "Kompletowanie" ||
                      record["state"] === "Pakowanie" ||
                      record["state"] === "Wysłano" ||
                      record["state"] === "Dostarczono" ||
                      record["state"] === "Zakończono" ||
                      !props.position
                        ? true
                        : false
                    }
                    style={{
                      pointerEvents:
                        record["state"] === "Kompletowanie" ||
                        record["state"] === "Pakowanie" ||
                        record["state"] === "Wysłano" ||
                        record["state"] === "Dostarczono" ||
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
