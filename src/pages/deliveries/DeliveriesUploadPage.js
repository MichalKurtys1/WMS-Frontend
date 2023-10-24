import style from "../styles/uploadPages.module.css";
import { useLocation, useNavigate } from "react-router";
import { useMutation } from "@apollo/client";
import {
  ORDER_FILE_UPLOAD,
  UPDATE_DELIVERY_STATE,
} from "../../utils/apollo/apolloMutations";
import { useState } from "react";
import ErrorHandler from "../../components/ErrorHandler";
import Header from "../../components/Header";
import Loading from "../../components/Loading";

const DeliveriesUploadPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState();
  const [deilveryId] = useState(location.state.deliveryId || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [nameInputValue, setNameInputValue] = useState(null);
  const [updateDeliveryState, { loading: stateLoading }] = useMutation(
    UPDATE_DELIVERY_STATE,
    {
      onError: (error) => setError(error),
      onCompleted: () => setError(false),
    }
  );
  const [orderFileUpload, { loading: uploadLoading }] = useMutation(
    ORDER_FILE_UPLOAD,
    {
      onError: (error) => setError(error),
      onCompleted: () => setError(false),
    }
  );

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
      updateDeliveryState({
        variables: {
          updateStateId: deilveryId,
          state: "Zakończono",
        },
      }).then((data) => {
        if (!data.data) return;
        navigate("/deliveries", {
          state: {
            update: true,
          },
        });
      });
    });
  };

  return (
    <div className={style.container}>
      <Header path={"/deliveries"} />
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

            <>
              <div className={style.inputBox}>
                <input
                  type="text"
                  placeholder="Nazwa pliku"
                  onChange={(event) => setNameInputValue(event.target.value)}
                />
                <input
                  type="file"
                  onChange={(event) => setSelectedFile(event.target.files[0])}
                />
              </div>
              <button type="submit">Prześlij</button>
            </>
          </form>
        </main>
      )}
    </div>
  );
};

export default DeliveriesUploadPage;
