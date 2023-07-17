import {
  FaCheck,
  FaFileSignature,
  FaMinus,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import style from "./OrderActionRow.module.css";
import { useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";

const OrderActionRow = (props) => {
  const [state, setState] = useState(props.product.state);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentStateValue, setCommentStateValue] = useState(
    props.product.commentState
  );
  const [commentLocationValue, setCommentLocationValue] = useState(
    props.product.commentLocation
  );
  const [imageIsOpen, setImageIsOpen] = useState(false);
  const [posX, setPosX] = useState(props.product.posX);
  const [posY, setPosY] = useState(props.product.posY);

  const handleImageClick = (event) => {
    const image = event.target;
    const imageRect = image.getBoundingClientRect();
    const offsetX = event.pageX - imageRect.left;
    const offsetY = event.pageY - imageRect.top;

    props.modifyProductPosition(props.product.id, offsetX, offsetY);
    setPosX(offsetX);
    setPosY(offsetY);

    setImageIsOpen(false);
  };
  return (
    <>
      {props.step === 0 && (
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
              <FaSearch
                className={style.icon}
                style={{ color: "#646E78" }}
                // onClick={() => setCommentsOpen(true)}
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
                value={commentStateValue}
                onChange={(e) => setCommentStateValue(e.target.value)}
              />
              <button
                onClick={() => {
                  props.modifyCommentState(props.product.id, commentStateValue);
                  setCommentsOpen(false);
                }}
              >
                <BsFillSendFill />
              </button>
            </div>
          )}
        </div>
      )}
      {props.step === 1 && props.product.state && (
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
                  onClick={handleImageClick}
                />
                <MdLocationOn
                  style={{ top: posY, left: posX }}
                  className={style.icon}
                />
              </div>
            </div>
          )}
          <p>{props.product.product}</p>
          <p>
            {props.product.quantity}x {props.product.unit}
          </p>
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
      {props.step === 2 && props.product.state && (
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
                <MdLocationOn
                  style={{ top: posY, left: posX }}
                  className={style.icon}
                />
              </div>
            </div>
          )}
          <p>{props.product.product}</p>
          <p>
            {props.product.quantity}x {props.product.unit}
          </p>
          <div className={style.iconsBox}>
            <MdLocationOn
              className={style.locationIcon}
              style={{ color: "#F03A30" }}
              onClick={() => {
                setImageIsOpen(true);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default OrderActionRow;
