import { Form } from "react-final-form";
import { useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { GET_CLIENT, UPDATE_CLIENT } from "../../utils/apollo/apolloMutations";
import {
  emailValidator,
  phoneValidator,
  textValidator,
} from "../../utils/inputValidators";

import style from "../styles/addEditPages.module.css";
import Input from "../../components/Input";
import Spinner from "../../components/Spiner";
import { FaPen } from "react-icons/fa";
import ErrorHandler from "../../components/ErrorHandler";
import Header from "../../components/Header";

const ClientsEditPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [data, setData] = useState();
  const [getClient, { loading }] = useMutation(GET_CLIENT, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [updateClient, { updateLoading }] = useMutation(UPDATE_CLIENT, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  useEffect(() => {
    if (!location.state.clientId) return;

    getClient({
      variables: {
        getClientId: location.state.clientId,
      },
    }).then((data) => {
      if (!data.data) return;
      setData(data.data.getClient);
    });
  }, [getClient, location.state.clientId]);

  const onSubmit = (values) => {
    updateClient({
      variables: {
        updateClientId: data.id,
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
          update: true,
        },
      });
    });
  };

  return (
    <div className={style.container}>
      <Header path={"/clients"} />
      <ErrorHandler error={error} />
      {(loading || updateLoading) && <Spinner />}
      {data && (
        <main>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, invalid }) => (
              <form className={style.form} onSubmit={handleSubmit}>
                <h1>Edytowanie pracownika</h1>
                <p>
                  Edytuj wybrane dane. Pamiętaj, że wszystkie pola (oprócz NIP)
                  są wymagane.
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
                  <Input
                    name="NIP"
                    type="text"
                    fieldName="nip"
                    initVal={data.nip || "-"}
                    width="47%"
                  />
                  <button
                    disabled={invalid}
                    type="submit"
                    className={style.centered}
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

export default ClientsEditPage;
