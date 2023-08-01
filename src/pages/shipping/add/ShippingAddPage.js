import { Form } from "react-final-form";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router";
import { selectValidator } from "../../../utils/inputValidators";

import style from "./ShippingAddPage.module.css";
import Spinner from "../../../components/Spiner";
import Select from "../../../components/Select";
import { FaAngleLeft } from "react-icons/fa";
import React, { useState } from "react";
import ErrorHandler from "../../../components/ErrorHandler";
import ShippingTable from "./ShippingTable";
import Input from "../../../components/Input";

import {
  GET_EMPLOYYES,
  GET_ORDERS,
  GET_SHIPPINGS,
} from "../../../utils/apollo/apolloQueries";
import {
  ADD_ORDERS_SHIPMENT,
  UPDATE_ORDER_STATE,
} from "../../../utils/apollo/apolloMutations";

const positonList = [
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
  const [addOrderShipment] = useMutation(ADD_ORDERS_SHIPMENT);
  const { data: employees, loading } = useQuery(GET_EMPLOYYES, {
    onError: (error) => setError(error),
  });
  const { data: orders, loadingOrders } = useQuery(GET_ORDERS, {
    onError: (error) => setError(error),
  });
  const { data: shippings, loadingShippings } = useQuery(GET_SHIPPINGS, {
    onError: (error) => setError(error),
  });
  const [updateOrdersState] = useMutation(UPDATE_ORDER_STATE, {
    onError: (error) => setError(error),
  });

  const selectedRowsAdd = (id) => {
    setSelectedRows((prevList) => [...prevList, { id: id }]);
  };

  const deleteHandler = (id) => {
    setSelectedRows((prevList) => prevList.filter((item) => item.id !== id));
  };

  const employeeHandler = () => {
    const employee = employees.users.filter(
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
    let ordersData = orders.orders.filter((item) =>
      selectedRows.some((obj) => obj.id === item.id)
    );

    let shipping = ordersData.map((item) => {
      let clientAddress =
        item.client.street + " " + item.client.number + " " + item.client.city;
      let products = JSON.parse(JSON.parse(item.products));
      let shippingData = shippings.shippings.filter(
        (shipping) => shipping.orderId === item.id
      );

      return {
        employeeName: values.employee,
        registrationNumber: values.number,
        deliveryDate: values.date,
        warehouseAddress: "ul. Cicha 2 Bydgoszcz",
        orderId: item.id,
        clientName: item.client.name,
        clientAddress: clientAddress,
        destinationAddress: clientAddress,
        products: products,
        totalWeight: shippingData[0].totalWeight,
        palletNumber: shippingData[0].palletNumber,
        palletSize: shippingData[0].palletSize,
      };
    });

    addOrderShipment({
      variables: {
        employee: values.employee,
        registrationNumber: values.number,
        deliveryDate: values.date,
        warehouse: "ul. Cicha 2 Bydgoszcz",
        orders: JSON.stringify([
          ordersData.map((item) => {
            let clientAddress =
              item.client.street +
              " " +
              item.client.number +
              " " +
              item.client.city;
            let products = JSON.parse(JSON.parse(item.products));
            let shippingData = shippings.shippings.filter(
              (shipping) => shipping.orderId === item.id
            );

            return {
              orderId: item.id,
              clientName: item.client.name,
              clientAddress: clientAddress,
              destinationAddress: clientAddress,
              products: products,
              totalWeight: shippingData[0].totalWeight,
              palletNumber: shippingData[0].palletNumber,
              palletSize: shippingData[0].palletSize,
            };
          }),
        ]),
      },
    })
      .then((data) => {
        ordersData.map((item) => {
          updateOrdersState({
            variables: {
              updateOrderStateId: item.id,
              state: "Wysłano",
            },
          })
            .then((data) => {
              const serializedShipping = JSON.stringify(shipping);
              localStorage.setItem("shippingData", serializedShipping);
              window.open(
                "http://localhost:3000/pdf/shippment",
                "_blank",
                "noreferrer"
              );
              navigate("/main/shipping");
            })
            .catch((err) => {
              console.log(err);
            });
          console.log(data);
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../../assets/logo.png")}
          alt="logo"
        />
        <div
          className={style.returnBox}
          onClick={() => navigate("/main/employees")}
        >
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <ErrorHandler error={error} />
      {loading && (
        <div className={style.spinnerBox}>
          <div className={style.spinner}>
            <Spinner />
          </div>
        </div>
      )}
      {!loading &&
        !loadingOrders &&
        !loadingShippings &&
        employees &&
        shippings &&
        orders && (
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
                        options={positonList}
                        title="Numer rejestracyjny"
                      />
                    </div>
                    <Input
                      name="date"
                      type="date"
                      fieldName="date"
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
