import { useMemo, useState } from "react";
import type { FunctionComponent } from "react";
import type { RouterOutputs } from "../utils/api";
import type { PaginationState } from "@tanstack/react-table";
import Image from "next/image";
import arsenalBadge from "../../public/badges/arsenal.png";
import {
    createColumnHelper,
    getCoreRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table";
import React from "react";
import { api } from "../utils/api";
import TeamPopup from "./TeamPopup";

type league = RouterOutputs["league"]["getLeague"];
type row = league[0];
type Props = {
    season: string;
    tablePageIndex: number;
    tablePageSize: number;
    tablePageCount: number;
};

const Table: FunctionComponent<Props> = ({
    season,
    tablePageIndex,
    tablePageSize,
    tablePageCount,
}) => {
    const columnHelper = createColumnHelper<row>();
    const [team, setTeam] = useState<string>("No team selected");
    const [showTeamPopup, setShowTeamPopup] = useState<boolean>(false);

    const columns = useMemo(
        () => [
            columnHelper.accessor("position", {
                header: "Position",
            }),
            columnHelper.accessor("team", {
                header: "Club",
                cell: (info) => (
                    <div className="flex flex-row">
                        <div className="mr-3">
                            <Image
                                src={arsenalBadge}
                                alt="temporary badge filler"
                            ></Image>{" "}
                        </div>
                        {info.getValue()}
                    </div>
                ),
            }),
            columnHelper.accessor("matches_played", {
                header: "Played",
            }),
            columnHelper.accessor("wins", {
                header: "Won",
            }),
            columnHelper.accessor("draws", {
                header: "Drawn",
            }),
            columnHelper.accessor("losses", {
                header: "Lost",
            }),
            columnHelper.accessor("goals_for", {
                header: "GF",
            }),
            columnHelper.accessor("goals_against", {
                header: "GA",
            }),
            columnHelper.accessor("goal_difference", {
                header: "GD",
            }),
            columnHelper.accessor("points", {
                header: "Points",
            }),
        ],
        [columnHelper],
    );

    const [{ pageIndex, pageSize }, setPagination] =
        React.useState<PaginationState>({
            pageIndex: tablePageIndex,
            pageSize: tablePageSize,
        });

    const leagueData = api.league.getLeague.useQuery(
        {
            season: season,
            gameweek: tablePageIndex,
        },
        { keepPreviousData: true },
    );

    const defaultData = useMemo(() => [], []);

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize],
    );

    const table = useReactTable({
        data: leagueData.data ?? defaultData,
        columns,
        pageCount: tablePageCount,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
            columnVisibility: { gameweek: false },
        },
        manualPagination: true,
    });

    const rowDblClickHandler = (team: string) => {
        setTeam(team);
        setShowTeamPopup(true);
    };

    const onPopupClose = () => {
        setTeam("");
        setShowTeamPopup(false);
        document.body.style.overflow = "auto";
    };

    return (
        <div className="relative">
            {showTeamPopup ? (
                <TeamPopup
                    team={team}
                    gameweek={
                        //100 will change the api query to return final gameweek results instead of specific gameweek
                        tablePageIndex === tablePageCount ? 100 : tablePageIndex
                    }
                    onClose={onPopupClose}
                />
            ) : null}
            <table
                id="table"
                className="w-full border-collapse border-spacing-y-0 text-lg"
            >
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr
                            key={headerGroup.id}
                            className="rounded border-0 border-black"
                        >
                            {headerGroup.headers.map((header) => (
                                <th
                                    className="bg-gray-50 py-4 px-5 font-mono text-base text-gray-500 first:rounded-tl first:rounded-bl last:rounded-tr last:rounded-br"
                                    key={header.id}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className='before:block before:leading-4 before:text-transparent before:content-["@"]'>
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            className="cursor-pointer border-2 border-transparent border-b-black last:border-none"
                            onDoubleClick={() => {
                                const team: string = row
                                    .getVisibleCells()
                                    .find((cell) => {
                                        return cell.column.id === "team";
                                    })
                                    ?.getValue() as string;
                                rowDblClickHandler(team);
                            }}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    className="border-transparent bg-gray-50 py-4 text-center font-mono first:rounded-tl first:rounded-bl last:rounded-tr last:rounded-br"
                                    key={cell.id}
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default Table;
