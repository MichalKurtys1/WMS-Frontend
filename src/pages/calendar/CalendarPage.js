import { FaAngleLeft, FaCheck, FaMinus, FaPlus } from "react-icons/fa";
import style from "./CalendarPage.module.css";
import "./Calendar.css";
import { useNavigate } from "react-router";
import Calendar from "react-calendar";
import { useState } from "react";
import CalendarTile from "./CalendarTile";
import { dateToPolish } from "../../utils/dateFormatters";
import {
  GET_CALENDAR,
  GET_DELIVERIES,
  GET_ORDERS,
  GET_ORDER_SHIPMENTS,
} from "../../utils/apollo/apolloQueries";
import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_CALENDAR,
  DELETE_CALENDAR,
} from "../../utils/apollo/apolloMutations";
import ErrorHandler from "../../components/ErrorHandler";
import { getAuth } from "../../context";

const CalendarPage = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(new Date());
  const [activeEvent, setActiveEvent] = useState([]);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [timeValue, setTimeValue] = useState();
  const [eventValue, setEventValue] = useState();
  const [error, setError] = useState();
  const { position } = getAuth();
  const { data, refetch } = useQuery(GET_CALENDAR, {
    onError: (error) => setError(error),
  });
  const { data: orders } = useQuery(GET_ORDERS, {
    onError: (error) => setError(error),
  });
  const { data: deliveries } = useQuery(GET_DELIVERIES, {
    onError: (error) => setError(error),
  });
  const [addEvent] = useMutation(ADD_CALENDAR, {
    onError: (error) => setError(error),
  });
  const [deleteEvent] = useMutation(DELETE_CALENDAR, {
    onError: (error) => setError(error),
  });
  const { data: shipments } = useQuery(GET_ORDER_SHIPMENTS, {
    onError: (error) => setError(error),
  });

  const deleteHandler = (id) => {
    deleteEvent({
      variables: {
        deleteCalendarId: id,
      },
    }).then((data) => {
      setAddIsOpen(false);
      refetch();
    });

    if (activeEvent.length > 0) {
      setActiveEvent((prev) => [...prev.filter((item) => item.id !== id)]);
    } else {
      setActiveEvent([]);
    }
  };

  const dayClickHandler = (date) => {
    const filteredEvents = eventsHandler().filter(
      (event) =>
        new Date(+event.date).toISOString().split("T")[0] ===
        new Date(date.getTime()).toISOString().split("T")[0]
    );
    if (filteredEvents.length === 0) {
      setActiveEvent(date.getTime());
    } else {
      setActiveEvent(filteredEvents);
    }
  };

  const addHandler = (e) => {
    e.preventDefault();
    addEvent({
      variables: {
        date:
          activeEvent.length > 0
            ? activeEvent[0].date.toString()
            : activeEvent.toString(),
        time: timeValue.toString(),
        event: eventValue.toString(),
      },
    }).then((data) => {
      setAddIsOpen(false);
      refetch();
    });
    if (activeEvent.length > 0) {
      setActiveEvent((prev) => [
        ...prev,
        {
          date: activeEvent.length > 0 ? activeEvent[0].date : activeEvent,
          time: timeValue,
          event: eventValue,
        },
      ]);
    } else {
      setActiveEvent([
        {
          date: activeEvent.length > 0 ? activeEvent[0].date : activeEvent,
          time: timeValue,
          event: eventValue,
        },
      ]);
    }
  };

  const eventsHandler = () => {
    let results = [];
    if (
      deliveries &&
      orders &&
      data &&
      shipments &&
      position !== "Przewoźnik"
    ) {
      let deli = deliveries.deliveries.map((item) => {
        return {
          date: +item.expectedDate - 24 * 60 * 60 * 1000,
          time: "--:--",
          event: "Dostawa " + item.supplier.name,
        };
      });
      let orde = orders.orders.map((item) => {
        return {
          date: +item.expectedDate - 24 * 60 * 60 * 1000,
          time: "--:--",
          event: "Zamówienie " + item.client.name,
        };
      });
      let ship = shipments.orderShipments.map((item) => {
        return {
          date: (
            new Date(item.deliveryDate).getTime() -
            24 * 60 * 60 * 1000
          ).toString(),
          time: "--:--",
          event: "Wysyłka " + item.employee,
        };
      });
      let cale = data.calendar;
      results = cale.concat(orde, deli, ship);
    }
    if (shipments && position === "Przewoźnik") {
      let ship = shipments.orderShipments.map((item) => {
        return {
          date: (
            new Date(item.deliveryDate).getTime() -
            24 * 60 * 60 * 1000
          ).toString(),
          time: "--:--",
          event: "Wysyłka " + item.employee,
        };
      });
      let cale = data.calendar;
      results = cale.concat(ship);
    }
    return results;
  };

  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../assets/logo.png")}
          alt="logo"
        />
        <div className={style.returnBox} onClick={() => navigate("/")}>
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <ErrorHandler error={error} />
      {data && orders && deliveries && (
        <>
          <div className={style.calendarContainer}>
            <h1>Kalendarz</h1>
            <Calendar
              onChange={setValue}
              value={value}
              minDetail="month"
              maxDetail="month"
              defaultView="month"
              defaultValue={value}
              onClickDay={(value, event) => dayClickHandler(value)}
              tileContent={({ date }) => (
                <CalendarTile date={date} events={eventsHandler()} />
              )}
            />
          </div>
          {activeEvent.length > 0 && (
            <div className={style.eventBox}>
              <h2>
                {dateToPolish(activeEvent[0].date)
                  .split(" ")
                  .slice(0, 3)
                  .join(" ")}{" "}
                <FaPlus
                  className={style.plusIcon}
                  onClick={() => setAddIsOpen(!addIsOpen)}
                />
              </h2>
              <div className={style.eventContainer}>
                {addIsOpen && (
                  <form className={style.addBox} onSubmit={addHandler}>
                    <input
                      type="time"
                      onChange={(e) => setTimeValue(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Wydarzenie"
                      onChange={(e) => setEventValue(e.target.value)}
                      required
                    />
                    <button type="submit">
                      <FaCheck className={style.addIcon} />
                    </button>
                  </form>
                )}
                {activeEvent.map((event) => (
                  <>
                    <div className={style.event}>
                      <h3>{event.time}</h3>
                      <p>{event.event}</p>
                    </div>
                    {event.time !== "--:--" && (
                      <FaMinus
                        className={style.minusIcon}
                        onClick={() => deleteHandler(event.id)}
                      />
                    )}
                  </>
                ))}
              </div>
            </div>
          )}
          {typeof activeEvent === "number" && (
            <div className={style.eventBox}>
              <h2>
                {dateToPolish(activeEvent).split(" ").slice(0, 3).join(" ")}{" "}
                <FaPlus
                  className={style.plusIcon}
                  onClick={() => setAddIsOpen(!addIsOpen)}
                />
              </h2>
              <div className={style.eventContainer}>
                {addIsOpen && (
                  <div className={style.addBox}>
                    <input
                      type="time"
                      onChange={(e) => setTimeValue(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Wydarzenie"
                      onChange={(e) => setEventValue(e.target.value)}
                    />
                    <button onClick={addHandler}>
                      <FaCheck className={style.addIcon} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CalendarPage;
