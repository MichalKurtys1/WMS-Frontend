import { FaAngleLeft } from "react-icons/fa";
import style from "./OrdersUploadPage.module.css";
import { useLocation, useNavigate } from "react-router";
import { useMutation } from "@apollo/client";
import {
  ORDER_FILE_UPLOAD,
  UPDATE_ORDER_STATE,
} from "../../utils/apollo/apolloMutations";
import { useState } from "react";
import ErrorHandler from "../../components/ErrorHandler";
import Spinner from "../../components/Spiner";

const OrdersUploadPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [nameInputValue, setNameInputValue] = useState(null);
  const [deilveryId] = useState(location.state.deliveryId || null);
  const [orderFileUpload, { loading: uploadLoading }] = useMutation(
    ORDER_FILE_UPLOAD,
    {
      onError: (error) => setError(error),
      onCompleted: () => setError(false),
    }
  );
  const [updateOrdersState, { loading: stateLoading }] = useMutation(
    UPDATE_ORDER_STATE,
    {
      onError: (error) => setError(error),
      onCompleted: () => {
        setError(false);
        navigate("/documents");
      },
    }
  );

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleNameChange = (event) => {
    setNameInputValue(event.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);

    await orderFileUpload({
      variables: {
        file: selectedFile,
        name: nameInputValue,
        fileUploadId: deilveryId,
        date: new Date(),
      },
    });

    await updateOrdersState({
      variables: {
        updateOrderStateId: deilveryId,
        state: "Dostarczono",
      },
    });
  };

  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../assets/logo.png")}
          alt="logo"
        />
        <div className={style.returnBox} onClick={() => navigate("/orders")}>
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <ErrorHandler error={error} />
      {(uploadLoading || stateLoading) && <Spinner />}
      {!uploadLoading && !stateLoading && (
        <main>
          <form className={style.form} onSubmit={submitHandler}>
            <h1>Przesyłanie faktury</h1>
            <p>
              Poniżej wpisz nazwę pod jaką ma być zapisana faktura oraz wybierz
              odpowiedni plik. Plik zostanie zapisany w odpowiedniej zakładce w
              Dokumentach.
            </p>
            <div className={style.inputBox}>
              <input
                type="text"
                placeholder="Nazwa pliku"
                onChange={handleNameChange}
              />
              <input type="file" onChange={handleFileChange} />
            </div>
            <button type="submit">Prześlij</button>
          </form>
        </main>
      )}
    </div>
  );
};

export default OrdersUploadPage;
