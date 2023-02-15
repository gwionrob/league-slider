import type { NextPage } from "next";
import Head from "next/head";
import type { ChangeEventHandler } from "react";
import { useState, useEffect } from "react";
import Table from "../components/table";
import Slider from "../components/slider";
import Config from "../components/config";
import { api } from "../utils/api";

const Home: NextPage = () => {
    const seasons = api.league.getSeasons
        .useQuery()
        .data?.map((obj) => obj.season);
    const maxSeason = seasons
        ? (seasons[seasons.length - 1] as string)
        : "2022-2023";
    const [season, setSeason] = useState<string>(maxSeason);
    const maxGameweek = api.league.getMaxGameweek.useQuery({
        season: season,
    }).data?._max.gameweek;
    const [gameweek, setGameweek] = useState<number>(1);
    const league = api.league.getLeague.useQuery({ season: season });

    const onSeasonChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
        setSeason(event.target.value);
    };

    const onSliderChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setGameweek(Number(event.target.value));
    };

    useEffect(() => {
        if (maxGameweek) {
            setGameweek(maxGameweek);
        }
    }, [maxGameweek]);

    return (
        <>
            <Head>
                <title>Premier League Slider</title>
                <meta
                    name="description"
                    content="Interactive slider to navigate through previous gameweeks of the Premier League"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#943dff] to-[#7b5dfe]">
                <div id="options" className="flex h-1/4 w-4/5 flex-col">
                    <Config
                        season={season}
                        seasons={seasons ?? ["Failed to retrieve seasons..."]}
                        onSeasonChange={onSeasonChange}
                    ></Config>
                    <Slider
                        max={maxGameweek ?? 1}
                        value={gameweek}
                        rangeHandler={onSliderChange}
                    ></Slider>
                </div>
                <div id="table-container">
                    {league.data ? (
                        <Table
                            tableRows={league.data.filter(
                                (row) => row.gameweek === gameweek,
                            )}
                        ></Table>
                    ) : (
                        "Loading league data..."
                    )}
                </div>
            </main>
        </>
    );
};

export default Home;
