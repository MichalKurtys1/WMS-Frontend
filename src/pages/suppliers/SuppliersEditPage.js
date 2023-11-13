import { Form } from "react-final-form";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GET_SUPPLIER,
  UPDATE_SUPPLIER,
} from "../../utils/apollo/apolloMutations";
import {
  emailValidator,
  phoneValidator,
  textValidator,
} from "../../utils/inputValidators";

import style from "../styles/addEditPages.module.css";
import Input from "../../components/Input";
import { FaPen } from "react-icons/fa";
import ErrorHandler from "../../components/ErrorHandler";
import Header from "../../components/Header";
import Loading from "../../components/Loading";

const SuppliersEditPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [data, setData] = useState();
  const [getSupplier, { loading }] = useMutation(GET_SUPPLIER, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [updateSupplier, { loading: updateLoading }] = useMutation(
    UPDATE_SUPPLIER,
    {
      onError: (error) => setError(error),
      onCompleted: () => setError(false),
    }
  );

  useEffect(() => {
    if (!location.state.supplierId) return;

    getSupplier({
      variables: {
        getSupplierId: location.state.supplierId,
      },
    }).then((data) => {
      if (!data.data) return;
      setData(data.data.getSupplier);
    });
  }, [getSupplier, location.state.supplierId]);

  const onSubmit = (values) => {
    if (!data) return;
    updateSupplier({
      variables: {
        updateSupplierId: data.id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        city: values.city,
        street: values.street,
        number: values.number,
        bank: values.bank,
        accountNumber: values.accountNumber,
        nip: values.nip,
      },
    }).then((data) => {
      if (!data.data) return;
      navigate("/suppliers", {
        state: {
          update: true,
        },
      });
    });
  };

  return (
    <div className={style.container}>
      <Header path={"/suppliers"} />
      <ErrorHandler error={error} />
      <Loading state={(loading || updateLoading) && !error} />
      {data && (
        <main>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, invalid }) => (
              <form className={style.form} onSubmit={handleSubmit}>
                <h1>Edytowanie dostawcy</h1>
                <p>
                  Edytuj wybrane dane. Pamiętaj, że wszystkie pola są wymagane.
                </p>
                <div className={style.inputBox}>
                  <Input
                    name="Nazwa *"
                    type="text"
                    fieldName="name"
                    validator={textValidator}
                    initVal={data.name}
                    width="47%"
                  />
                  <Input
                    name="Numer telefonu *"
                    type="tel"
                    fieldName="phone"
                    validator={phoneValidator}
                    initVal={data.phone}
                    width="47%"
                  />
                  <Input
                    name="Adres e-mail *"
                    type="email"
                    fieldName="email"
                    validator={emailValidator}
                    initVal={data.email}
                    width="100%"
                  />
                  <Input
                    name="Nazwa banku"
                    initVal={data.bank}
                    type="text"
                    fieldName="bank"
                    validator={textValidator}
                    width="100%"
                  />
                  <Input
                    name="Numer konta"
                    initVal={data.accountNumber}
                    type="text"
                    fieldName="accountNumber"
                    validator={textValidator}
                    width="100%"
                  />
                  <Input
                    name="NIP"
                    initVal={data.nip}
                    type="text"
                    fieldName="nip"
                    validator={textValidator}
                    width="47%"
                  />
                  <Input
                    name="Miejscowość *"
                    type="text"
                    fieldName="city"
                    validator={textValidator}
                    initVal={data.city}
                    width="47%"
                  />
                  <Input
                    name="Ulica *"
                    type="text"
                    fieldName="street"
                    initVal={data.street}
                    width="47%"
                  />
                  <Input
                    name="Numer *"
                    type="number"
                    fieldName="number"
                    validator={textValidator}
                    initVal={data.number}
                    width="47%"
                  />
                  <button
                    disabled={invalid}
                    type="submit"
                    className={style.centered}
                    style={{ backgroundColor: invalid ? "#B6BABF" : null }}
                    data-testid="SubmitBtn"
                  >
                    <FaPen className={style.icon} />
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

export default SuppliersEditPage;
