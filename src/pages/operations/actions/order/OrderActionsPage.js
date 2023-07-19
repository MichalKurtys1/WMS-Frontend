import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import style from "./OrderActionsPage.module.css";
import { useLocation, useNavigate } from "react-router";
import { Step, StepLabel, Stepper } from "@material-ui/core";
import { useEffect, useState } from "react";
import ActionRow from "./OrderActionRow";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/client";
import { AiOutlineSend } from "react-icons/ai";
import { IoReturnUpBackOutline } from "react-icons/io5";

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

const palletList = ["1000 x 1200", "1016 x 1219", "1165 x 1165", "800 x 1200"];

const OrderActionsPage = () => {
  const navigate = useNavigate();
  const [updateOperation] = useMutation(UPDATE_OPERATION);
  const [activeStep, setActiveStep] = useState(0);
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const [palletNumber, setPalletNumber] = useState();
  const [palletInfo, setPalletInfo] = useState([]);
  const [palletFormActive, setPalletFormActive] = useState(false);

  console.log(products);
  console.log(palletInfo);

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
              JSON.parse(
                JSON.parse(location.state.operation[0].data)
              ).products.map((item) => {
                return {
                  id: item.id,
                  product: item.product,
                  unit: item.unit,
                  quantity: item.quantity,
                  state: item.state,
                  comment: item.comment,
                  palletInfo: item.palletInfo,
                };
              })
            );
            setPalletInfo(
              JSON.parse(
                JSON.parse(location.state.operation[0].data)
              ).palletInfo.map((item) => {
                return {
                  id: item.id,
                  palletType: item.palletType,
                  palletWeight: item.palletWeight,
                };
              })
            );
            setPalletFormActive(true);
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
                    comment: "",
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
                comment: "",
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
              comment: "",
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
        item.id === id ? { ...item, comment: value } : item
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

  // ssss

  const palletNumberHandler = () => {
    const palletObjects = [];
    for (let i = 0; i < palletNumber; i++) {
      palletObjects.push({ id: i, palletType: null, palletWeight: null });
    }
    setPalletInfo(palletObjects);
    setPalletFormActive(true);
  };

  const modifyPalletType = (id, value) => {
    setPalletInfo((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, palletType: value } : item
      )
    );
  };

  const modifyPalletWeight = (id, value) => {
    setPalletInfo((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, palletWeight: parseInt(value) } : item
      )
    );
  };

  const nextPageHandler = () => {
    if (palletInfo.length === 0 || !palletFormActive) {
      return;
    }
    const badInput = palletInfo.filter(
      (item) => item.palletType === null || item.palletWeight === null
    );
    if (badInput.length > 0) {
      return;
    }

    if (location.state.operation) {
      updateOperation({
        variables: {
          operationId: location.state.operation[0].id,
          stage: activeStep + 1,
          data: JSON.stringify({
            products: products,
            palletInfo: palletInfo,
          }),
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
    } else {
      updateOperation({
        variables: {
          operationId: location.state.id,
          stage: activeStep + 1,
          data: JSON.stringify({
            products: products,
            palletInfo: palletInfo,
          }),
        },
      })
        .then((data) => {
          setActiveStep(activeStep <= 2 ? activeStep + 1 : activeStep);
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
            <StepLabel>{"Kompletowanie zamówienia"}</StepLabel>
          </Step>
          <Step key={2}>
            <StepLabel>{"Pakowanie"}</StepLabel>
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
                <h3>Klient</h3>
                <p>{location.state.data.client.name}</p>
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
                    palletInfo={palletInfo}
                    step={1}
                  />
                ))}
            </div>
            <div className={style.basicData}>
              <p>Dodatkowe informacje</p>
              <IoReturnUpBackOutline
                className={style.backIcon}
                onClick={() => setPalletFormActive(false)}
              />
            </div>
            {!palletFormActive && (
              <div className={style.inputBox}>
                <input
                  type="number"
                  min={0}
                  placeholder="Ilość palet"
                  onChange={(event) => setPalletNumber(event.target.value)}
                />
                <button onClick={palletNumberHandler}>
                  <AiOutlineSend />
                </button>
              </div>
            )}
            {palletInfo &&
              palletFormActive &&
              palletInfo.map((item) => (
                <div className={style.palletInfo}>
                  <div className={style.selectBox}>
                    <select
                      className={style.select}
                      defaultValue={item.palletType}
                      onChange={(event) =>
                        modifyPalletType(item.id, event.target.value)
                      }
                    >
                      <option value={null}>Wybierz jednostkę</option>
                      {palletList.map((item) => (
                        <option value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                  <div className={style.inputBox}>
                    <input
                      type="number"
                      min={0}
                      placeholder="Waga palety"
                      defaultValue={item.palletWeight}
                      onChange={(event) =>
                        modifyPalletWeight(item.id, event.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
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
                <p>{item.comment || "-"}</p>
              </div>
            ))}
            <div className={style.basicData}>
              <p>Dane dotyczące palet</p>
            </div>
            {palletInfo.map((item) => (
              <div className={style.notesBox}>
                <h3>{item.palletType || "-"}</h3>
                <p>{item.palletWeight || "-"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderActionsPage;
