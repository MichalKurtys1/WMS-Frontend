import style from "./SortingPage.module.css";
import { useLocation, useNavigate } from "react-router";
import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_DELIVERY } from "../../../utils/apollo/apolloMutations";
import ErrorHandler from "../../../components/ErrorHandler";
import Header from "../../../components/Header";
import Loading from "../../../components/Loading";

const SortingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState();
  const [data, setData] = useState();
  const [products, setProducts] = useState([]);
  const [getDelivery, { loading }] = useMutation(GET_DELIVERY, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  useEffect(() => {
    getDelivery({
      variables: {
        getDeliveryId: location.state.deliveryId,
      },
    }).then((data) => {
      setData(data.data.getDelivery);
      JSON.parse(JSON.parse(data.data.getDelivery.products)).map((item) => {
        return setProducts((prevList) => [
          ...prevList,
          {
            id: prevList.length,
            product: item.product,
            unit: item.unit,
            quantity: item.quantity,
            delivered: 0,
            damaged: 0,
          },
        ]);
      });
    });
  }, [getDelivery, location.state.deliveryId]);

  const modifyDeliveredValue = (id, value) => {
    setProducts((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, delivered: value } : item
      )
    );
  };

  const modifyDamagedValue = (id, value) => {
    setProducts((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, damaged: value } : item
      )
    );
  };

  const sendHandler = (e) => {
    e.preventDefault();
    const incompleteProducts = products.filter(
      (item) =>
        item.delivered === null ||
        item.delivered === undefined ||
        item.delivered === ""
    );

    if (incompleteProducts.length > 0) {
      setError("INPUT_ERROR");
      return;
    }
    navigate("/deliveries", {
      state: {
        products: products,
        deliveryId: location.state.deliveryId,
      },
    });
  };

  return (
    <div className={style.container}>
      <Header path={"/deliveries"} />
      <ErrorHandler error={error} />
      <Loading state={loading && !error} />
      {!loading && (
        <div className={style.detailsBox}>
          <h1>Dostarczony asortyment</h1>
          <form onSubmit={sendHandler}>
            {data &&
              products.map((item) => (
                <div className={style.productBox}>
                  <p>{item.product}</p>
                  <input
                    type="number"
                    placeholder="Ilość dostarczonych"
                    max={item.quantity}
                    required
                    onChange={(event) =>
                      modifyDeliveredValue(item.id, event.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Ilość uszkodzonych"
                    max={item.quantityd}
                    onChange={(event) =>
                      modifyDamagedValue(item.id, event.target.value)
                    }
                  />
                </div>
              ))}

            <button type="submit" className={style.sendBtn}>
              Potwierdź
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SortingPage;
