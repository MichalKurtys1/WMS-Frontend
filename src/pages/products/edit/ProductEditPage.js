import { Form } from "react-final-form";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router";
import {
  GET_PRODUCT,
  UPDATE_PRODUCT,
} from "../../../utils/apollo/apolloMutations";
import { GET_SUPPLIERS } from "../../../utils/apollo/apolloQueries";

import style from "./ProductEditPage.module.css";
import Input from "../../../components/Input";
import Spinner from "../../../components/Spiner";
import Select from "../../../components/Select";
import { FaAngleLeft } from "react-icons/fa";
import { selectValidator, textValidator } from "../../../utils/inputValidators";
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

const ProductEditPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [options, setOptions] = useState([]);
  const [error, setError] = useState();

  const [getProduct, { loading }] = useMutation(GET_PRODUCT, {
    onError: (error) => setError(error),
  });
  const [updateProduct, { loading: updateLoading }] = useMutation(
    UPDATE_PRODUCT,
    {
      onError: (error) => setError(error),
    }
  );
  const { data: suppliersData, loading: loadingSuppliers } = useQuery(
    GET_SUPPLIERS,
    {
      onError: (error) => setError(error),
    }
  );

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
        navigate("/products", {
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
        <div className={style.returnBox} onClick={() => navigate("/products")}>
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <ErrorHandler error={error} />
      {(loading || updateLoading || loadingSuppliers) && (
        <div className={style.spinnerBox}>
          <div className={style.spinner}>
            <Spinner />
          </div>
        </div>
      )}
      {data && (
        <main>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, invalid }) => (
              <form className={style.form} onSubmit={handleSubmit}>
                <h1>Edytowanie produktu</h1>
                <p>
                  Edytuj wybrane dane. Pamiętaj, że wszystkie pola są wymagane.
                </p>
                <div className={style.inputBox}>
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
                    validator={textValidator}
                    width="47%"
                    initVal={data.name}
                  />
                  <Input
                    name="Typ"
                    type="text"
                    fieldName="type"
                    validator={textValidator}
                    width="47%"
                    initVal={data.type}
                  />
                  <Input
                    name="Pojemoność"
                    type="text"
                    fieldName="capacity"
                    validator={textValidator}
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
                    validator={textValidator}
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
