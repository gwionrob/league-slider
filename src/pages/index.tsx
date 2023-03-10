import type { NextPage } from "next";
import Head from "next/head";
import type { ChangeEventHandler } from "react";
import { useState } from "react";
import LeagueSlider from "../components/leagueSlider";
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

    const onSeasonChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
        setSeason(event.target.value);
    };

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
                </div>
                <LeagueSlider season={season}></LeagueSlider>
            </main>
        </>
    );
};

export default Home;
