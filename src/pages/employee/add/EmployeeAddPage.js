import { Form } from "react-final-form";
import Input from "../../../components/Input";
import style from "./EmployeeAddPage.module.css";
import { FaPlus } from "react-icons/fa";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router";
import Spinner from "../../../components/Spiner";
import Select from "../../../components/Select";

const REGISTER = gql`
  mutation Mutation(
    $email: String!
    $firstname: String!
    $lastname: String!
    $phone: String!
    $magazine: String!
    $position: String!
    $adres: String!
  ) {
    createUser(
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

const adressValidator = (value) => {
  if (!value) {
    return "Proszę podać adres zamieszkania";
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

const EmployeeAddPage = () => {
  const navigate = useNavigate();
  const [register, { loading, error }] = useMutation(REGISTER);
  const onSubmit = (values) => {
    register({
      variables: {
        email: values.email,
        firstname: values.name,
        lastname: values.surname,
        phone: values.phone,
        magazine: values.magazine,
        position: values.position,
        adres: values.adres,
      },
    })
      .then((data) => {
        navigate("/main/employees", {
          state: {
            userData: data.data.createUser,
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
          <p>Dodawanie</p>
        </div>
      </div>
      <main>
        {error && error.message === "EMAIL TAKEN" && (
          <p className={style.errorText}>Podany email jest już zajęty</p>
        )}
        {error && error.message === "SERVER_ERROR" && (
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
                    />
                    <Input
                      name="Numer telefonu"
                      type="tel"
                      fieldName="phone"
                      validator={telValidator}
                    />
                    <Input
                      name="Nazwisko"
                      type="text"
                      fieldName="surname"
                      validator={surnameValidator}
                    />
                    <Input
                      name="Adres e-mail"
                      type="email"
                      fieldName="email"
                      validator={emailValidator}
                    />
                    <Input
                      name="Adres zamieszkania"
                      type="text"
                      fieldName="adres"
                      validator={adressValidator}
                    />
                    <div className={style.selectBox}>
                      <Select
                        fieldName="magazine"
                        validator={selectValidator}
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
                      <FaPlus className={style.icon} />
                      Dodaj
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
        />
      </main>
    </div>
  );
};

export default EmployeeAddPage;
