import { Form } from "react-final-form";
import Input from "../../../components/Input";
import style from "./EmployeeEditPage.module.css";
import { FaPen } from "react-icons/fa";
import { gql, useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router";
import Spinner from "../../../components/Spiner";
import { useEffect, useState } from "react";
import Select from "../../../components/Select";

const GETUSER = gql`
  mutation Mutation($getUserId: String!) {
    getUser(id: $getUserId) {
      id
      email
      firstname
      lastname
      phone
      magazine
      position
      adres
    }
  }
`;

const UPDATEUSER = gql`
  mutation Mutation(
    $updateUserId: String!
    $email: String!
    $firstname: String!
    $lastname: String!
    $phone: String!
    $magazine: String!
    $position: String!
    $adres: String!
  ) {
    updateUser(
      id: $updateUserId
      email: $email
      firstname: $firstname
      lastname: $lastname
      phone: $phone
      magazine: $magazine
      position: $position
      adres: $adres
    ) {
      id
      email
      firstname
      lastname
      phone
      magazine
      position
      adres
    }
  }
`;

const nameValidator = (value) => {
  if (!value) {
    return "Proszę podać imię";
  }
  return undefined;
};

const surnameValidator = (value) => {
  if (!value) {
    return "Proszę podać nazwisko";
  }
  return undefined;
};

const emailValidator = (value) => {
  if (!value) {
    return "Proszę podać email";
  }
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return "Nie jest to email";
  }
  return undefined;
};

const selectValidator = (value) => {
  if (!value) {
    return "Wybierz jedną z opcji";
  }
  if (value.includes("Wybierz")) {
    return "Wybierz jedną z opcji";
  }

  return undefined;
};

const telValidator = (value) => {
  const phoneNumberRegex = /^\+?[1-9][0-9]{8}$/;
  if (!phoneNumberRegex.test(value)) {
    return "Nie podano numeru telefonu";
  }
  return undefined;
};

const EmployeeEditPage = () => {
  const navigate = useNavigate();
  const [getUser, { loading }] = useMutation(GETUSER);
  const [updateUser, { error }] = useMutation(UPDATEUSER);
  const location = useLocation();
  const [data, setData] = useState();

  useEffect(() => {
    getUser({
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
  }, [getUser, location.state.userId]);

  const onSubmit = (values) => {
    updateUser({
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
        <div className={style.titleDescription}>
          <h1>Pracownicy</h1>
          <p>Edytowanie</p>
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
                <div className={style.inputBox}>
                  {loading && (
                    <div className={style.spinnerBox}>
                      <div className={style.spinner}>
                        <Spinner />
                      </div>
                    </div>
                  )}
                  {!loading && (
                    <>
                      <Input
                        name="Imię"
                        type="text"
                        fieldName="name"
                        validator={nameValidator}
                        initVal={data.firstname}
                      />
                      <Input
                        name="Numer telefonu"
                        type="number"
                        fieldName="phone"
                        validator={telValidator}
                        initVal={data.phone}
                      />
                      <Input
                        name="Nazwisko"
                        type="text"
                        fieldName="surname"
                        validator={surnameValidator}
                        initVal={data.lastname}
                      />
                      <Input
                        name="Adres e-mail"
                        type="email"
                        fieldName="email"
                        validator={emailValidator}
                        initVal={data.email}
                      />
                      <Input
                        name="Adres zamieszkania"
                        type="text"
                        fieldName="adress"
                        initVal={data.adres}
                      />
                      <div className={style.selectBox}>
                        <Select
                          fieldName="magazine"
                          validator={selectValidator}
                          initVal={data.magazine}
                          options={[
                            { name: "Wybierz Magazyn", value: null },
                            { name: "Centralny", value: "Centralny" },
                            {
                              name: "ul. Cicha 2 Bydgoszcz",
                              value: "ul. Cicha 2",
                            },
                            {
                              name: "ul. Głośna 12 Bydgoszcz",
                              value: "ul. Głośna 12",
                            },
                          ]}
                          title="Magazny"
                        />
                      </div>
                      <div className={style.selectBox}>
                        <Select
                          fieldName="position"
                          validator={selectValidator}
                          initVal={data.position}
                          options={[
                            { name: "Wybierz Stanowisko", value: null },
                            { name: "Magazynier", value: "Magazynier" },
                            { name: "Księgowy", value: "Księgowy" },
                            { name: "Menadżer", value: "Menadżer" },
                          ]}
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
