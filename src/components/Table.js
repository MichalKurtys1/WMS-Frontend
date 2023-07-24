import { pickProperties } from "../utils/objFormatting";
import style from "./Table.module.css";
import TableRow from "./TableRow";

const Table = (props) => {
  return (
    <>
      {props.data && (
        <table className={style.table}>
          <thead>
            <tr>
              {props.titles.map((name) => (
                <th key={name}>{name}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {props.data.length !== 0 &&
              props.data.map((record) => {
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
                    editHandler={props.editHandler}
                    detailsHandler={props.detailsHandler}
                    messageHandler={props.messageHandler}
                    deleteHandler={props.deleteHandler}
                    selectedRowHandler={props.selectedRowHandler}
                  />
                );
              })}
          </tbody>
        </table>
      )}
      {props.data.length === 0 && (
        <p className={style.emptyData}>Nie znaleziono żadnych danych</p>
      )}
    </>
  );
};

export default Table;
