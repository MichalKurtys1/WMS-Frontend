import { Form } from "react-final-form";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router";
import { ADD_CLIENT } from "../../utils/apollo/apolloMutations";
import {
  emailValidator,
  phoneValidator,
  textValidator,
} from "../../utils/inputValidators";

import style from "../styles/addEditPages.module.css";
import Input from "../../components/Input";
import Spinner from "../../components/Spiner";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import ErrorHandler from "../../components/ErrorHandler";
import Header from "../../components/Header";

const ClientsAddPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [addClient, { loading }] = useMutation(ADD_CLIENT, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
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
    }).then((data) => {
      if (!data.data) return;
      navigate("/clients", {
        state: {
          userData: data.data.createClient,
        },
      });
    });
  };

  return (
    <div className={style.container}>
      <Header path={"/clients"} />
      <ErrorHandler error={error} />
      {loading && !error && <Spinner />}
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
                    className={style.centered}
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
