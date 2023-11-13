import { Form } from "react-final-form";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router";

import style from "./ShippingAddPage.module.css";
import Header from "../../../components/Header";
import React, { useEffect, useState } from "react";
import ErrorHandler from "../../../components/ErrorHandler";
import ShippingTable from "./ShippingTable";
import { selectValidator, textValidator } from "../../../utils/inputValidators";
import { ADD_SHIPMENT } from "../../../utils/apollo/apolloMutations";
import Select from "../../../components/Select";
import Input from "../../../components/Input";
import Loading from "../../../components/Loading";
import { GET_EMPLOYYES_ORDERS_STOCK_SHIPMENTS } from "../../../utils/apollo/apolloMultipleQueries";

const plateNumbersList = [
  { name: "Wybierz nr. Rejestracyjny" },
  { name: "CAL 55AB" },
  { name: "CAL 75TM" },
  { name: "CAL 12ZA" },
  { name: "CAL 8ZEZ" },
];

const ShippingAddPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [addOrderShipment] = useMutation(ADD_SHIPMENT, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const { data, loading, refetch } = useQuery(
    GET_EMPLOYYES_ORDERS_STOCK_SHIPMENTS,
    {
      onError: (error) => setError(error),
      onCompleted: () => setError(false),
    }
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  const selectedRowsAdd = (id) => {
    setSelectedRows((prevList) => [...prevList, { id: id }]);
  };

  const deleteHandler = (id) => {
    setSelectedRows((prevList) => prevList.filter((item) => item.id !== id));
  };

  const employeeHandler = () => {
    const employee = data.users.filter(
      (item) => item.position === "Przewoźnik"
    );
    let employeeList = [{ name: "Wybierz Przewoźnika" }];
    employee.map((item) => {
      return employeeList.push({ name: item.firstname + " " + item.lastname });
    });
    return employeeList;
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const onSubmit = (values) => {
    if (selectedRows.length === 0) {
      setError({
        message: "Do wykanania tej operacji wymagane jest wybranie zamówienia.",
      });
      return;
    }
    addOrderShipment({
      variables: {
        employee: values.employee,
        registrationNumber: values.number,
        deliveryDate: values.date,
        orders: JSON.stringify(selectedRows),
        pickingList: createPickinglist(selectedRows),
      },
    }).then((data) => {
      if (!data.data) return;
      navigate("/shipping", {
        state: {
          updated: true,
        },
      });
    });
  };

  const createPickinglist = (ids) => {
    const generateRandomString = (length) => {
      const characters = "0123456789";
      let result = "";

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
      }

      return result;
    };
    const picklist = {
      createDate: new Date().getTime(),
      picklistID: generateRandomString(8),
      orders: ids.map((id) => {
        const order = data.orders.find((order) => order.id === id.id);
        return {
          orderID: order.orderID,
          orderDate: order.expectedDate,
          products: JSON.parse(JSON.parse(order.products)).map((item) => {
            const stock = data.stocks.find(
              (stock) =>
                item.product.includes(stock.product.name) &&
                item.product.includes(stock.product.type) &&
                item.product.includes(stock.product.capacity)
            );
            return {
              productCode: stock.code,
              productQuantity: item.quantity,
              productUnit: item.unit,
              productName: item.product,
            };
          }),
        };
      }),
    };

    return picklist;
  };

  return (
    <div className={style.container}>
      <Header path={"/shipping"} />
      <ErrorHandler error={error} />
      <Loading state={loading && !error} />
      {!loading && data.users && data.shipments && data.orders && (
        <main>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, invalid }) => (
              <form className={style.form} onSubmit={handleSubmit}>
                <h1>Dodawanie wysyłki</h1>
                <p>Wybierz zamówienia do wysyłki</p>
                <ShippingTable
                  selectedRowsAdd={selectedRowsAdd}
                  deleteHandler={deleteHandler}
                />
                <div className={style.inputBox}>
                  <div className={style.selectBox}>
                    <Select
                      fieldName="employee"
                      validator={selectValidator}
                      options={employeeHandler()}
                      title="Przewoźnik"
                    />
                  </div>
                  <div className={style.selectBox}>
                    <Select
                      fieldName="number"
                      validator={selectValidator}
                      options={plateNumbersList}
                      title="Numer rejestracyjny"
                    />
                  </div>
                  <Input
                    name="date"
                    type="date"
                    fieldName="date"
                    validator={textValidator}
                    min={getCurrentDateTime()}
                    width="47%"
                  />
                  <button
                    className={style.submitBtn}
                    disabled={invalid}
                    type="submit"
                    style={{ backgroundColor: invalid ? "#B6BABF" : null }}
                  >
                    Dodaj
                  </button>
                </div>
              </form>
            )}
          />
        </main>
      )}
    </div>
  );
};

export default ShippingAddPage;
