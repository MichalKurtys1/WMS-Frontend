import { useState } from "react";
import { useEffect } from "react";
import { BsDot } from "react-icons/bs";

const CalendarTile = ({ date, events }) => {
  const [isEvent, setIsEvent] = useState(false);

  useEffect(() => {
    events.forEach((event) => {
      let eventTime = new Date(+event.date).toISOString().split("T")[0];
      let tileTime = new Date(date.getTime()).toISOString().split("T")[0];
      if (eventTime === tileTime) {
        setIsEvent(true);
      }
    });
  });

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
