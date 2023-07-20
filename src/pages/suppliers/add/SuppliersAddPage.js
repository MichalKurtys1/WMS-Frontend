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
import { FaAngleLeft, FaPlus } from "react-icons/fa";

const SuppliersAddPage = () => {
  const navigate = useNavigate();
  const [addSupplier, { loading, error }] = useMutation(ADD_SUPPLIER);

  const onSubmit = (values) => {
    addSupplier({
      variables: {
        name: values.name,
        email: values.email,
        phone: values.phone,
        city: values.city,
        street: values.street,
        number: values.number,
      },
    })
      .then((data) => {
        navigate("/main/suppliers", {
          state: {
            userData: data.data.createSupplier,
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
          onClick={() => navigate("/main/suppliers")}
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
              <h1>Dodawanie dostawcy</h1>
              <p>
                Uzupełnij dane żeby dodać nowego dostawce do systemu. Dane
                oznaczone gwiazdką są obowiązkowe.
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

export default SuppliersAddPage;
