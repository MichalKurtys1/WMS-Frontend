import { useMutation, useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  ADD_LOCATION,
  UPDATE_OPERATION,
} from "../../../../utils/apollo/apolloMutations";
import { GET_PRODUCTS } from "../../../../utils/apollo/apolloQueries";
import { dateToPolish } from "../../../../utils/dateFormatters";

import style from "./DeliveryActionsPage.module.css";
import ActionRow from "./DeliveryActionRow";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Step, StepLabel, Stepper } from "@material-ui/core";

const DeliveryActionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [products, setProducts] = useState([]);
  const [updateOperation] = useMutation(UPDATE_OPERATION);
  const [addLocation] = useMutation(ADD_LOCATION);
  const { data: productsData } = useQuery(GET_PRODUCTS);

  useEffect(() => {
    if (!location.state.data.products) return;

    if (
      !location.state.operation ||
      !location.state.operation[0].data ||
      location.state.operation[0].data.length <= 2
    ) {
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
      return;
    }

    if (location.state.operation.length > 0) {
      setActiveStep(
        location.state.operation[0].stage === 3
          ? location.state.operation[0].stage - 1
          : location.state.operation[0].stage
      );
    }

    setProducts(
      JSON.parse(JSON.parse(location.state.operation[0].data)).map((item) => {
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
      })
    );
  }, [location.state.data.products, location.state.operation]);

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

  const processProducts = () => {
    products.forEach((item) => {
      if (item.posX !== null && item.posY !== null) {
        const product = productsData.products.find(
          (product) =>
            item.product.includes(product.name) &&
            item.product.includes(product.type) &&
            item.product.includes(product.capacity)
        );

        if (product) {
          addLocation({
            variables: {
              operationId: location.state.operation
                ? location.state.operation[0].id
                : location.state.id,
              productId: product.id,
              numberOfProducts: parseInt(item.quantity),
              posX: item.posX.toString(),
              posY: item.posY.toString(),
            },
          }).catch((err) => console.log(err));
        }
      }
    });
  };

  const nextPageHandler = () => {
    if (activeStep === 1) {
      let missingPositions = false;
      products.map((item) =>
        (!item.posX || !item.posY) && item.state === true
          ? (missingPositions = true)
          : null
      );

      if (missingPositions) {
        return;
      }
    }

    const operationId = location.state.operation
      ? location.state.operation[0].id
      : location.state.id;

    updateOperation({
      variables: {
        operationId: operationId,
        stage: activeStep + 1,
        data: JSON.stringify(products),
      },
    })
      .then((data) => {
        if (activeStep === 1) {
          processProducts();
        }

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
            onClick={nextPageHandler}
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
                <p>{dateToPolish(location.state.data.date)}</p>
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
              <table className={style.table}>
                <thead>
                  <tr>
                    <th></th>
                    <th>Produkt</th>
                    <th>Ilość</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
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
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeStep === 1 && (
          <div className={style.dataBox}>
            <div className={style.basicData}>
              <p>Produkty</p>
            </div>
            <div className={style.productBox}>
              <table className={style.table}>
                <thead>
                  <tr>
                    <th>Produkt</th>
                    <th>Ilość</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
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
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeStep === 2 && (
          <div className={style.dataBox}>
            <div className={style.basicData}>
              <p>Przyjęte produkty</p>
            </div>
            <div className={style.productBox}>
              <table className={style.table}>
                <thead>
                  <tr>
                    <th>Produkt</th>
                    <th>Ilość</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
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
                </tbody>
              </table>
            </div>
            <div className={style.basicData}>
              <p>Notatki do produktów</p>
            </div>
            <div className={style.productBox}>
              <table className={style.table}>
                <thead>
                  <tr>
                    <th>Produkt</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr>
                      <td>{item.product}</td>
                      <td>{item.commentState || "-"}</td>
                      <td>{item.commentLocation || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryActionsPage;
