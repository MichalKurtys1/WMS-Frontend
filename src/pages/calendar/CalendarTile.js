import { useState, useEffect } from "react";
import { BsDot } from "react-icons/bs";

const CalendarTile = ({ date, events }) => {
  const [isEvent, setIsEvent] = useState(false);

  useEffect(() => {
    const hasEvent = events.some((event) => {
      const eventTime = new Date(+event.date).toISOString().split("T")[0];
      const tileTime = new Date(date.getTime()).toISOString().split("T")[0];
      return eventTime === tileTime;
    });
    setIsEvent(hasEvent);
  }, [date, events]);

  return (
    <>
      {isEvent && (
        <p>
          <BsDot style={{ color: "#3054f2", fontSize: 26 }} />
        </p>
      )}
    </>
  );
};

export default CalendarTile;
