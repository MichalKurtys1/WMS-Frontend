import { Form } from "react-final-form";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router";
import { GET_SUPPLIERS } from "../../../utils/apollo/apolloQueries";
import { ADD_PRODUCT, ADD_STOCK } from "../../../utils/apollo/apolloMutations";
import { selectValidator, textValidator } from "../../../utils/inputValidators";

import style from "./ProductsAddPage.module.css";
import Input from "../../../components/Input";
import Spinner from "../../../components/Spiner";
import Select from "../../../components/Select";
import { FaAngleLeft } from "react-icons/fa";
import ErrorHandler from "../../../components/ErrorHandler";

const unitItemsList = [
  { name: "Wybierz jednostkę" },
  { name: "szt" },
  { name: "op(4szt)" },
  { name: "op(6szt)" },
  { name: "op(8szt)" },
  { name: "op(12szt)" },
  { name: "op(16szt)" },
  { name: "op(24szt)" },
];

const ProductsAddPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [options, setOptions] = useState([]);
  const [addStock] = useMutation(ADD_STOCK);
  const [addProduct, { loading }] = useMutation(ADD_PRODUCT, {
    onError: (error) => setError(error),
  });
  const { data, loading: loadingSuppliers } = useQuery(GET_SUPPLIERS, {
    onError: (error) => setError(error),
  });

  useEffect(() => {
    if (data && !loadingSuppliers) {
      setOptions([
        { name: "Wybierz Dostawcę", value: null },
        ...data.suppliers.map((item) => ({
          name: item.name,
          value: item.name,
        })),
      ]);
    }
  }, [data, loadingSuppliers]);

  const onSubmit = (values) => {
    console.log(values);
    addProduct({
      variables: {
        supplierId: values.supplier,
        name: values.name,
        type: values.type,
        capacity: values.capacity,
        unit: values.unit,
        pricePerUnit: parseInt(values.pricePerUnit),
      },
    })
      .then((data) => {
        addStock({
          variables: {
            productId: data.data.createProduct.id,
          },
        })
          .then((data) => {
            navigate("/products", {
              state: {
                userData: data.data.createProduct,
              },
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../../assets/logo.png")}
          alt="logo"
        />
        <div className={style.returnBox} onClick={() => navigate("/products")}>
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <ErrorHandler error={error} />
      {(loading || loadingSuppliers) && (
        <div className={style.spinnerBox}>
          <div className={style.spinner}>
            <Spinner />
          </div>
        </div>
      )}
      {(!loading || !loadingSuppliers) && (
        <main>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, invalid }) => (
              <form className={style.form} onSubmit={handleSubmit}>
                <h1>Dodawanie produktu</h1>
                <p>
                  Uzupełnij dane żeby dodać nowy produkt do systemu. Pamiętaj,
                  że wszystke pola są obowiązkowe.
                </p>
                <div className={style.inputBox}>
                  <div className={style.selectBox}>
                    <Select
                      fieldName="supplier"
                      validator={selectValidator}
                      options={options}
                    />
                  </div>
                  <Input
                    name="Nazwa"
                    type="text"
                    fieldName="name"
                    validator={textValidator}
                    width="47%"
                  />
                  <Input
                    name="Typ"
                    type="text"
                    fieldName="type"
                    validator={textValidator}
                    width="47%"
                  />
                  <Input
                    name="Pojemoność"
                    type="text"
                    fieldName="capacity"
                    validator={textValidator}
                    width="47%"
                  />
                  <div className={style.selectBox}>
                    <Select
                      fieldName="unit"
                      validator={selectValidator}
                      options={unitItemsList}
                    />
                  </div>
                  <Input
                    name="Cena za jednostkę"
                    type="number"
                    fieldName="pricePerUnit"
                    validator={textValidator}
                    width="47%"
                  />
                  <button
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

export default ProductsAddPage;
