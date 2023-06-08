import style from "./Table.module.css";

const namesList = ["Imię", "Nazwisko", "Stanowisko", "Status"];

const valuseList = [
  {
    name: "Jan",
    surname: "Kowalski",
    position: "Magazynier",
    status: "Online",
  },
  {
    name: "Jan",
    surname: "Kowalski",
    position: "Magazynier",
    status: "Online",
  },
  {
    name: "Jan",
    surname: "Kowalski",
    position: "Magazynier",
    status: "Online",
  },
  {
    name: "Jan",
    surname: "Kowalski",
    position: "Magazynier",
    status: "Online",
  },
  {
    name: "Jan",
    surname: "Kowalski",
    position: "Magazynier",
    status: "Online",
  },
];

const Table = (props) => {
  return (
    <table className={style.table}>
      <thead>
        <tr>
          {namesList.map((name) => (
            <th>{name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {valuseList.map((record) => {
          let keys = Object.keys(record);
          return (
            <tr>
              {keys.map((value) => {
                console.log(record[value]);

                return <td>{record[value]}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
