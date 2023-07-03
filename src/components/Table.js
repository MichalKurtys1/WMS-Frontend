import { pickProperties } from "../utils/objFormatting";
import style from "./Table.module.css";
import TableRow from "./TableRow";

const Table = (props) => {
  return (
    <table className={style.table}>
      <thead>
        <tr>
          {props.titles.map((name) => (
            <th key={name}>{name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.data.map((record) => {
          const id = record.id;
          const formattedData = pickProperties(record, props.format);
          let keys = Object.keys(formattedData);
          return (
            <TableRow
              key={id}
              id={id}
              keys={keys}
              record={formattedData}
              selectedRow={props.selectedRow}
              selectHandler={props.selectHandler}
            />
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;