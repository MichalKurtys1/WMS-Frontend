import { Form } from "react-final-form";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router";
import {
  emailValidator,
  phoneValidator,
  selectValidator,
  textValidator,
} from "../../../utils/inputValidators";

import style from "./EmployeeAddPage.module.css";
import Input from "../../../components/Input";
import Spinner from "../../../components/Spiner";
import Select from "../../../components/Select";
import { FaAngleLeft, FaPlus } from "react-icons/fa";
import { ADD_EMPLOYEE } from "../../../utils/apollo/apolloMutations";

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

const EmployeeAddPage = () => {
  const navigate = useNavigate();
  const [addEmployee, { loading, error }] = useMutation(ADD_EMPLOYEE);

  const onSubmit = (values) => {
    addEmployee({
      variables: {
        email: values.email,
        firstname: values.name,
        lastname: values.surname,
        phone: values.phone,
        magazine: values.warehouse,
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
        <div
          className={style.returnBox}
          onClick={() => navigate("/main/employees")}
        >
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
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
              <h1>Dodawanie pracownika</h1>
              <p>
                Uzupełnij dane żeby dodać nowego pracownika do systemu.
                Tymczasowe hasło zostanie mu wysłane na jego email.
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
                        fieldName="warehouse"
                        validator={selectValidator}
                        options={warehouseList}
                        title="Magazny"
                      />
                    </div>
                    <div className={style.selectBox}>
                      <Select
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
