import { Form } from "react-final-form";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router";
import {
  GET_SUPPLIER,
  UPDATE_SUPPLIER,
} from "../../../utils/apollo/apolloMutations";
import {
  emailValidator,
  phoneValidator,
  textValidator,
} from "../../../utils/inputValidators";

import style from "./SuppliersEditPage.module.css";
import Input from "../../../components/Input";
import Spinner from "../../../components/Spiner";
import { FaAngleLeft, FaPen } from "react-icons/fa";
import ErrorHandler from "../../../components/ErrorHandler";

const SuppliersEditPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [data, setData] = useState();
  const [getSupplier, { loading }] = useMutation(GET_SUPPLIER, {
    onError: (error) => setError(error),
  });
  const [updateSupplier, { loading: updateLoading }] = useMutation(
    UPDATE_SUPPLIER,
    {
      onError: (error) => setError(error),
    }
  );

  useEffect(() => {
    getSupplier({
      variables: {
        getSupplierId: location.state.supplierId,
      },
    })
      .then((data) => {
        setData(data.data.getSupplier);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [getSupplier, location.state.supplierId]);

  const onSubmit = (values) => {
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
    })
      .then((data) => {
        navigate("/suppliers", {
          state: {
            update: true,
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
        <div className={style.returnBox} onClick={() => navigate("/suppliers")}>
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <ErrorHandler error={error} />
      {(loading || updateLoading) && (
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
                    style={{ backgroundColor: invalid ? "#B6BABF" : null }}
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
