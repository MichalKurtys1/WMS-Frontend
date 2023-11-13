import { FaPlus } from "react-icons/fa";
import style from "../styles/productsList.module.css";
import { BsTrashFill } from "react-icons/bs";
import { useEffect, useState } from "react";

const ProductList = ({
  productList,
  products,
  loadingProducts,
  deleteHandler,
  changeProductHandler,
  changeUnitHandler,
  quantityUnitHandler,
  addProductInputCounter,
}) => {
  const [productsVal, setProductsVal] = useState(productList);

  useEffect(() => {
    setProductsVal(productList);
  }, [productList]);

  const productOptionDisplayHandler = (product, item) => {
    let productName =
      product.name + " " + product.type + " " + product.capacity;

    if (productName === item.product) {
      return (
        <option selected value={productName}>
          {productName}
        </option>
      );
    } else {
      let flag = true;
      productsVal.forEach((prod) => {
        if (prod.product === productName) {
          flag = false;
        }
      });
      if (flag) {
        return <option value={productName}>{productName}</option>;
      } else {
        return null;
      }
    }
  };

  const unitOptionDisplayHandler = (product, item) => {
    let productName =
      product.name + " " + product.type + " " + product.capacity;

    if (productName === item.product) {
      if (product.unit === item.unit) {
        return (
          <option value={product.unit} selected>
            {product.unit}
          </option>
        );
      } else {
        return <option value={product.unit}>{product.unit}</option>;
      }
    } else {
      return null;
    }
  };

  return (
    <>
      {productsVal.map((item) => {
        return (
          <div className={style.productBox} data-testid="productBox">
            <BsTrashFill
              className={style.trashIcon}
              onClick={() => deleteHandler(item)}
            />
            <div className={style.selectBox}>
              <div className={style.selectBox}>
                <select
                  placeholder="Wybierz produkt"
                  defaultValue={item.product}
                  className={style.select}
                  onChange={(event) =>
                    changeProductHandler(item.id, event.target.value)
                  }
                >
                  <option value={null}>Wybierz produkt</option>
                  {products &&
                    !loadingProducts &&
                    products.products.map((product) =>
                      productOptionDisplayHandler(product, item)
                    )}
                </select>
              </div>
            </div>
            <div className={style.selectBox}>
              <div className={style.selectBox}>
                <select
                  placeholder="Wybierz jednostkę"
                  defaultValue={item.unit}
                  className={style.select}
                  disabled={
                    item.product !== null && item.product !== "Wybierz produkt"
                      ? false
                      : true
                  }
                  onChange={(event) =>
                    changeUnitHandler(item.id, event.target.value)
                  }
                >
                  <option value={null}>Wybierz jednostkę</option>
                  {products &&
                    !loadingProducts &&
                    products.products.map((product) =>
                      unitOptionDisplayHandler(product, item)
                    )}
                </select>
              </div>
            </div>
            <div className={style.inputBox}>
              <input
                defaultValue={item.quantity}
                type="number"
                disabled={
                  item.product !== null && item.product !== "Wybierz produkt"
                    ? false
                    : true
                }
                min={0}
                placeholder="Ilość"
                onChange={(event) =>
                  quantityUnitHandler(item.id, event.target.value)
                }
              />
            </div>
          </div>
        );
      })}
      <div
        className={style.productBox}
        onClick={addProductInputCounter}
        data-testid="addBtn"
      >
        <FaPlus className={style.plusIcon} />
      </div>
    </>
  );
};

export default ProductList;
