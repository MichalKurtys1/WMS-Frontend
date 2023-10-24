import { useLocation } from "react-router";
import style from "./SuppliersDetailsPage.module.css";
import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_SUPPLIER } from "../../../utils/apollo/apolloMutations";
import ErrorHandler from "../../../components/ErrorHandler";
import Header from "../../../components/Header";
import Loading from "../../../components/Loading";

const SuppliersDetailsPage = () => {
  const location = useLocation();
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
      <Header path={"/suppliers"} />
      <ErrorHandler error={error} />
      <Loading state={loading && !error} />
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
