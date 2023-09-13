import { FaAngleLeft } from "react-icons/fa";
import style from "./OrdersUploadPage.module.css";
import { useLocation, useNavigate } from "react-router";
import { useMutation } from "@apollo/client";
import {
  ORDER_FILE_UPLOAD,
  UPDATE_ORDER_STATE,
} from "../../utils/apollo/apolloMutations";
import { useState } from "react";

const OrdersUploadPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState();
  // eslint-disable-next-line no-unused-vars
  const [deilveryId, setDeliveryId] = useState(
    location.state.deliveryId || null
  );
  const [orderFileUpload] = useMutation(ORDER_FILE_UPLOAD, {
    onError: (error) => setError(error),
  });
  const [updateOrdersState] = useMutation(UPDATE_ORDER_STATE, {
    onError: (error) => setError(error),
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [nameInputValue, setNameInputValue] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleNameChange = (event) => {
    setNameInputValue(event.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(selectedFile);

    orderFileUpload({
      variables: {
        file: selectedFile,
        name: nameInputValue,
        fileUploadId: deilveryId,
        date: new Date(),
      },
    })
      .then((data) => {
        updateOrdersState({
          variables: {
            updateOrderStateId: deilveryId,
            state: "Dostarczono",
          },
        })
          .then((data) => {
            navigate("/main/documents");
          })
          .catch((err) => {
            console.log(err);
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
    </div>
  );
};

export default OrdersUploadPage;
