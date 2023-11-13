import { useEffect, useState } from "react";
import style from "./Loading.module.css";

const Loading = ({ state }) => {
  const [isLoading, setIsLoading] = useState(state);

  useEffect(() => {
    setIsLoading(state);
  }, [state]);

  return (
    <>
      {isLoading && (
        <div className={style.wrapper} data-testid="LoadingComponent">
          <div className={style.spinnerBox}>
            <div className={style.spinner}>
              <div className={style.container}>
                <div className={style.loader}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Loading;
