import styles from './tableStyle.ts';
import React from "react";

const ListTable = ({category, columns, info}) => {
  console.log(info[0]);
  return (
    <table style = {styles.whole_table}>
      <thead style={styles.head_table}>
        <tr>
          {columns.map((col) => (
            <td key = {col.key}>{col.label}</td>
          ))}
        </tr>
      </thead>
      <tbody style = {styles.body_table}>
        {Array.from({ length: Math.min(info.length, 15) }, (_, i) => (
          <tr
            key = {`${info[i].id}_${info[i].userName}`}
          >
            <td style={styles.table_data}>{info[i].id}</td>
            <td style={styles.table_data}>{info[i].userName}</td>
            <td style={styles.table_data}>{info[i].userType}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListTable;