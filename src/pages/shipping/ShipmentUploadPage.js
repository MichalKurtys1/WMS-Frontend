import style from "../styles/uploadPages.module.css";
import { useLocation, useNavigate } from "react-router";
import { useMutation } from "@apollo/client";
import {
  ORDER_FILE_UPLOAD,
  UPDATE_SHIPMENT_STATE,
} from "../../utils/apollo/apolloMutations";
import { useState } from "react";
import ErrorHandler from "../../components/ErrorHandler";
import Header from "../../components/Header";
import Loading from "../../components/Loading";

const ShipmentUploadPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [nameInputValue, setNameInputValue] = useState(null);
  const [error, setError] = useState();
  const [deilveryId] = useState(location.state.deliveryId || null);
  const [orderFileUpload, { loading: uploadLoading }] = useMutation(
    ORDER_FILE_UPLOAD,
    {
      onError: (error) => setError(error),
      onCompleted: () => setError(false),
    }
  );
  const [updateShipmentState, { loading: stateLoading }] = useMutation(
    UPDATE_SHIPMENT_STATE,
    {
      onError: (error) => setError(error),
      onCompleted: () => setError(false),
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
    if (
      nameInputValue === "" ||
      nameInputValue === null ||
      selectedFile === null
    )
      return;

    orderFileUpload({
      variables: {
        file: selectedFile,
        name: nameInputValue,
        fileUploadId: deilveryId,
        date: new Date(),
      },
    }).then((data) => {
      if (!data.data) return;
      updateShipmentState({
        variables: {
          updateOrderShipmentStateId: deilveryId,
          state: "Zakończono",
        },
      }).then((data) => {
        if (!data.data) return;
        navigate("/shipping", {
          state: {
            update: true,
          },
        });
      });
    });
  };

  return (
    <div className={style.container}>
      <Header path={"/shipping"} />
      <ErrorHandler error={error} />
      <Loading state={(uploadLoading || stateLoading) && !error} />
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

export default ShipmentUploadPage;
