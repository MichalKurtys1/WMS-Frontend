import { FaCheck, FaFileSignature, FaMinus, FaTimes } from "react-icons/fa";
import style from "./DeliveryActionRow.module.css";
import { useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";

const DeliveryActionRow = (props) => {
  const [state, setState] = useState(props.product.state);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [imageIsOpen, setImageIsOpen] = useState(false);
  const [posX, setPosX] = useState(props.product.posX);
  const [posY, setPosY] = useState(props.product.posY);
  const [commentStateValue, setCommentStateValue] = useState(
    props.product.commentState
  );
  const [commentLocationValue, setCommentLocationValue] = useState(
    props.product.commentLocation
  );

  const handleImageClick = (event) => {
    const image = event.target;
    const imageRect = image.getBoundingClientRect();
    const offsetX = event.pageX - imageRect.left;
    const offsetY = event.pageY - imageRect.top;

    props.modifyProductPosition(props.product.id, offsetX, offsetY);
    setPosX(offsetX);
    setPosY(offsetY);

    // setImageIsOpen(false);
  };
  return (
    <>
      {props.step === 0 && (
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
                  value={commentStateValue}
                  onChange={(e) => setCommentStateValue(e.target.value)}
                />
                <button
                  onClick={() => {
                    props.modifyCommentState(
                      props.product.id,
                      commentStateValue
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
      {props.step === 1 && props.product.state && (
        <tr className={style.tr} key={props.id}>
          {imageIsOpen && (
            <div className={style.innerBox}>
              <button onClick={() => setImageIsOpen(false)}>
                <FaTimes />
              </button>
              <img
                src={require("../../../../assets/Warehouse layout.png")}
                alt="layout"
                onClick={handleImageClick}
              />
              <MdLocationOn
                style={{
                  top: posY,
                  left: posX,
                }}
                className={style.icon}
              />
            </div>
          )}
          <td>{props.product.product}</td>
          <td>
            {props.product.quantity}x {props.product.unit}
          </td>
          <td className={style.options}>
            {!commentsOpen && (
              <div className={style.iconsBox}>
                <MdLocationOn
                  className={style.locationIcon}
                  style={{ color: "#F03A30" }}
                  onClick={() => {
                    setImageIsOpen(true);
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
              <div
                className={style.comment}
                style={{ display: commentsOpen ? "block" : "none" }}
              >
                <input
                  placeholder="Napisz notatkę.."
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
          </td>
        </tr>
      )}
      {props.step === 2 && props.product.state && (
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
              <MdLocationOn
                style={{
                  top: posY,
                  left: posX,
                }}
                className={style.icon}
              />
            </div>
          )}
          <td>{props.product.product}</td>
          <td>
            {props.product.quantity}x {props.product.unit}
          </td>
          <td>
            <div className={style.iconsBox}>
              <MdLocationOn
                className={style.locationIcon}
                style={{ color: "#F03A30" }}
                onClick={() => {
                  setImageIsOpen(true);
                }}
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default DeliveryActionRow;
