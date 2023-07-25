import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import style from "./TransferActionsPage.module.css";
import { useLocation, useNavigate } from "react-router";
import { Step, StepLabel, Stepper } from "@material-ui/core";
import { useEffect, useState } from "react";
import ActionRow from "./TransferActionRow";
import { useMutation } from "@apollo/client";
import { UPDATE_OPERATION } from "../../../../utils/apollo/apolloMutations";
import { dateToPolish } from "../../../../utils/dateFormatters";

const TransferActionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [updateOperation] = useMutation(UPDATE_OPERATION);
  const [activeStep, setActiveStep] = useState(0);
  const [locations, setLocations] = useState([]);
  console.log(location.state);
  console.log(locations);

  useEffect(() => {
    if (!location.state.data.data) return;

    if (
      !location.state.operation ||
      location.state.operation.length === 0 ||
      !location.state.operation[0].data ||
      location.state.operation[0].data.length <= 2
    ) {
      setLocations(
        JSON.parse(JSON.parse(location.state.data.data)).map((item) => {
          return item;
        })
      );
      return;
    }

    if (location.state.operation.length > 0) {
      setActiveStep(
        location.state.operation[0].stage === 3
          ? location.state.operation[0].stage - 1
          : location.state.operation[0].stage
      );
    }

    setLocations(
      JSON.parse(JSON.parse(location.state.operation[0].data)).map((item) => {
        return item;
      })
    );
  }, [location.state.operation, location.state.data.data]);

  const modifyPoductState = (id, value) => {
    setLocations((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, state: value } : item
      )
    );
  };

  const modifyCommentState = (id, value) => {
    setLocations((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, commentState: value } : item
      )
    );
  };

  const modifyCommentLocation = (id, value) => {
    setLocations((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, comment: value } : item
      )
    );
  };

  const modifyProductPosition = (id, valueX, valueY) => {
    setLocations((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, posX: valueX, posY: valueY } : item
      )
    );
  };

  const nextPageHandler = () => {
    // if (activeStep === 1) {
    //   setLocations(
    //     locations.filter((item) => {
    //       if (!item.state) {
    //         return false;
    //       }
    //       return true;
    //     })
    //   );
    // }

    const operationId = location.state.operation
      ? location.state.operation[0].id
      : location.state.id;

    updateOperation({
      variables: {
        operationId: operationId,
        stage: activeStep + 1,
        data: JSON.stringify(locations),
      },
    })
      .then((data) => {
        setActiveStep(activeStep <= 2 ? activeStep + 1 : activeStep);
        if (activeStep + 1 === 3) {
          navigate("/main/operations");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../../../assets/logo.png")}
          alt="logo"
        />
        <div
          className={style.returnBox}
          onClick={() => navigate("/main/operations")}
        >
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <div>
        <Stepper activeStep={activeStep} alternativeLabel>
          <Step key={1}>
            <StepLabel>{"Szczegóły przeniesienia"}</StepLabel>
          </Step>
          <Step key={2}>
            <StepLabel>{"Przenoszenie"}</StepLabel>
          </Step>
          <Step key={3}>
            <StepLabel>{"Potwierdzenie"}</StepLabel>
          </Step>
        </Stepper>
        <div className={style.buttons}>
          <button
            disabled={activeStep === 0 ? true : false}
            onClick={() => setActiveStep(activeStep - 1)}
          >
            <FaAngleLeft />
            <p>Wstecz</p>
          </button>
          <button
            onClick={() =>
              activeStep > 0 ? nextPageHandler() : setActiveStep(activeStep + 1)
            }
          >
            <p>Dalej</p>
            <FaAngleRight />
          </button>
        </div>
        {activeStep === 0 && (
          <div className={style.dataBox}>
            <div className={style.basicData}>
              <p>Dane podstawowe</p>
            </div>
            <div className={style.basicDataBox}>
              <div className={style.infoBox}>
                <h3>Zlecił</h3>
                <p>{location.state.data.employee}</p>
              </div>
              <div className={style.infoBox}>
                <h3>Termin</h3>
                <p>{dateToPolish(location.state.data.date)}</p>
              </div>
            </div>
            <div className={style.basicData}>
              <p>Produkty</p>
            </div>
            <div className={style.productBox}>
              <div className={style.titlesBox}>
                <p>Produkt</p>
                <p>Ilość</p>
              </div>
              {locations !== [] &&
                locations.map((item) => (
                  <ActionRow
                    modifyState={modifyPoductState}
                    modifyCommentState={modifyCommentState}
                    modifyCommentLocation={modifyCommentLocation}
                    product={item}
                    step={0}
                  />
                ))}
            </div>
          </div>
        )}
        {activeStep === 1 && (
          <div className={style.dataBox}>
            <div className={style.basicData}>
              <p>Produkty</p>
            </div>
            <div className={style.productBox}>
              <div className={style.titlesBox}>
                <p>Produkt</p>
                <p>Ilość</p>
              </div>
              {locations !== [] &&
                locations.map((item) => (
                  <ActionRow
                    modifyState={modifyPoductState}
                    modifyCommentState={modifyCommentState}
                    modifyCommentLocation={modifyCommentLocation}
                    modifyProductPosition={modifyProductPosition}
                    product={item}
                    step={1}
                  />
                ))}
            </div>
          </div>
        )}
        {activeStep === 2 && (
          <div className={style.dataBox}>
            <div className={style.basicData}>
              <p>Produkty</p>
            </div>
            <div className={style.productBox}>
              <div className={style.titlesBox}>
                <p>Produkt</p>
                <p>Ilość</p>
              </div>
              {locations !== [] &&
                locations.map((item) => (
                  <ActionRow
                    modifyState={modifyPoductState}
                    modifyCommentState={modifyCommentState}
                    modifyCommentLocation={modifyCommentLocation}
                    modifyProductPosition={modifyProductPosition}
                    product={item}
                    step={2}
                  />
                ))}
            </div>
            <div className={style.basicData}>
              <p>Notatki do produktów</p>
            </div>
            {locations.map((item) => (
              <div className={style.notesBox}>
                <h3>{item.product.name}</h3>
                <p>{item.comment || "-"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferActionsPage;
