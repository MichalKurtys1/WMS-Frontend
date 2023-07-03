import style from "./TableRow.module.css";

const TableRow = (props) => {
  return (
    <tr
      key={props.id}
      onClick={() => props.selectHandler(props.id)}
      className={`${props.selectedRow === props.id ? style.row : ""}`}
    >
      {props.keys.map((value) => {
        if (value === "id") return null;
        return <td key={`${props.id}-${value}`}>{props.record[value]}</td>;
      })}
    </tr>
  );
};

export default TableRow;
