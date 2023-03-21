import { useEffect, useState } from "react";
import { api } from "../utils/api";
import type { FunctionComponent, MouseEventHandler } from "react";
import type { RouterOutputs } from "../utils/api";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

type Props = {
    team: string;
    gameweek: number;
    onClose: MouseEventHandler;
};
type Data = {
    seasons: Array<string | null>;
    positions: Array<number | null>;
};

const TeamPopup: FunctionComponent<Props> = ({ team, gameweek, onClose }) => {
    const setData = (data: RouterOutputs["league"]["getLeaguePosition"]) => {
        if (!data) return;
        console.log(data);
        setChartData({
            seasons: data.map((point) => point.season),
            positions: data.map((point) => point.position),
        });
    };
    const { isLoading } = api.league.getLeaguePosition.useQuery(
        {
            team: team,
            gameweek: gameweek,
        },
        { onSuccess: setData },
    );
    const [chartData, setChartData] = useState<Data>({
        seasons: [],
        positions: [],
    });

    useEffect(() => {
        document.body.style.overflow = "hidden";
    });

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
    );

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: `${team}'s historical Premier League position during ${
                    gameweek === 100 ? "Final Gameweek" : `GW ${gameweek}`
                }`,
            },
        },
    };

    const labels = chartData.seasons;

    const data = {
        labels,
        datasets: [
            {
                label: "Positions",
                data: chartData.positions,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
    };
    return (
        <div
            id="popup"
            className="absolute z-10 ml-[-10vw] mt-[-15vh] flex h-[150vh] w-screen justify-center bg-black bg-opacity-40"
        >
            <div
                id="popup-content"
                className="relative mt-[20vh] h-[70vh] w-[70vw] rounded bg-white"
            >
                <div
                    id="popup-close"
                    className="absolute top-0 right-3 cursor-pointer text-3xl font-bold text-red-500"
                    onClick={onClose}
                >
                    &#x2715;
                </div>
                {isLoading ? (
                    <div>Loading</div>
                ) : (
                    <Line options={options} data={data} />
                )}
            </div>
        </div>
    );
};

export default TeamPopup;
