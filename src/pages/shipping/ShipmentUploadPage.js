import { FaAngleLeft } from "react-icons/fa";
import style from "./ShipmentUploadPage.module.css";
import { useLocation, useNavigate } from "react-router";
import { useMutation } from "@apollo/client";
import {
  ORDER_FILE_UPLOAD,
  UPDATE_SHIPMENT_STATE,
} from "../../utils/apollo/apolloMutations";
import { useState } from "react";
import ErrorHandler from "../../components/ErrorHandler";
import Spinner from "../../components/Spiner";

const ShipmentUploadPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.state);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState();
  // eslint-disable-next-line no-unused-vars
  const [deilveryId, setDeliveryId] = useState(
    location.state.deliveryId || null
  );
  const [orderFileUpload, { loading: uploadLoading }] = useMutation(
    ORDER_FILE_UPLOAD,
    {
      onError: (error) => setError(error),
    }
  );
  const [updateShipmentState, { loading: stateLoading }] = useMutation(
    UPDATE_SHIPMENT_STATE,
    {
      onError: (error) => setError(error),
      onCompleted: () => {
        if (!error) navigate("/main/documents");
      },
    }
  );

  const [selectedFile, setSelectedFile] = useState(null);
  const [nameInputValue, setNameInputValue] = useState(null);

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

    await updateShipmentState({
      variables: {
        updateOrderShipmentStateId: deilveryId,
        state: "Dostarczono",
      },
    });
  };

  console.log(error);

  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../assets/logo.png")}
          alt="logo"
        />
        <div
          className={style.returnBox}
          onClick={() => navigate("/main/orders")}
        >
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <ErrorHandler error={error} />
      <main>
        <form className={style.form} onSubmit={submitHandler}>
          <h1>Przesyłanie faktury</h1>
          <p>
            Poniżej wpisz nazwę pod jaką ma być zapisana faktura oraz wybierz
            odpowiedni plik. Plik zostanie zapisany w odpowiedniej zakładce w
            Dokumentach.
          </p>
          {(uploadLoading || stateLoading) && (
            <div className={style.spinnerBox}>
              <div className={style.spinner}>
                <Spinner />
              </div>
            </div>
          )}
          {!uploadLoading && !stateLoading && (
            <>
              <div className={style.inputBox}>
                <input
                  type="text"
                  placeholder="Nazwa pliku"
                  onChange={handleNameChange}
                />
                <input type="file" onChange={handleFileChange} />
              </div>
              <button type="submit">Prześlij</button>
            </>
          )}
        </form>
      </main>
    </div>
  );
};

export default ShipmentUploadPage;
