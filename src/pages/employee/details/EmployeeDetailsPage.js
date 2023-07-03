import { useLocation, useNavigate } from "react-router";
import style from "./EmployeeDetailsPage.module.css";
import { FaEnvelope } from "react-icons/fa";
import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";

const logData = [
  { date: "10 stycznia 2023r", time: "3h 10min", from: "10.21", to: "13.31" },
  { date: "10 stycznia 2023r", time: "3h 10min", from: "10.21", to: "13.31" },
  { date: "10 stycznia 2023r", time: "3h 10min", from: "10.21", to: "13.31" },
  { date: "10 stycznia 2023r", time: "3h 10min", from: "10.21", to: "13.31" },
  { date: "10 stycznia 2023r", time: "3h 10min", from: "10.21", to: "13.31" },
  { date: "10 stycznia 2023r", time: "3h 10min", from: "10.21", to: "13.31" },
];

const GETUSER = gql`
  mutation Mutation($getUserId: String!) {
    getUser(id: $getUserId) {
      id
      email
      firstname
      lastname
      phone
      magazine
      position
      adres
    }
  }
`;

const EmployeeDetailsPage = () => {
  const navigate = useNavigate();
  const [getUser, { loading }] = useMutation(GETUSER);
  const location = useLocation();
  const [data, setData] = useState();

  useEffect(() => {
    getUser({
      variables: {
        getUserId: location.state.userId,
      },
    })
      .then((data) => {
        setData(data.data.getUser);
        console.log(data.data.getUser);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [getUser, location.state.userId]);

  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../../assets/logo.png")}
          alt="logo"
        />
        <div className={style.titleDescription}>
          <h1>Pracownicy</h1>
          <p>Szczegóły</p>
        </div>
      </div>
      {data && !loading && (
        <>
          <main>
            <div className={style.personalData}>
              <div className={style.header}>
                <p>Dane osobowe</p>
                <button>
                  <FaEnvelope className={style.icon} />
                  Wyślij Wiadomość
                </button>
              </div>
              <div className={style.infoBox}>
                <div className={style.info}>
                  <h1>Imię i Nazwisko</h1>
                  <p>
                    {data.firstname} {data.lastname}
                  </p>
                </div>
                <div className={style.info}>
                  <h1>Stanowisko</h1>
                  <p>{data.position}</p>
                </div>
                <div className={style.info}>
                  <h1>Adres zamieszkania</h1>
                  <p>{data.adres}</p>
                </div>
                <div className={style.info}>
                  <h1>Magazyn</h1>
                  <p>{data.magazine}</p>
                </div>
                <div className={style.info}>
                  <h1>Adres e-mail</h1>
                  <p>{data.email}</p>
                </div>
                <div className={style.info}>
                  <h1>Numer Telefonu</h1>
                  <p>{data.phone}</p>
                </div>
              </div>
            </div>
          </main>
          <main>
            <div className={style.personalData}>
              <div className={style.header}>
                <p>Ostatnie daty logowania</p>
              </div>
              <div className={style.historyBox}>
                {logData.map((item) => (
                  <div className={style.historyRow}>
                    <h2>
                      <strong>{item.date}</strong>
                    </h2>
                    <h2>
                      Czas: <strong>{item.time}</strong>
                    </h2>
                    <h2>
                      Od: <strong>{item.from}</strong>
                    </h2>
                    <h2>
                      Do: <strong>{item.to}</strong>
                    </h2>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default EmployeeDetailsPage;
