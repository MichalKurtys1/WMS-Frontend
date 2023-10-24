import { FaCheck, FaMinus, FaPlus } from "react-icons/fa";
import style from "./CalendarPage.module.css";
import "./Calendar.css";
import Calendar from "react-calendar";
import { useEffect, useState } from "react";
import CalendarTile from "./CalendarTile";
import { dateToPolish } from "../../utils/dateFormatters";
import ErrorHandler from "../../components/ErrorHandler";
import { getAuth } from "../../context";
import Header from "../../components/Header";
import { useCalendar } from "../../hooks/useCalendar";
import Loading from "../../components/Loading";

const CalendarPage = () => {
  const [value, setValue] = useState();
  const [activeEvent, setActiveEvent] = useState([]);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [timeValue, setTimeValue] = useState();
  const [eventValue, setEventValue] = useState();
  const { position } = getAuth();
  const { error, loading, data, addEvent, deleteEvent, refetch } =
    useCalendar();
  const [events, setEvents] = useState();

  useEffect(() => {
    let results = [];
    if (
      data &&
      data.deliveries &&
      data.orders &&
      data.calendar &&
      data.shipments &&
      position !== "Przewoźnik"
    ) {
      let deli = data.deliveries
        .map((item) => {
          if (item.state !== "Zakończono") {
            return {
              date: +item.expectedDate - 24 * 60 * 60 * 1000,
              time: "--:--",
              event: "Dostawa " + item.supplier.name,
            };
          } else {
            return null;
          }
        })
        .filter((item) => item !== null && Object.keys(item).length !== 0);
      let orde = data.orders
        .map((item) => {
          if (item.state !== "Zakończono") {
            return {
              date: +item.expectedDate - 24 * 60 * 60 * 1000,
              time: "--:--",
              event: "Zamówienie " + item.client.name,
            };
          } else {
            return null;
          }
        })
        .filter((item) => item !== null && Object.keys(item).length !== 0);
      let ship = data.shipments
        .map((item) => {
          if (item.state !== "Zakończono") {
            return {
              date: (
                new Date(item.deliveryDate).getTime() -
                24 * 60 * 60 * 1000
              ).toString(),
              time: "--:--",
              event: "Wysyłka " + item.employee,
            };
          } else {
            return null;
          }
        })
        .filter((item) => item !== null && Object.keys(item).length !== 0);
      let cale = data.calendar;
      results = cale.concat(orde, deli, ship);
      setEvents(results);
    }
    if (data && data.shipments && data.calendar && position === "Przewoźnik") {
      let ship = data.shipments.map((item) => {
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
      setEvents(results);
    }
  }, [data, position]);

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
      if (!data.data) return;
      setAddIsOpen(false);
      refetch();
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
    });
  };

  const deleteHandler = (id) => {
    deleteEvent({
      variables: {
        deleteCalendarId: id,
      },
    }).then((data) => {
      if (!data.data) return;
      setAddIsOpen(false);
      refetch();
      setEvents((prev) => [...prev.filter((item) => item.id !== id)]);
      if (activeEvent.length > 0) {
        setActiveEvent((prev) => [...prev.filter((item) => item.id !== id)]);
      } else {
        setActiveEvent([]);
      }
    });
  };

  const dayClickHandler = (date) => {
    const filteredEvents = events.filter(
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

  return (
    <div className={style.container}>
      <Header path={"/"} />
      <ErrorHandler error={error} />
      <Loading state={!data && loading} />
      {data && events && (
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
                <CalendarTile date={date} events={events} />
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
