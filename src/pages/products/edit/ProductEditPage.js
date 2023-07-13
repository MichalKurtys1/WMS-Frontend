import { Form } from "react-final-form";
import Input from "../../../components/Input";
import style from "./ProductEditPage.module.css";
import { FaAngleLeft } from "react-icons/fa";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router";
import Spinner from "../../../components/Spiner";
import { useEffect, useState } from "react";
import Select from "../../../components/Select";

const GET_PRODUCT = gql`
  mutation Mutation($getProductId: String!) {
    getProduct(id: $getProductId) {
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

const UPDATEPRODUCT = gql`
  mutation Mutation(
    $updateProductId: String!
    $supplierId: ID!
    $name: String!
    $type: String!
    $capacity: String!
    $unit: String!
    $pricePerUnit: Float!
  ) {
    updateProduct(
      id: $updateProductId
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
  if (!value || value.includes("Wybierz")) {
    return "Wybierz jedną z opcji";
  }
};

const capacityValidator = (value) => {
  if (!value) {
    return "Proszę podać pojemnośc produktu";
  }
  return undefined;
};

const ProductEditPage = () => {
  const navigate = useNavigate();
  const [getProduct, { loading }] = useMutation(GET_PRODUCT);
  const [updateProduct, { error }] = useMutation(UPDATEPRODUCT);
  const location = useLocation();
  const [data, setData] = useState();
  const { data: suppliersData, loading: loadingSuppliers } =
    useQuery(GET_SUPPLIERS);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (suppliersData && !loadingSuppliers) {
      setOptions([
        { name: "Wybierz Dostawcę", value: null },
        ...suppliersData.suppliers.map((item) => ({
          name: item.name,
          value: item.name,
        })),
      ]);
    }
  }, [suppliersData, loadingSuppliers]);

  useEffect(() => {
    getProduct({
      variables: {
        getProductId: location.state.userId,
      },
    })
      .then((data) => {
        setData(data.data.getProduct);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [getProduct, location.state.userId]);

  const onSubmit = (values) => {
    console.log(values);
    console.log(data.id);
    updateProduct({
      variables: {
        updateProductId: data.id,
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
            update: true,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getSupplierHandler = () => {
    const supplier = suppliersData.suppliers.filter(
      (item) => item.id === data.supplierId
    );
    return supplier[0].name;
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
      {data && !loading && (
        <main>
          {error && error.message === "USER DONT EXISTS" && (
            <p>Wystapił nieoczekiwany problem. Spróbuj ponownie za chwilę</p>
          )}
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, invalid }) => (
              <form className={style.form} onSubmit={handleSubmit}>
                <h1>Edytowanie pracownika</h1>
                <p>
                  Edytuj wybrane dane. Pamiętaj, że wszystkie pola są wymagane.
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
                          initVal={getSupplierHandler()}
                        />
                      </div>
                      <Input
                        name="Nazwa"
                        type="text"
                        fieldName="name"
                        validator={nameValidator}
                        width="47%"
                        initVal={data.name}
                      />
                      <Input
                        name="Typ"
                        type="text"
                        fieldName="type"
                        validator={typeValidator}
                        width="47%"
                        initVal={data.type}
                      />
                      <Input
                        name="Pojemoność"
                        type="text"
                        fieldName="capacity"
                        validator={capacityValidator}
                        width="47%"
                        initVal={data.capacity}
                      />
                      <div className={style.selectBox}>
                        <Select
                          fieldName="unit"
                          validator={selectValidator}
                          options={unitItemsList}
                          initVal={data.unit}
                        />
                      </div>
                      <Input
                        name="Cena za jednostkę"
                        type="number"
                        fieldName="pricePerUnit"
                        validator={priceValidator}
                        width="47%"
                        initVal={data.pricePerUnit}
                      />
                      <button
                        disabled={invalid}
                        type="submit"
                        style={{ backgroundColor: invalid ? "#B6BABF" : null }}
                      >
                        Edytuj
                      </button>
                    </>
                  )}
                </div>
              </form>
            )}
          />
        </main>
      )}
    </div>
  );
};

export default ProductEditPage;
