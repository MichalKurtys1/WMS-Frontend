import { Form } from "react-final-form";
import { useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  GET_EMPLOYEE,
  UPDATE_EMPLOYEE,
} from "../../../utils/apollo/apolloMutations";
import {
  emailValidator,
  phoneValidator,
  selectValidator,
  textValidator,
} from "../../../utils/inputValidators";

import style from "./EmployeeEditPage.module.css";
import Spinner from "../../../components/Spiner";
import Select from "../../../components/Select";
import Input from "../../../components/Input";
import { FaAngleLeft, FaPen } from "react-icons/fa";

const warehouseList = [
  { name: "Wybierz Magazyn" },
  { name: "Centralny" },
  {
    name: "ul. Cicha 2 Bydgoszcz",
  },
  {
    name: "ul. Głośna 12 Bydgoszcz",
  },
];

const positonList = [
  { name: "Wybierz Stanowisko" },
  { name: "Magazynier" },
  { name: "Księgowy" },
  { name: "Menadżer" },
];

const EmployeeEditPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [getEmployee, { loading }] = useMutation(GET_EMPLOYEE);
  const [updateEmployee, { error }] = useMutation(UPDATE_EMPLOYEE);
  const [data, setData] = useState();

  useEffect(() => {
    getEmployee({
      variables: {
        getUserId: location.state.userId,
      },
    })
      .then((data) => {
        setData(data.data.getUser);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [getEmployee, location.state.userId]);

  const onSubmit = (values) => {
    updateEmployee({
      variables: {
        updateUserId: data.id,
        email: values.email,
        firstname: values.name,
        lastname: values.surname,
        phone: values.phone,
        magazine: values.magazine,
        position: values.position,
        adres: values.adress,
      },
    })
      .then((data) => {
        navigate("/main/employees", {
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
        <div
          className={style.returnBox}
          onClick={() => navigate("/main/employees")}
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
                  {loading ? (
                    <div className={style.spinnerBox}>
                      <div className={style.spinner}>
                        <Spinner />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Input
                        name="Imię"
                        type="text"
                        fieldName="name"
                        validator={textValidator}
                        initVal={data.firstname}
                        width="47%"
                      />
                      <Input
                        name="Nazwisko"
                        type="text"
                        fieldName="surname"
                        validator={textValidator}
                        initVal={data.lastname}
                        width="47%"
                      />

                      <Input
                        name="Adres e-mail"
                        type="email"
                        fieldName="email"
                        validator={emailValidator}
                        initVal={data.email}
                        width="100%"
                      />
                      <Input
                        name="Numer telefonu"
                        type="number"
                        fieldName="phone"
                        validator={phoneValidator}
                        initVal={data.phone}
                        width="47%"
                      />
                      <Input
                        name="Adres zamieszkania"
                        type="text"
                        fieldName="adress"
                        validator={textValidator}
                        initVal={data.adres}
                        width="47%"
                      />
                      <div className={style.selectBox}>
                        <Select
                          fieldName="magazine"
                          validator={selectValidator}
                          initVal={data.magazine}
                          options={warehouseList}
                          title="Magazny"
                        />
                      </div>
                      <div className={style.selectBox}>
                        <Select
                          fieldName="position"
                          validator={selectValidator}
                          initVal={data.position}
                          options={positonList}
                          title="Stanowisko"
                        />
                      </div>
                      <button
                        disabled={invalid}
                        type="submit"
                        style={{ backgroundColor: invalid ? "#B6BABF" : null }}
                      >
                        <FaPen className={style.icon} />
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

export default EmployeeEditPage;
