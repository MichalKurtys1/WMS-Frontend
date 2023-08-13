import { FaPlus } from "react-icons/fa";
import style from "./ProductsList.module.css";
import { BsTrashFill } from "react-icons/bs";

const ProductList = ({
  productList,
  products,
  loadingProducts,
  deleteHandler,
  changeProductHandler,
  changeUnitHandler,
  quantityUnitHandler,
  addProductInputCounter,
  stocks,
}) => {
  const availableHandler = (item) => {
    const stock = stocks.stocks.filter(
      (stock) =>
        item.product.includes(stock.product.name) &&
        item.product.includes(stock.product.type) &&
        item.product.includes(stock.product.capacity)
    );
    return stock[0].availableStock;
  };

  return (
    <>
      {stocks &&
        productList.map((item) => (
          <div className={style.productBox}>
            <BsTrashFill
              className={style.trashIcon}
              onClick={() => deleteHandler(item.id)}
            />
            <div className={style.selectBox}>
              <div className={style.selectBox}>
                <select
                  defaultValue={item.product}
                  className={style.select}
                  onChange={(event) =>
                    changeProductHandler(item.id, event.target.value)
                  }
                >
                  <option value={null}>Wybierz produkt</option>
                  {products &&
                    !loadingProducts &&
                    products.products.map((option) => {
                      if (option.name === item.name) {
                        return (
                          <option
                            selected
                            value={
                              option.name +
                              " " +
                              option.type +
                              " " +
                              option.capacity
                            }
                          >
                            {option.name} {option.type} {option.capacity}
                          </option>
                        );
                      } else {
                        return (
                          <option
                            value={
                              option.name +
                              " " +
                              option.type +
                              " " +
                              option.capacity
                            }
                          >
                            {option.name} {option.type} {option.capacity}
                          </option>
                        );
                      }
                    })}
                </select>
              </div>
            </div>
            {item.product !== null && item.product !== "Wybierz produkt" && (
              <>
                <div className={style.availableStockBox}>
                  Dostępne: <strong>{availableHandler(item)}</strong>
                </div>
                <div className={style.selectBox}>
                  <div className={style.selectBox}>
                    <select
                      defaultValue={item.unit}
                      className={style.select}
                      onChange={(event) =>
                        changeUnitHandler(item.id, event.target.value)
                      }
                    >
                      <option value={null}>Wybierz jednostkę</option>
                      {products &&
                        !loadingProducts &&
                        products.products.map((option) => {
                          if (
                            option.name +
                              " " +
                              option.type +
                              " " +
                              option.capacity ===
                            item.product
                          ) {
                            return (
                              <option value={option.unit}>{option.unit}</option>
                            );
                          } else {
                            return null;
                          }
                        })}
                    </select>
                  </div>
                </div>
              </>
            )}
            {stocks && (
              <div className={style.inputBox}>
                <input
                  defaultValue={item.quantity}
                  type="number"
                  min={0}
                  placeholder="Ilość"
                  onChange={(event) =>
                    quantityUnitHandler(
                      item.id,
                      event.target.value,
                      availableHandler(item)
                    )
                  }
                />
              </div>
            )}
          </div>
        ))}
      <div className={style.productBox} onClick={addProductInputCounter}>
        <FaPlus className={style.plusIcon} />
      </div>
    </>
  );
};

export default ProductList;
