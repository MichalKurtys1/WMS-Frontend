import { useEffect, useState } from "react";
import style from "./ShippingTable.module.css";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { pickProperties } from "../../../utils/objFormatting";
import { GET_ORDERS } from "../../../utils/apollo/apolloQueries";
import { useQuery } from "@apollo/client";
import ErrorHandler from "../../../components/ErrorHandler";
import ShippingTableRow from "./ShippingTableRow";
import { dateToPolish } from "../../../utils/dateFormatters";

const format = ["client", "warehouse", "expectedDate", "state"];
const titles = ["Klient", "Magazyn", "Termin", "Stan"];

const ShippingTable = (props) => {
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [error, setError] = useState();
  const [data, setData] = useState();
  const { data: orders } = useQuery(GET_ORDERS, {
    onError: (error) => setError(error),
    onCompleted: (data) =>
      setData(orders.orders.filter((item) => item.state === "Do wysyłki")),
  });

  useEffect(() => {
    if (data) {
      sortHandler(data, sortedColumn, sortDirection);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedColumn, sortDirection]);

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
      {data && (
        <table className={style.table}>
          <ErrorHandler error={error} />
          <thead>
            <tr>
              <th></th>
              {titles.map((name, i) => (
                <th key={format[i]} onClick={() => handleSort(format[i])}>
                  <div>
                    {name}
                    {sortedColumn === format[i] && sortDirection === "asc" ? (
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
                const tempRecord = { ...record };
                tempRecord.client = tempRecord.client.name;
                tempRecord.expectedDate = dateToPolish(tempRecord.expectedDate);
                const id = tempRecord.id;
                const products = tempRecord.products || null;
                const formattedData = pickProperties(tempRecord, format);
                let keys = Object.keys(formattedData);
                return (
                  <ShippingTableRow
                    selectedRowsAdd={props.selectedRowsAdd}
                    deleteHandler={props.deleteHandler}
                    key={id}
                    id={id}
                    keys={keys}
                    products={products}
                    record={formattedData}
                  />
                );
              })}
          </tbody>
        </table>
      )}
      {data && data.length === 0 && (
        <p className={style.emptyData}>Nie znaleziono żadnych danych</p>
      )}
    </>
  );
};

export default ShippingTable;
