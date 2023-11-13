import style from "./UploadPage.module.css";
import { useLocation, useNavigate } from "react-router";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import ErrorHandler from "./ErrorHandler";
import Header from "./Header";
import Loading from "./Loading";
import { ORDER_FILE_UPLOAD } from "../utils/apollo/apolloMutations";

const UploadPage = ({ type }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState();
  const [deilveryId] = useState(location.state.deliveryId || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [nameInputValue, setNameInputValue] = useState(null);
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
      navigate(type, {
        state: {
          update: true,
        },
      });
    });
  };

  return (
    <div className={style.container}>
      <Header path={type} />
      <ErrorHandler error={error} />
      <Loading state={uploadLoading && !error} />
      {!uploadLoading && (
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

export default UploadPage;
