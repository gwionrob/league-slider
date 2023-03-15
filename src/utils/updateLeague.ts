import { Client } from "pg";
import { Tabletojson } from "tabletojson";

const client: Client = new Client({
    host: "127.0.0.1",
    user: "postgres",
    database: "database_name",
    password: "asdf",
    port: 5432,
});

type TableJSON = {
    9: string;
    "#": string;
    Team: string;
    "M.": string;
    W: string;
    D: string;
    L: string;
    goals: string;
    "Dif.": string;
    "Pt.": string;
};

export const updateLeague = async (
    currentMaxGW: number,
    currentSeason: string,
) => {
    try {
        console.log("trying to update league");
        const url = `https://www.worldfootball.net/schedule/eng-premier-league-${currentSeason}-spieltag/${currentMaxGW}`;
        let table = [];
        await Tabletojson.convertUrl(
            url,
            function (tables: Array<Array<TableJSON>>) {
                console.log(Object.values(tables[3][0]));
            },
        );
    } catch (error) {
        console.log(error);
    }
};
