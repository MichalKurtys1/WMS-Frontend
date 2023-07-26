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
import { useQuery } from "@apollo/client";
import { GET_LOCATIONS } from "../../../../utils/apollo/apolloQueries";

const OrderActionRow = (props) => {
  const [state, setState] = useState(props.product.state);
  const [imageIsOpen, setImageIsOpen] = useState(false);
  const [productLocations, setProductLocations] = useState();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const { data: locations } = useQuery(GET_LOCATIONS);
  const [commentLocationValue, setCommentLocationValue] = useState(
    props.product.comment
  );

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
        <tr className={style.tr} key={props.id}>
          {imageIsOpen && (
            <div className={style.innerBox}>
              <button onClick={() => setImageIsOpen(false)}>
                <FaTimes />
              </button>
              <img
                src={require("../../../../assets/Warehouse layout.png")}
                alt="layout"
              />
              {productLocations.map((item) => (
                <div
                  className={style.locationBox}
                  style={{
                    top: `${item.posY}px`,
                    left: `${item.posX}px`,
                  }}
                >
                  <MdLocationOn className={style.icon} />
                  <p className={style.description}>
                    {item.numberOfProducts}x {item.product.name}{" "}
                    {item.product.type} {item.product.capacity}
                  </p>
                </div>
              ))}
            </div>
          )}
          <td>{props.product.product}</td>
          <td>
            {props.product.quantity}x {props.product.unit}
          </td>
          <td>
            <div
              className={style.iconsBox}
              onClick={() => setImageIsOpen(true)}
            >
              <FaSearch className={style.icon} style={{ color: "#646E78" }} />
            </div>
          </td>
        </tr>
      )}
      {props.step === 1 && (
        <tr className={style.tr} key={props.id}>
          <td>
            {state === true && (
              <FaCheck className={style.icon} style={{ color: "#22E650" }} />
            )}
            {state === false && (
              <FaTimes className={style.icon} style={{ color: "#F03A30" }} />
            )}
            {state === null && (
              <FaMinus className={style.icon} style={{ color: "#646e78" }} />
            )}
          </td>

          <td>{props.product.product}</td>
          <td>
            {props.product.quantity}x {props.product.unit}
          </td>
          <td className={style.options}>
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
                  placeholder="Napisz notatkę.."
                  value={commentLocationValue}
                  onChange={(e) => setCommentLocationValue(e.target.value)}
                />
                <button
                  onClick={() => {
                    props.modifyCommentState(
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
          </td>
        </tr>
      )}
      {props.step === 2 && (
        <tr className={style.tr} key={props.id}>
          <td>{props.product.product}</td>
          <td>
            {props.product.quantity}x {props.product.unit}
          </td>
          <td>
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
          </td>
        </tr>
      )}
    </>
  );
};

export default OrderActionRow;
