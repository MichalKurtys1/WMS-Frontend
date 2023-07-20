import { Form } from "react-final-form";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router";
import {
  GET_SUPPLIER,
  UPDATE_SUPPLIER,
} from "../../../utils/apollo/apolloMutations";
import {
  emailValidator,
  phoneValidator,
  textValidator,
} from "../../../utils/inputValidators";

import style from "./SuppliersEditPage.module.css";
import Input from "../../../components/Input";
import Spinner from "../../../components/Spiner";
import { FaAngleLeft, FaPen } from "react-icons/fa";

const SuppliersEditPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [getSupplier, { loading }] = useMutation(GET_SUPPLIER);
  const [updateSupplier, { error }] = useMutation(UPDATE_SUPPLIER);
  const [data, setData] = useState();

  useEffect(() => {
    getSupplier({
      variables: {
        getSupplierId: location.state.supplierId,
      },
    })
      .then((data) => {
        setData(data.data.getSupplier);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [getSupplier, location.state.supplierId]);

  const onSubmit = (values) => {
    updateSupplier({
      variables: {
        updateSupplierId: data.id,
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
          onClick={() => navigate("/main/suppliers")}
        >
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      {data && !loading && (
        <main>
          {error && error.message === "SUPPLIER DONT EXISTS" && (
            <p>Wystapił nieoczekiwany problem. Spróbuj ponownie za chwilę</p>
          )}
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

export default SuppliersEditPage;
