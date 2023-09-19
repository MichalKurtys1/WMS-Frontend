import { useLocation, useNavigate } from "react-router";
import style from "./SuppliersDetailsPage.module.css";
import { FaAngleLeft } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_SUPPLIER } from "../../../utils/apollo/apolloMutations";
import Spinner from "../../../components/Spiner";
import ErrorHandler from "../../../components/ErrorHandler";

const SuppliersDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [data, setData] = useState();
  const [getSupplier, { loading }] = useMutation(GET_SUPPLIER, {
    onError: (error) => setError(error),
  });

  useEffect(() => {
    getSupplier({
      variables: {
        getSupplierId: location.state.userId,
      },
    })
      .then((data) => {
        setData(data.data.getSupplier);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [getSupplier, location.state.userId]);

  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../../assets/logo.png")}
          alt="logo"
        />
        <div className={style.returnBox} onClick={() => navigate("/suppliers")}>
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <ErrorHandler error={error} />
      {loading && (
        <div className={style.spinnerBox}>
          <div className={style.spinner}>
            <Spinner />
          </div>
        </div>
      )}
      {data && (
        <div className={style.supplierBox}>
          <h1>{data.name}</h1>
          <div className={style.dataBox}>
            <h2>Adres:</h2>
            <p>{"ul. " + data.street + " " + data.number + " " + data.city}</p>
          </div>
          <div className={style.dataBox}>
            <h2>Bank:</h2>
            <p>{data.bank}</p>
          </div>
          <div className={style.dataBox}>
            <h2>Numer konta:</h2>
            <p>{data.accountNumber}</p>
          </div>
          <div className={style.dataBox}>
            <h2>Numer telefonu:</h2>
            <p>{data.phone}</p>
          </div>
          <div className={style.dataBox}>
            <h2>Adres email:</h2>
            <p>{data.email}</p>
          </div>
          <div className={style.dataBox}>
            <h2>NIP:</h2>
            <p>{data.nip}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersDetailsPage;
