import type { NextPage } from "next";
import type { ChangeEventHandler } from "react";
import type { RouterOutputs } from "../utils/api";
import Head from "next/head";
import { useState } from "react";
import LeagueSlider from "../components/LeagueSlider";
import Config from "../components/Config";
import { api } from "../utils/api";

const Home: NextPage = () => {
    const setData = (data: RouterOutputs["league"]["getSeasons"]) => {
        const newSeasons = data?.map((obj) => obj.season);
        if (newSeasons) {
            const newSeason = newSeasons[newSeasons.length - 1] as string;
            setSeasons(newSeasons);
            setSeason(newSeason);
        }
    };
    const { isLoading } = api.league.getSeasons.useQuery(undefined, {
        onSuccess: setData,
    });
    const [season, setSeason] = useState<string>("Fetching seasons...");
    const [seasons, setSeasons] = useState<Array<string | null>>();

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
                <div id="options" className="flex min-h-[10vh] w-4/5 flex-col">
                    <Config
                        season={season}
                        seasons={seasons ?? [season]}
                        onSeasonChange={onSeasonChange}
                    />
                </div>
                <div
                    id="league-container"
                    className="flex min-h-[90vh] w-4/5 flex-col"
                >
                    {isLoading ? (
                        <p className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                            Table Loading...
                        </p>
                    ) : (
                        <LeagueSlider season={season} />
                    )}
                </div>
            </main>
        </>
    );
};

export default Home;
