import { Form } from "react-final-form";
import Input from "../../../components/Input";
import style from "./SuppliersAddPage.module.css";
import { FaAngleLeft, FaPlus } from "react-icons/fa";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router";
import Spinner from "../../../components/Spiner";

const ADDSUPPLIER = gql`
  mutation Mutation(
    $name: String!
    $phone: String!
    $email: String!
    $city: String!
    $street: String!
    $number: String!
  ) {
    createSupplier(
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

const SuppliersAddPage = () => {
  const navigate = useNavigate();
  const [addSupplier, { loading, error }] = useMutation(ADDSUPPLIER);

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
                      width="47%"
                    />
                    <Input
                      name="Numer telefonu *"
                      type="tel"
                      fieldName="phone"
                      validator={telValidator}
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
                      validator={cityValidator}
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
                      validator={numberValidator}
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
