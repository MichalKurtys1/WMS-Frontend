import { useNavigate } from "react-router";
import style from "./VisualizationPage.module.css";
import { FaAngleLeft } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/client";

const GET_LOCATIONS = gql`
  query Query {
    locations {
      id
      productId
      product {
        id
        supplierId
        name
        type
        capacity
        unit
        pricePerUnit
        availableStock
      }
      numberOfProducts
      posX
      posY
    }
  }
`;

const VisualizationPage = () => {
  const navigate = useNavigate();
  const { data: locations } = useQuery(GET_LOCATIONS);

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
          <img
            src={require("../../assets/Warehouse layout.png")}
            alt="layout"
          />
          {locations &&
            locations.locations.map((item) => (
              <div className={style.locationBox}>
                <MdLocationOn
                  className={style.icon}
                  style={{ top: `${item.posY}px`, left: `${item.posX}px` }}
                />
                <p
                  className={style.description}
                  style={{
                    top: `${+item.posY - 5}px`,
                    left: `${+item.posX + 15}px`,
                  }}
                >
                  {item.numberOfProducts}x {item.product.name}{" "}
                  {item.product.type} {item.product.capacity}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default VisualizationPage;
