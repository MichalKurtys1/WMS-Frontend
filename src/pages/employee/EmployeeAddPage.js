import { Form } from "react-final-form";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router";
import {
  emailValidator,
  phoneValidator,
  selectValidator,
  textValidator,
} from "../../utils/inputValidators";

import style from "../styles/addEditPages.module.css";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { FaPlus } from "react-icons/fa";
import { ADD_EMPLOYEE } from "../../utils/apollo/apolloMutations";
import { useState } from "react";
import ErrorHandler from "../../components/ErrorHandler";
import Header from "../../components/Header";
import Loading from "../../components/Loading";

const positonList = [
  { name: "Wybierz Stanowisko" },
  { name: "Magazynier" },
  { name: "Księgowy" },
  { name: "Menadżer" },
  { name: "Przewoźnik" },
];

const EmployeeAddPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [addEmployee, { loading }] = useMutation(ADD_EMPLOYEE, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  const onSubmit = (values) => {
    addEmployee({
      variables: {
        email: values.email,
        firstname: values.name,
        lastname: values.surname,
        phone: values.phone,
        position: values.position,
        adres: values.adres,
      },
    }).then((data) => {
      if (!data.data) return;
      navigate("/employees", {
        state: {
          userData: data.data.createUser,
        },
      });
    });
  };

  return (
    <div className={style.container}>
      <Header path={"/employees"} />
      <ErrorHandler error={error} />
      <Loading state={loading && !error} />
      {!loading && (
        <main>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, invalid }) => (
              <form className={style.form} onSubmit={handleSubmit}>
                <h1>Dodawanie pracownika</h1>
                <p>
                  Uzupełnij dane żeby dodać nowego pracownika do systemu.
                  Tymczasowe hasło zostanie mu wysłane na jego email.
                </p>
                <div className={style.inputBox}>
                  <Input
                    name="Imię"
                    type="text"
                    fieldName="name"
                    validator={textValidator}
                    width="47%"
                  />
                  <Input
                    name="Nazwisko"
                    type="text"
                    fieldName="surname"
                    validator={textValidator}
                    width="47%"
                  />
                  <Input
                    name="Adres e-mail"
                    type="email"
                    fieldName="email"
                    validator={emailValidator}
                    width="100%"
                  />
                  <Input
                    name="Numer telefonu"
                    type="tel"
                    fieldName="phone"
                    validator={phoneValidator}
                    width="47%"
                  />
                  <Input
                    name="Adres zamieszkania"
                    type="text"
                    fieldName="adres"
                    validator={textValidator}
                    width="47%"
                  />
                  <div className={style.selectBox}>
                    <Select
                      name="Wybierz Stanowisko"
                      fieldName="position"
                      validator={selectValidator}
                      options={positonList}
                      title="Stanowisko"
                    />
                  </div>
                  <button
                    disabled={invalid}
                    type="submit"
                    style={{ backgroundColor: invalid ? "#B6BABF" : null }}
                    data-testid="SubmitBtn"
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

export default EmployeeAddPage;
