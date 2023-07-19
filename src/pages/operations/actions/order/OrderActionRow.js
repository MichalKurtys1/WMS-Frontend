import {
  FaCheck,
  FaFileSignature,
  FaMinus,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import style from "./OrderActionRow.module.css";
import { useEffect, useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/client";

const GET_LOCATIONS = gql`
  query Query {
    locations {
      product {
        name
        type
        capacity
        unit
      }
      numberOfProducts
      posX
      posY
    }
  }
`;

const OrderActionRow = (props) => {
  const [state, setState] = useState(props.product.state);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const { data: locations } = useQuery(GET_LOCATIONS);
  const [commentLocationValue, setCommentLocationValue] = useState(
    props.product.comment
  );
  const [imageIsOpen, setImageIsOpen] = useState(false);
  const [productLocations, setProductLocations] = useState();

  useEffect(() => {
    if (locations && props.product) {
      const location = locations.locations.filter(
        (item) =>
          props.product.product.includes(item.product.name) &&
          props.product.product.includes(item.product.type) &&
          props.product.product.includes(item.product.capacity)
      );
      setProductLocations(location);
    }
  }, [locations, props.product]);

  return (
    <>
      {props.step === 0 && (
        <div className={style.product}>
          {imageIsOpen && (
            <div className={style.imageBox}>
              <button onClick={() => setImageIsOpen(false)}>
                <FaTimes />
              </button>
              <div className={style.innerBox}>
                <img
                  src={require("../../../../assets/Warehouse layout.png")}
                  alt="layout"
                />
                {productLocations.map((item) => (
                  <div className={style.locationBox}>
                    <MdLocationOn
                      style={{ top: `${item.posY}px`, left: `${item.posX}px` }}
                      className={style.icon}
                    />
                    <h4
                      className={style.description}
                      style={{
                        top: `${+item.posY - 5}px`,
                        left: `${+item.posX + 15}px`,
                      }}
                    >
                      {item.numberOfProducts}x {item.product.name}{" "}
                      {item.product.type} {item.product.capacity}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p>{props.product.product}</p>
          <p>
            {props.product.quantity}x {props.product.unit}
          </p>
          <div className={style.iconsBox}>
            <FaSearch
              className={style.icon}
              style={{ color: "#646E78" }}
              onClick={() => setImageIsOpen(true)}
            />
          </div>
        </div>
      )}
      {props.step === 1 && (
        <div className={style.product}>
          {state === true && (
            <FaCheck className={style.icon} style={{ color: "#22E650" }} />
          )}
          {state === false && (
            <FaTimes className={style.icon} style={{ color: "#F03A30" }} />
          )}
          {state === null && (
            <FaMinus className={style.icon} style={{ color: "#646e78" }} />
          )}

          <p>{props.product.product}</p>
          <p>
            {props.product.quantity}x {props.product.unit}
          </p>
          {!commentsOpen && (
            <div className={style.iconsBox}>
              <FaCheck
                className={style.icon}
                style={{ color: "#22E650" }}
                onClick={() => {
                  props.modifyState(props.product.id, true);
                  setState(true);
                }}
              />
              <FaTimes
                className={style.icon}
                style={{ color: "#F03A30" }}
                onClick={() => {
                  props.modifyState(props.product.id, false);
                  setState(false);
                }}
              />
              <FaFileSignature
                className={style.icon}
                style={{ color: "#646E78" }}
                onClick={() => setCommentsOpen(true)}
              />
            </div>
          )}
          {commentsOpen && (
            <div className={style.comment}>
              <input
                placeholder="Napisz notatkę do tego produktu"
                value={commentLocationValue}
                onChange={(e) => setCommentLocationValue(e.target.value)}
              />
              <button
                onClick={() => {
                  props.modifyCommentLocation(
                    props.product.id,
                    commentLocationValue
                  );
                  setCommentsOpen(false);
                }}
              >
                <BsFillSendFill />
              </button>
            </div>
          )}
        </div>
      )}
      {props.step === 2 && (
        <div className={style.product}>
          <p>{props.product.product}</p>
          <p>
            {props.product.quantity}x {props.product.unit}
          </p>
          <div className={style.iconsBox}>
            {props.product.state && (
              <FaCheck
                className={style.locationIcon}
                style={{ color: "#22E650" }}
              />
            )}
            {!props.product.state && (
              <FaTimes
                className={style.locationIcon}
                style={{ color: "#F03A30" }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default OrderActionRow;
