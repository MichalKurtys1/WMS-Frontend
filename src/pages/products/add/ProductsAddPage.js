import { Form } from "react-final-form";
import Input from "../../../components/Input";
import style from "./ProductsAddPage.module.css";
import { FaAngleLeft } from "react-icons/fa";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router";
import Spinner from "../../../components/Spiner";
import Select from "../../../components/Select";
import { useEffect, useState } from "react";

const ADD_PRODUCT = gql`
  mutation Mutation(
    $supplierId: ID!
    $name: String!
    $type: String!
    $capacity: String!
    $unit: String!
    $pricePerUnit: Float!
  ) {
    createProduct(
      supplierId: $supplierId
      name: $name
      type: $type
      capacity: $capacity
      unit: $unit
      pricePerUnit: $pricePerUnit
    ) {
      id
      supplierId
      name
      type
      capacity
      unit
      pricePerUnit
    }
  }
`;

const GET_SUPPLIERS = gql`
  query Query {
    suppliers {
      id
      name
      phone
      email
      city
      street
      number
    }
  }
`;

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

const nameValidator = (value) => {
  if (!value) {
    return "Proszę podać nazwę produktu";
  }
  return undefined;
};

const priceValidator = (value) => {
  if (!value) {
    return "Proszę podać cene produktu";
  }
  return undefined;
};

const typeValidator = (value) => {
  if (!value) {
    return "Proszę podać typ produktu";
  }
  return undefined;
};

const selectValidator = (value) => {
  if (!value) {
    return "Wybierz jedną z opcji";
  }
  if (value.includes("Wybierz")) {
    return "Wybierz jedną z opcji";
  }

  return undefined;
};

const capacityValidator = (value) => {
  if (!value) {
    return "Proszę podać pojemnośc produktu";
  }
  return undefined;
};

const ProductsAddPage = () => {
  const navigate = useNavigate();
  const [addProduct, { loading, error }] = useMutation(ADD_PRODUCT);
  const { data, loading: loadingSuppliers } = useQuery(GET_SUPPLIERS);
  const [options, setOptions] = useState([]);

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
        navigate("/main/products", {
          state: {
            userData: data.data.createUser,
          },
        });
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
        <div
          className={style.returnBox}
          onClick={() => navigate("/main/products")}
        >
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <main>
        {error && error.message === "EMAIL TAKEN" && (
          <p className={style.errorText}>Podany email jest już zajęty</p>
        )}
        {error && error.message === "SERVER_ERROR" && (
          <p>Wystapił nieoczekiwany problem. Spróbuj ponownie za chwilę</p>
        )}
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, invalid }) => (
            <form className={style.form} onSubmit={handleSubmit}>
              <h1>Dodawanie produktu</h1>
              <p>
                Uzupełnij dane żeby dodać nowy produkt do systemu. Pamiętaj, że
                wszystke pola są obowiązkowe.
              </p>
              <div className={style.inputBox}>
                {loading && (
                  <div className={style.spinnerBox}>
                    <div className={style.spinner}>
                      <Spinner />
                    </div>
                  </div>
                )}
                {!loading && (
                  <>
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
                      validator={nameValidator}
                      width="47%"
                    />
                    <Input
                      name="Typ"
                      type="text"
                      fieldName="type"
                      validator={typeValidator}
                      width="47%"
                    />
                    <Input
                      name="Pojemoność"
                      type="text"
                      fieldName="capacity"
                      validator={capacityValidator}
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
                      validator={priceValidator}
                      width="47%"
                    />
                    <button
                      disabled={invalid}
                      type="submit"
                      style={{ backgroundColor: invalid ? "#B6BABF" : null }}
                    >
                      Dodaj
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
        />
      </main>
    </div>
  );
};

export default ProductsAddPage;
