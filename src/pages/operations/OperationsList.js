import { useNavigate } from "react-router";
import style from "./OperationsList.module.css";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/client";

const formattedDate = (dateNumber) => {
  const date = new Date(parseInt(dateNumber));
  return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}, ${date
    .getUTCHours()
    .toString()
    .padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}`;
};

const formattedName = (name) => {
  if (name === "DeliveryList") {
    return "Dostawa";
  } else {
    return null;
  }
};

const CREATE_OPERATION = gql`
  mutation Mutation($deliveriesId: ID!) {
    createOperation(deliveriesId: $deliveriesId) {
      id
      deliveriesId
      stage
      data
    }
  }
`;

const OperationsList = (props) => {
  const navigate = useNavigate();
  const [createOperation] = useMutation(CREATE_OPERATION);

  const clickHandler = (item) => {
    if (props.currentPage === 2) {
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
    } else if (props.currentPage === 1) {
      navigate("/main/operations/action/delivery", {
        state: {
          operation: props.operations.operations.filter(
            (operation) => operation.deliveriesId === item.id
          ),
          data: item,
        },
      });
    } else if (props.currentPage === 3) {
      navigate("/main/operations/action/delivery", {
        state: {
          operation: props.operations.operations.filter(
            (operation) => operation.deliveriesId === item.id
          ),
          data: item,
        },
      });
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
              <p className={style.name}>{item.supplier.name}</p>
              <p className={style.date}>{formattedDate(item.date)}</p>
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
