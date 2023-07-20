import { useNavigate } from "react-router";
import { useMutation } from "@apollo/client";
import { ADD_OPERATION } from "../../utils/apollo/apolloMutations";
import { dateToPolish } from "../../utils/dateFormatters";
import style from "./OperationsList.module.css";

const OperationsList = (props) => {
  const navigate = useNavigate();
  const [createOperation] = useMutation(ADD_OPERATION);

  const formattedName = (name) => {
    if (name === "DeliveryList") {
      return "Dostawa";
    } else {
      return "Zamówienie";
    }
  };

  const clickHandler = (item) => {
    if (props.currentPage === 2) {
      if (formattedName(item.__typename) === "Dostawa") {
        createOperation({
          variables: {
            deliveriesId: item.id,
          },
        })
          .then((data) => {
            navigate("/main/operations/action/delivery", {
              state: {
                id: data.data.createOperation.id,
                data: item,
                operation: null,
              },
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        createOperation({
          variables: {
            ordersId: item.id,
          },
        })
          .then((data) => {
            navigate("/main/operations/action/order", {
              state: {
                id: data.data.createOperation.id,
                data: item,
                operation: null,
              },
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      if (formattedName(item.__typename) === "Dostawa") {
        navigate("/main/operations/action/delivery", {
          state: {
            operation: props.operations.operations.filter(
              (operation) => operation.deliveriesId === item.id
            ),
            data: item,
          },
        });
      } else {
        navigate("/main/operations/action/order", {
          state: {
            operation: props.operations.operations.filter(
              (operation) => operation.ordersId === item.id
            ),
            data: item,
          },
        });
      }
    }
  };

  return (
    <div className={style.container}>
      {props.data &&
        props.data.map((item) => (
          <div className={style.operationWrapper}>
            <div
              className={style.operationBox}
              onClick={() => clickHandler(item)}
            >
              <h1>{formattedName(item.__typename)}</h1>
              <p className={style.name}>
                {item.supplier !== undefined
                  ? item.supplier.name
                  : item.client.name}
              </p>
              <p className={style.date}>{dateToPolish(item.date)}</p>
            </div>
            <button className={style.confirmBtn}>
              {props.currentPage === 2 ? "Przyjmij" : "Kontynuuj"}
            </button>
          </div>
        ))}
    </div>
  );
};

export default OperationsList;
