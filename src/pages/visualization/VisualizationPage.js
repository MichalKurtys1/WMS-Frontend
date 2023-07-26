import { useLocation, useNavigate } from "react-router";
import style from "./VisualizationPage.module.css";
import { FaAngleLeft } from "react-icons/fa";
import { useQuery } from "@apollo/client";
import LocationItem from "./LocationItem";
import { GET_LOCATIONS } from "../../utils/apollo/apolloQueries";
import { useEffect, useState } from "react";
import ErrorHandler from "../../components/ErrorHandler";
import Spinner from "../../components/Spiner";
import { MdLocationOn } from "react-icons/md";

const VisualizationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState();
  const [selectedLocations, setSelectedLocations] = useState([]);
  const {
    data: locations,
    loading,
    refetch,
  } = useQuery(GET_LOCATIONS, {
    onError: (error) => setError(error),
  });

  useEffect(() => {
    if (location.state) {
      refetch();
    }
  });

  const addSelectedLocation = (id) => {
    setSelectedLocations((prevList) => [...prevList, id]);
  };

  const deleteSelectedLocation = (id) => {
    setSelectedLocations((prevList) => prevList.filter((item) => item !== id));
  };

  const moveProductsHandler = () => {
    navigate("/main/visualisation/move-products", {
      state: {
        selectedLocations,
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
        <div className={style.returnBox} onClick={() => navigate("/main")}>
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <ErrorHandler error={error} />
      <div className={style.innerBox}>
        <button onClick={() => navigate("/main/visualisation/transfers")}>
          Transfery
        </button>
        {selectedLocations.length > 0 && (
          <button onClick={moveProductsHandler}>Prenieś</button>
        )}
        {loading && (
          <div className={style.spinnerBox}>
            <div className={style.spinner}>
              <Spinner />
            </div>
          </div>
        )}
        {locations && (
          <img
            src={require("../../assets/Warehouse layout.png")}
            alt="layout"
          />
        )}
        <div className={style.locationBox} style={{ userSelect: "none" }}>
          <MdLocationOn
            style={{
              bottom: "55px",
              left: "10px",
              color: "#F2A530",
            }}
            className={style.icon}
          />
          <h4
            className={style.description}
            style={{
              bottom: "54px",
              left: "30px",
              display: "block",
              fontWeight: "normal",
            }}
          >
            Przenoszone
          </h4>
        </div>
        <div className={style.locationBox} style={{ userSelect: "none" }}>
          <MdLocationOn
            style={{
              bottom: "5px",
              left: "10px",
            }}
            className={style.iconDestination}
          />
          <h4
            className={style.description}
            style={{
              bottom: "4px",
              left: "30px",
              display: "block",
              fontWeight: "normal",
            }}
          >
            Zaznaczone
          </h4>
        </div>
        <div className={style.locationBox} style={{ userSelect: "none" }}>
          <MdLocationOn
            style={{
              bottom: "30px",
              left: "10px",
            }}
            className={style.icon}
          />
          <h4
            className={style.description}
            style={{
              bottom: "29px",
              left: "30px",
              display: "block",
              fontWeight: "normal",
            }}
          >
            Nie zaznaczone
          </h4>
        </div>
        {locations &&
          locations.locations.map((item) => (
            <LocationItem
              item={item}
              addSelectedLocation={addSelectedLocation}
              deleteSelectedLocation={deleteSelectedLocation}
            ></LocationItem>
          ))}
      </div>
    </div>
  );
};

export default VisualizationPage;
