import {
  FaCheck,
  FaFileSignature,
  FaMinus,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import style from "./TransferActionRow.module.css";
import { useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";

const TransferActionRow = (props) => {
  const [state, setState] = useState(props.product.state);
  const [imageIsOpen, setImageIsOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentLocationValue, setCommentLocationValue] = useState(
    props.product.comment
  );

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
                <div className={style.locationBox}>
                  <MdLocationOn
                    style={{
                      top: "5px",
                      left: "5px",
                    }}
                    className={style.icon}
                  />
                  <h4
                    className={style.description}
                    style={{
                      top: "0",
                      left: "30px",
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
                      left: "5px",
                    }}
                    className={style.iconDestination}
                  />
                  <h4
                    className={style.description}
                    style={{
                      top: "25px",
                      left: "30px",
                      display: "block",
                      fontWeight: "normal",
                    }}
                  >
                    Dokąd
                  </h4>
                </div>
                <div className={style.locationBox}>
                  <MdLocationOn
                    style={{
                      top: `${props.product.posY}px`,
                      left: `${props.product.posX}px`,
                    }}
                    className={style.icon}
                  />
                  <h4
                    className={style.description}
                    style={{
                      top: `${+props.product.posY - 5}px`,
                      left: `${+props.product.posX + 15}px`,
                    }}
                  >
                    {props.product.numberOfProducts}x{" "}
                    {props.product.product.name} {props.product.product.type}{" "}
                    {props.product.product.capacity}
                  </h4>
                </div>
                <div className={style.locationBox}>
                  <MdLocationOn
                    style={{
                      top: `${props.product.newPosY}px`,
                      left: `${props.product.newPosX}px`,
                    }}
                    className={style.iconDestination}
                  />
                  <h4
                    className={style.descriptionDestination}
                    style={{
                      top: `${+props.product.newPosY - 5}px`,
                      left: `${+props.product.newPosX + 15}px`,
                    }}
                  >
                    {props.product.transferNumber}x {props.product.product.name}{" "}
                    {props.product.product.type}{" "}
                    {props.product.product.capacity}
                  </h4>
                </div>
              </div>
            </div>
          )}
          <p>
            {props.product.product.name} {props.product.product.type}{" "}
            {props.product.product.capacity}
          </p>
          <p>
            {props.product.transferNumber}x {props.product.product.unit}
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

          <p>
            {props.product.product.name} {props.product.product.type}{" "}
            {props.product.product.capacity}
          </p>
          <p>
            {props.product.transferNumber}x {props.product.product.unit}
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
          <p>
            {props.product.product.name} {props.product.product.type}{" "}
            {props.product.product.capacity}
          </p>
          <p>
            {props.product.transferNumber}x {props.product.product.unit}
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

export default TransferActionRow;
