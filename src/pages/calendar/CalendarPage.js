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
import Loading from "../../components/Loading";
import { useMutation, useQuery } from "@apollo/client";
import { GET_FORMATED_CALENDAR } from "../../utils/apollo/apolloMultipleQueries";
import {
  ADD_CALENDAR,
  DELETE_CALENDAR,
} from "../../utils/apollo/apolloMutations";
import RefreshBtn from "../../components/RefreshBtn";
import { useLocation } from "react-router-dom";

const CalendarPage = () => {
  const location = useLocation();
  const [value, setValue] = useState();
  const [activeEvent, setActiveEvent] = useState({ events: null, date: null });
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [timeValue, setTimeValue] = useState();
  const [eventValue, setEventValue] = useState();
  const { position } = getAuth();
  const [error, setError] = useState();
  const [events, setEvents] = useState();
  const { data, refetch, loading } = useQuery(GET_FORMATED_CALENDAR, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [addEvent] = useMutation(ADD_CALENDAR, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [deleteEvent] = useMutation(DELETE_CALENDAR, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  useEffect(() => {
    if (location.state) {
      refetch();
    }
  }, [location.state, refetch]);

  useEffect(() => {
    if (data && position !== "Przewoźnik") {
      setEvents(data.formatedCalendar.standardData);
    }
    if (data && position === "Przewoźnik") {
      setEvents(data.formatedCalendar.carrierData);
    }
  }, [data, position]);

  const addHandler = (e) => {
    e.preventDefault();
    if (!timeValue || !eventValue) return;

    addEvent({
      variables: {
        date: activeEvent.date.toString(),
        time: timeValue.toString(),
        event: eventValue.toString(),
      },
    }).then((data) => {
      if (!data.data) return;
      setAddIsOpen(false);
      refetch();
      if (activeEvent.events) {
        setActiveEvent({
          date: activeEvent.date,
          events: [
            ...activeEvent.events,
            {
              date: activeEvent.date,
              time: timeValue,
              event: eventValue,
            },
          ],
        });
      } else {
        setActiveEvent({
          events: [
            {
              date: activeEvent.date,
              time: timeValue,
              event: eventValue,
            },
          ],
          date: activeEvent.date,
        });
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
      setEvents((prev) =>
        prev ? [...prev.filter((item) => item.id !== id)] : prev
      );
      setActiveEvent({
        events: activeEvent.events.filter((item) => item.id !== id),
        date: activeEvent.date,
      });
    });
  };

  const dayClickHandler = (date) => {
    setActiveEvent({ events: null, date: null });
    const filteredEvents = events?.filter(
      (event) =>
        new Date(+event.date).toISOString().split("T")[0] ===
        new Date(date.getTime()).toISOString().split("T")[0]
    );
    if (filteredEvents.length === 0 || !filteredEvents) {
      setActiveEvent({ events: null, date: date.getTime() });
    } else {
      setActiveEvent({ events: filteredEvents, date: date.getTime() });
    }
  };

  return (
    <div className={style.container}>
      <Header path={"/"} />
      <ErrorHandler error={error} />
      <Loading state={loading && !error} />
      {data && events && (
        <>
          <div className={style.calendarContainer}>
            <div className={style.header}>
              <h1>Kalendarz</h1>
              <RefreshBtn refetch={refetch} />
            </div>
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
          {activeEvent.events && (
            <div className={style.eventBox}>
              <h2>
                {dateToPolish(activeEvent.date)
                  .split(" ")
                  .slice(0, 3)
                  .join(" ")}{" "}
                <button
                  className={style.plusIcon}
                  onClick={() => setAddIsOpen(!addIsOpen)}
                  data-testid="PlusBtn"
                >
                  <FaPlus />
                </button>
              </h2>
              <div className={style.eventContainer}>
                {addIsOpen && (
                  <form className={style.addBox} onSubmit={addHandler}>
                    <input
                      type="time"
                      placeholder="godzina"
                      onChange={(e) => setTimeValue(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Wydarzenie"
                      onChange={(e) => setEventValue(e.target.value)}
                      required
                    />
                    <button type="submit" data-testid="SubmitBtn">
                      <FaCheck className={style.addIcon} />
                    </button>
                  </form>
                )}
                {activeEvent.events.map((event) => (
                  <div className={style.eventWrapper} key={event.event}>
                    <div className={style.event}>
                      <h3>{event.time}</h3>
                      <p>{event.event}</p>
                    </div>
                    {event.time !== "--:--" && (
                      <button
                        className={style.minusIcon}
                        onClick={() => deleteHandler(event.id)}
                        data-testid="DeleteBtn"
                      >
                        <FaMinus />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {!activeEvent.events && activeEvent.date && (
            <div className={style.eventBox}>
              <h2>
                {dateToPolish(activeEvent.date)
                  .split(" ")
                  .slice(0, 3)
                  .join(" ")}{" "}
                <button
                  className={style.plusIcon}
                  onClick={() => setAddIsOpen(!addIsOpen)}
                  data-testid="PlusBtn"
                >
                  <FaPlus />
                </button>
              </h2>
              <div className={style.eventContainer}>
                {addIsOpen && (
                  <div className={style.addBox}>
                    <input
                      type="time"
                      placeholder="godzina"
                      onChange={(e) => setTimeValue(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Wydarzenie"
                      onChange={(e) => setEventValue(e.target.value)}
                    />
                    <button onClick={addHandler} data-testid="SubmitBtn">
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
