import { Form } from "react-final-form";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router";
import {
  GET_PRODUCT,
  UPDATE_PRODUCT,
} from "../../utils/apollo/apolloMutations";
import { GET_SUPPLIERS } from "../../utils/apollo/apolloQueries";

import style from "../styles/addEditPages.module.css";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { selectValidator, textValidator } from "../../utils/inputValidators";
import ErrorHandler from "../../components/ErrorHandler";
import Header from "../../components/Header";
import Loading from "../../components/Loading";

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
    onCompleted: () => setError(false),
  });
  const [updateProduct, { loading: updateLoading }] = useMutation(
    UPDATE_PRODUCT,
    {
      onError: (error) => setError(error),
      onCompleted: () => setError(false),
    }
  );
  const { data: suppliersData, loading: loadingSuppliers } = useQuery(
    GET_SUPPLIERS,
    {
      onError: (error) => setError(error),
      onCompleted: () => setError(false),
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
    if (!location.state.userId) return;

    getProduct({
      variables: {
        getProductId: location.state.userId,
      },
    }).then((data) => {
      if (!data.data) return;
      setData(data.data.getProduct);
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
    }).then((data) => {
      if (!data.data) return;
      navigate("/products", {
        state: {
          update: true,
        },
      });
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
      <Header path={"/products"} />
      <ErrorHandler error={error} />
      <Loading
        state={(loading || updateLoading || loadingSuppliers) && !error}
      />
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
                    className={style.centered}
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
