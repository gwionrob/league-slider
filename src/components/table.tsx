import type { FunctionComponent } from "react";
import type { RouterOutputs } from "../utils/api";
import type { Column } from "react-table";
import { useTable } from "react-table";
import React from "react";

type league = RouterOutputs["league"]["getLeague"];
type Props = {
    tableHeaders: Array<string>;
    tableRows: league;
};

const titleCase = (s: string) =>
    s.replace(/^_*(.)|_+(.)/g, (s, c: string, d: string) =>
        c ? c.toUpperCase() : " " + d.toUpperCase(),
    );

const Table: FunctionComponent<Props> = ({ tableHeaders, tableRows }) => {
    const columns = React.useMemo(() => {
        const cols: Array<Column> = [];
        for (const header of tableHeaders) {
            cols.push({
                Header: titleCase(header),
                accessor: header,
            });
        }
        return cols;
    }, [tableHeaders]);

    const data = React.useMemo(() => tableRows, [tableRows]);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data });

    return (
        <table {...getTableProps()} style={{ border: "solid 2px blue" }}>
            <thead>
                {headerGroups.map((headerGroup, index_header_row) => (
                    <tr
                        {...headerGroup.getHeaderGroupProps()}
                        key={index_header_row}
                    >
                        {headerGroup.headers.map((column, index_headers) => (
                            <th
                                {...column.getHeaderProps()}
                                style={{
                                    borderBottom: "solid 3px red",
                                    background: "aliceblue",
                                    color: "black",
                                    fontWeight: "bold",
                                }}
                                key={index_headers}
                            >
                                {column.render("Header")}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, index_rows) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()} key={index_rows}>
                            {row.cells.map((cell, index_cell) => {
                                return (
                                    <td
                                        {...cell.getCellProps()}
                                        style={{
                                            padding: "10px",
                                            border: "solid 1px gray",
                                            background: "papayawhip",
                                        }}
                                        key={index_cell}
                                    >
                                        {cell.render("Cell")}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};
export default Table;
