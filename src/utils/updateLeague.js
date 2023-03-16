import { Client } from "pg";
import { Tabletojson } from "tabletojson";

export const updateLeague = async (currentMaxGW, currentSeason) => {
    const client = new Client({
        host: "localhost",
        user: "gwionrob",
        database: "league_slider",
        password: "asdf",
        port: 5432,
    });
    client
        .query("SELECT * from league_standings;")
        .then((res) => console.log(res.rows[0]))
        .catch((e) => console.error(e.stack));

    const text =
        "INSERT INTO league_standings(points, position, team, matches_played, wins, losses, draws, goals_for, goals_against, goal_difference, season, gameweek) VALUES($1, $2,$3, $4,$5, $6,$7, $8,$9, $10,$11, $12) RETURNING *";
    const values = [];

    try {
        console.log("trying to update league");
        const url = `https://www.worldfootball.net/schedule/eng-premier-league-${currentSeason}-spieltag/${currentMaxGW}`;
        await Tabletojson.convertUrl(url, function (tables) {
            tables[3]?.forEach((table) => {
                const value = Object.values(table);
                value.forEach((val, index) => {
                    if (!val.length) {
                        value.splice(index, 1);
                    }
                    if (val.includes(":")) {
                        const gd = val.split(":");
                        value.splice(index, 1);
                        value.push(gd[0]);
                        value.push("10");
                        value.push(currentSeason);
                        value.push(currentMaxGW);
                    }
                });
                values.push(value);
            });
        });
    } catch (error) {
        console.log(error);
    }
    values.forEach((value) => {
        client
            .query(text, value)
            .then((res) => {
                console.log(res.rows[0]);
            })
            .catch((e) => console.error(e));
    });
    console.log("league updated");
};
