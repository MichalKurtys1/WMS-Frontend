import { useNavigate } from "react-router";
import style from "./VisualizationPage.module.css";
import { FaAngleLeft } from "react-icons/fa";
import { useQuery } from "@apollo/client";
import LocationItem from "./LocationItem";
import { GET_LOCATIONS } from "../../utils/apollo/apolloQueries";
import { useState } from "react";

const VisualizationPage = () => {
  const navigate = useNavigate();
  const { data: locations } = useQuery(GET_LOCATIONS);
  const [selectedLocations, setSelectedLocations] = useState([]);

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
      <div className={style.imageBox}>
        <div className={style.innerBox}>
          <button onClick={() => navigate("/main/visualisation/transfers")}>
            Transfery
          </button>
          {selectedLocations.length > 0 && (
            <button onClick={moveProductsHandler}>Prenieś asortyment</button>
          )}
          <img
            src={require("../../assets/Warehouse layout.png")}
            alt="layout"
          />
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
