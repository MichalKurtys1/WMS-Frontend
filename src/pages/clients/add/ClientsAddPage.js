import { Form } from "react-final-form";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router";
import { ADD_CLIENT } from "../../../utils/apollo/apolloMutations";
import {
  emailValidator,
  phoneValidator,
  textValidator,
} from "../../../utils/inputValidators";

import style from "./ClientsAddPage.module.css";
import Input from "../../../components/Input";
import Spinner from "../../../components/Spiner";
import { FaAngleLeft, FaPlus } from "react-icons/fa";
import { useState } from "react";
import ErrorHandler from "../../../components/ErrorHandler";

const ClientsAddPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [addClient, { loading }] = useMutation(ADD_CLIENT, {
    onError: (error) => setError(error),
  });

  const onSubmit = (values) => {
    addClient({
      variables: {
        name: values.name,
        email: values.email,
        phone: values.phone,
        city: values.city,
        street: values.street,
        number: values.number,
        nip: values.nip,
      },
    })
      .then((data) => {
        navigate("/clients", {
          state: {
            userData: data.data.createClient,
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
        <div className={style.returnBox} onClick={() => navigate("/clients")}>
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
      {!loading && (
        <main>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, invalid }) => (
              <form className={style.form} onSubmit={handleSubmit}>
                <h1>Dodawanie klienta</h1>
                <p>
                  Uzupełnij dane żeby dodać nowego klienta do systemu. Dane
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
                  <Input name="NIP" type="text" fieldName="nip" width="47%" />
                  <button
                    disabled={invalid}
                    type="submit"
                    style={{ backgroundColor: invalid ? "#B6BABF" : null }}
                  >
                    <FaPlus className={style.icon} />
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

export default ClientsAddPage;
