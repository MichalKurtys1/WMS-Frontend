import { useLocation, useNavigate } from "react-router";
import style from "./MoveProductsPage.module.css";
import { FaAngleLeft, FaTimes } from "react-icons/fa";
import { Form } from "react-final-form";
import Input from "../../components/Input";
import { GET_LOCATIONS } from "../../utils/apollo/apolloQueries";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { MdLocationOn } from "react-icons/md";
import { ADD_TRANSFER } from "../../utils/apollo/apolloMutations";
import { textValidator } from "../../utils/inputValidators";
import ErrorHandler from "../../components/ErrorHandler";
import Spinner from "../../components/Spiner";

const MoveProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState();
  const { data: locations, loading } = useQuery(GET_LOCATIONS, {
    onError: (error) => setError(error),
  });
  const [addTransfer] = useMutation(ADD_TRANSFER, {
    onError: (error) => setError(error),
  });
  const [imageIsOpen, setImageIsOpen] = useState(false);
  const [data, setData] = useState();
  const [submitError, setSubmitError] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();

  useEffect(() => {
    if (locations && location.state) {
      setData(
        locations.locations.filter((item) =>
          location.state.selectedLocations.includes(item.id)
        )
      );
    }
  }, [locations, location.state, setData]);

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const onSubmit = (values) => {
    const incompleteProducts = data.filter(
      (item) => item.newPosX && item.newPosY && item.transferNumber
    );

    if (incompleteProducts.length !== data.length) {
      setSubmitError(true);
      return;
    }

    addTransfer({
      variables: {
        employee: "Jan Kowalski",
        date: values.date,
        data: JSON.stringify(data),
      },
    })
      .then((data) => {
        navigate("/main/visualisation", {
          state: {
            update: true,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const clickHandler = (item) => {
    setCurrentLocation(item);
    setImageIsOpen(true);
  };

  const handleImageClick = (event) => {
    const image = event.target;
    const imageRect = image.getBoundingClientRect();
    const offsetX = event.pageX - imageRect.left;
    const offsetY = event.pageY - imageRect.top;

    setData((prevList) =>
      prevList.map((item) =>
        item.id === currentLocation.id
          ? {
              ...item,
              newPosX: offsetX.toString(),
              newPosY: offsetY.toString(),
            }
          : item
      )
    );

    setCurrentLocation((prevList) => {
      return {
        ...prevList,
        newPosX: offsetX.toString(),
        newPosY: offsetY.toString(),
      };
    });
  };

  const addTranfserNumber = (id, event) => {
    setData((prevList) =>
      prevList.map((item) =>
        item.id === id
          ? {
              ...item,
              transferNumber: parseInt(event.target.value),
            }
          : item
      )
    );
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
          onClick={() => navigate("/main/visualisation")}
        >
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <ErrorHandler error={error} />
      {imageIsOpen && (
        <div className={style.innerBox}>
          <button onClick={() => setImageIsOpen(false)}>
            <FaTimes />
          </button>
          <img
            src={require("../../assets/Warehouse layout.png")}
            alt="layout"
            onClick={handleImageClick}
          />
          <MdLocationOn
            style={{ top: currentLocation.posY, left: currentLocation.posX }}
            className={style.icon}
          />
          {currentLocation.newPosX && currentLocation.newPosY && (
            <MdLocationOn
              style={{
                top: currentLocation.newPosY,
                left: currentLocation.newPosX,
                color: "#B2FFC4",
                backgroundColor: "#22E650",
              }}
              className={style.iconNew}
            />
          )}
        </div>
      )}
      {loading && (
        <div className={style.spinnerBox}>
          <div className={style.spinner}>
            <Spinner />
          </div>
        </div>
      )}
      {data && (
        <main>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, invalid }) => (
              <form className={style.form} onSubmit={handleSubmit}>
                {submitError && <p>Nie uzupełniono wszystkich pól.</p>}
                <h1>Transfer asortymentu</h1>
                <p>
                  Uzupełnij dane żeby dodać nowego pracownika do systemu.
                  Tymczasowe hasło zostanie mu wysłane na jego email.
                </p>
                <div className={style.inputBox}>
                  <Input
                    name="date"
                    type="datetime-local"
                    fieldName="date"
                    min={getCurrentDateTime()}
                    width="100%"
                    validator={textValidator}
                  />
                  {data.map((item) => (
                    <>
                      <div className={style.locationItem}>
                        <p>
                          {item.numberOfProducts}x {item.product.name}{" "}
                          {item.product.type} {item.product.capacity}
                        </p>
                        <input
                          type="number"
                          placeholder="Ilość do przeniesienia"
                          max={item.numberOfProducts}
                          onChange={(e) => addTranfserNumber(item.id, e)}
                        />
                        <MdLocationOn
                          className={style.icon}
                          onClick={() => clickHandler(item)}
                        />
                      </div>
                    </>
                  ))}
                  <button
                    disabled={invalid}
                    type="submit"
                    style={{ backgroundColor: invalid ? "#B6BABF" : null }}
                  >
                    Dodaj
                  </button>
                </div>
              </form>
            )}
          />
        </main>
      )}
    </div>
  );
};

export default MoveProductsPage;
