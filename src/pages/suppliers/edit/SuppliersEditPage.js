import { Form } from "react-final-form";
import Input from "../../../components/Input";
import style from "./SuppliersEditPage.module.css";
import { FaAngleLeft, FaPen } from "react-icons/fa";
import { gql, useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router";
import Spinner from "../../../components/Spiner";
import { useEffect, useState } from "react";

const GETSUPPLIER = gql`
  mutation Mutation($getSupplierId: String!) {
    getSupplier(id: $getSupplierId) {
      id
      name
      phone
      email
      city
      street
      number
    }
  }
`;

const UPDATESUPPLIER = gql`
  mutation Mutation(
    $updateSupplierId: String!
    $name: String!
    $phone: String!
    $email: String!
    $city: String!
    $street: String!
    $number: String!
  ) {
    updateSupplier(
      id: $updateSupplierId
      name: $name
      phone: $phone
      email: $email
      city: $city
      street: $street
      number: $number
    ) {
      id
      name
      phone
      email
      city
      street
      number
    }
  }
`;

const nameValidator = (value) => {
  if (!value) {
    return "Proszę podać nazwę klienta";
  }
  return undefined;
};

const numberValidator = (value) => {
  if (!value) {
    return "Proszę podać numer";
  }
  return undefined;
};

const cityValidator = (value) => {
  if (!value) {
    return "Proszę podać Miejscowość";
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

const telValidator = (value) => {
  const phoneNumberRegex = /^\+?[1-9][0-9]{8}$/;
  if (!phoneNumberRegex.test(value)) {
    return "Nie podano numeru telefonu";
  }
  return undefined;
};

const SuppliersEditPage = () => {
  const navigate = useNavigate();
  const [getSupplier, { loading }] = useMutation(GETSUPPLIER);
  const [updateSupplier, { error }] = useMutation(UPDATESUPPLIER);
  const location = useLocation();
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
                        name="Nazwa *"
                        type="text"
                        fieldName="name"
                        validator={nameValidator}
                        initVal={data.name}
                        width="47%"
                      />
                      <Input
                        name="Numer telefonu *"
                        type="tel"
                        fieldName="phone"
                        validator={telValidator}
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
                        validator={cityValidator}
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
                        validator={numberValidator}
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
