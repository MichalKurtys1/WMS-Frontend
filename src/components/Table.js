import React, { useEffect, useState } from "react";
import { pickProperties } from "../utils/objFormatting";
import style from "./Table.module.css";
import TableRow from "./TableRow";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const Table = (props) => {
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [data, setData] = useState(props.data);

  useEffect(() => {
    sortHandler(data, sortedColumn, sortDirection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedColumn, sortDirection]);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const handleSort = (columnName) => {
    if (sortedColumn === columnName) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortedColumn(columnName);
      setSortDirection("asc");
    }
  };

  function sortHandler(array, key, sortDirection) {
    if (array.length === 0) {
      return [];
    }

    const compareFunction = (a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      let comparison = 0;
      if (valueA > valueB) {
        comparison = 1;
      } else if (valueA < valueB) {
        comparison = -1;
      }

      return sortDirection.toLowerCase() === "desc"
        ? comparison * -1
        : comparison;
    };

    setData([...array].sort(compareFunction));
  }

  return (
    <>
      {props.data && (
        <table className={style.table}>
          <thead>
            <tr>
              {props.titles.map((name, i) => (
                <th
                  key={props.format[i]}
                  onClick={() => handleSort(props.format[i])}
                >
                  <div>
                    {name}
                    {sortedColumn === props.format[i] &&
                    sortDirection === "asc" ? (
                      <FaAngleUp className={style.sortIcon} />
                    ) : (
                      <FaAngleDown className={style.sortIcon} />
                    )}
                  </div>
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.length !== 0 &&
              data.map((record) => {
                const id = record.id;
                const products = record.products || null;
                const orders = record.orders || null;
                const formattedData = pickProperties(record, props.format);
                let keys = Object.keys(formattedData);
                return (
                  <TableRow
                    key={id}
                    id={id}
                    keys={keys}
                    products={products}
                    orders={orders}
                    details={props.details}
                    record={formattedData}
                    selectedRow={props.selectedRow}
                    editHandler={props.editHandler}
                    detailsHandler={props.detailsHandler}
                    messageHandler={props.messageHandler}
                    deleteHandler={props.deleteHandler}
                    selectedRowHandler={props.selectedRowHandler}
                    allowExpand={props.allowExpand}
                    updateStateHandler={props.updateStateHandler}
                    type={props.type}
                  />
                );
              })}
          </tbody>
        </table>
      )}
      {data.length === 0 && (
        <p className={style.emptyData}>Nie znaleziono żadnych danych</p>
      )}
    </>
  );
};

export default Table;
