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
      <div className={style.imageBox}>
        <div className={style.innerBox}>
          <button onClick={() => navigate("/main/visualisation/transfers")}>
            Transfery
          </button>
          {selectedLocations.length > 0 && (
            <button onClick={moveProductsHandler}>Prenieś asortyment</button>
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
          <div className={style.locationBox}>
            <MdLocationOn
              style={{
                top: "5px",
                right: "40px",
              }}
              className={style.icon}
            />
            <h4
              className={style.description}
              style={{
                top: "0",
                right: "5px",
                display: "block",
                fontWeight: "normal",
              }}
            >
              Skąd
            </h4>
          </div>
          <div className={style.locationBox}>
            <MdLocationOn
              style={{
                top: "30px",
                right: "40px",
              }}
              className={style.iconDestination}
            />
            <h4
              className={style.description}
              style={{
                top: "25px",
                right: "-6px",
                display: "block",
                fontWeight: "normal",
              }}
            >
              Dokąd
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
    </div>
  );
};

export default VisualizationPage;
