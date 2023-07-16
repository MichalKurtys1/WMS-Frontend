import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import style from "./DeliveryActionsPage.module.css";
import { useLocation, useNavigate } from "react-router";
import { Step, StepLabel, Stepper } from "@material-ui/core";
import { useEffect, useState } from "react";
import ActionRow from "./DeliveryActionRow";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/client";

const UPDATE_OPERATION = gql`
  mutation Mutation($operationId: ID!, $data: JSON!, $stage: Float!) {
    updateOperation(operationId: $operationId, data: $data, stage: $stage) {
      id
      deliveriesId
      stage
      data
    }
  }
`;

const DeliveryActionsPage = () => {
  const navigate = useNavigate();
  const [updateOperation] = useMutation(UPDATE_OPERATION);
  const [activeStep, setActiveStep] = useState(0);
  const [products, setProducts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (location.state.data.products) {
      if (location.state.operation) {
        if (location.state.operation.length > 0) {
          if (location.state.operation[0].stage === 3) {
            setActiveStep(location.state.operation[0].stage - 1);
          } else {
            setActiveStep(location.state.operation[0].stage);
          }
        }
        if (location.state.operation[0].data) {
          if (location.state.operation[0].data.length > 2) {
            setProducts(
              JSON.parse(JSON.parse(location.state.operation[0].data)).map(
                (item) => {
                  return {
                    id: item.id,
                    product: item.product,
                    unit: item.unit,
                    quantity: item.quantity,
                    state: item.state,
                    commentState: item.commentState,
                    commentLocation: item.commentLocation,
                    posX: item.posX,
                    posY: item.posY,
                  };
                }
              )
            );
          } else {
            JSON.parse(JSON.parse(location.state.data.products));
            setProducts(
              JSON.parse(JSON.parse(location.state.data.products)).map(
                (item) => {
                  return {
                    id: item.id,
                    product: item.product,
                    unit: item.unit,
                    quantity: item.quantity,
                    state: null,
                    commentState: "",
                    commentLocation: "",
                    posX: null,
                    posY: null,
                  };
                }
              )
            );
          }
        } else {
          JSON.parse(JSON.parse(location.state.data.products));
          setProducts(
            JSON.parse(JSON.parse(location.state.data.products)).map((item) => {
              return {
                id: item.id,
                product: item.product,
                unit: item.unit,
                quantity: item.quantity,
                state: null,
                commentState: "",
                commentLocation: "",
                posX: null,
                posY: null,
              };
            })
          );
        }
      } else {
        JSON.parse(JSON.parse(location.state.data.products));
        setProducts(
          JSON.parse(JSON.parse(location.state.data.products)).map((item) => {
            return {
              id: item.id,
              product: item.product,
              unit: item.unit,
              quantity: item.quantity,
              state: null,
              commentState: "",
              commentLocation: "",
              posX: null,
              posY: null,
            };
          })
        );
      }
    }
  }, [location.state.data.products, location.state.operation]);

  const formattedDate = (dateNumber) => {
    const date = new Date(parseInt(dateNumber));
    return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date
      .getUTCDate()
      .toString()
      .padStart(2, "0")}, ${date
      .getUTCHours()
      .toString()
      .padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}`;
  };

  const modifyPoductState = (id, value) => {
    setProducts((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, state: value } : item
      )
    );
  };

  const modifyCommentState = (id, value) => {
    setProducts((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, commentState: value } : item
      )
    );
  };

  const modifyCommentLocation = (id, value) => {
    setProducts((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, commentLocation: value } : item
      )
    );
  };

  const modifyProductPosition = (id, valueX, valueY) => {
    setProducts((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, posX: valueX, posY: valueY } : item
      )
    );
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
            <StepLabel>{"Przyjęcie dostawy"}</StepLabel>
          </Step>
          <Step key={2}>
            <StepLabel>{"Transportowanie"}</StepLabel>
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
            disabled={
              activeStep === 0 &&
              products.filter((item) => item.state === null).length !== 0
            }
            onClick={() => {
              if (location.state.operation) {
                updateOperation({
                  variables: {
                    operationId: location.state.operation[0].id,
                    stage: activeStep + 1,
                    data: JSON.stringify(products),
                  },
                })
                  .then((data) => {
                    setActiveStep(
                      activeStep <= 2 ? activeStep + 1 : activeStep
                    );
                    if (activeStep + 1 === 3) {
                      navigate("/main/operations");
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                updateOperation({
                  variables: {
                    operationId: location.state.id,
                    stage: activeStep + 1,
                    data: JSON.stringify(products),
                  },
                })
                  .then((data) => {
                    setActiveStep(
                      activeStep <= 2 ? activeStep + 1 : activeStep
                    );
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            }}
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
                <h3>Dostawca</h3>
                <p>{location.state.data.supplier.name}</p>
              </div>
              <div className={style.infoBox}>
                <h3>Termin</h3>
                <p>{formattedDate(location.state.data.date)}</p>
              </div>
              <div className={style.infoBox}>
                <h3>Magazyn</h3>
                <p>{location.state.data.warehouse}</p>
              </div>
              <div className={style.infoBox}>
                <h3>Uwagi</h3>
                <p>{location.state.data.comments}</p>
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
              {products !== [] &&
                products.map((item) => (
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
              {products !== [] &&
                products.map((item) => (
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
              <p>Przyjęte produkty</p>
            </div>
            <div className={style.productBox}>
              <div className={style.titlesBox}>
                <p>Produkt</p>
                <p>Ilość</p>
              </div>
              {products !== [] &&
                products.map((item) => (
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
            {products.map((item) => (
              <div className={style.notesBox}>
                <h3>{item.product}</h3>
                <p>{item.commentState || "-"}</p>
                <p>{item.commentLocation || "-"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryActionsPage;
