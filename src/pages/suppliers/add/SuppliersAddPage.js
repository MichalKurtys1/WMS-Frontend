import { Form } from "react-final-form";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router";
import { ADD_SUPPLIER } from "../../../utils/apollo/apolloMutations";
import {
  emailValidator,
  phoneValidator,
  textValidator,
} from "../../../utils/inputValidators";

import style from "./SuppliersAddPage.module.css";
import Input from "../../../components/Input";
import Spinner from "../../../components/Spiner";
import { FaAngleLeft } from "react-icons/fa";
import { useState } from "react";
import ErrorHandler from "../../../components/ErrorHandler";

const SuppliersAddPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [addSupplier, { loading }] = useMutation(ADD_SUPPLIER, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  const onSubmit = (values) => {
    addSupplier({
      variables: {
        name: values.name,
        email: values.email,
        phone: values.phone,
        city: values.city,
        street: values.street,
        number: values.number,
        nip: values.nip,
        bank: values.bank,
        accountNumber: values.accountNumber,
      },
    }).then((data) => {
      if (!data.data) return;
      navigate("/suppliers", {
        state: {
          userData: data.data.createSupplier,
        },
      });
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
      {loading && !error && <Spinner />}
      {!loading && (
        <main>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, invalid }) => (
              <form className={style.form} onSubmit={handleSubmit}>
                <h1>Dodawanie dostawcy</h1>
                <p>
                  Uzupełnij dane żeby dodać nowego dostawce do systemu. Dane
                  oznaczone gwiazdką są obowiązkowe.
                </p>
                <div className={style.inputBox}>
                  <Input
                    name="Nazwa *"
                    type="text"
                    fieldName="name"
                    validator={textValidator}
                    width="47%"
                  />
                  <Input
                    name="Numer telefonu *"
                    type="tel"
                    fieldName="phone"
                    validator={phoneValidator}
                    width="47%"
                  />
                  <Input
                    name="Adres e-mail *"
                    type="email"
                    fieldName="email"
                    validator={emailValidator}
                    width="100%"
                  />
                  <Input
                    name="Nazwa banku"
                    type="text"
                    fieldName="bank"
                    validator={textValidator}
                    width="100%"
                  />
                  <Input
                    name="Numer konta"
                    type="text"
                    fieldName="accountNumber"
                    validator={textValidator}
                    width="100%"
                  />
                  <Input
                    name="NIP"
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
                    width="47%"
                  />
                  <Input
                    name="Ulica *"
                    type="text"
                    fieldName="street"
                    width="47%"
                  />
                  <Input
                    name="Numer *"
                    type="number"
                    fieldName="number"
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

export default SuppliersAddPage;
