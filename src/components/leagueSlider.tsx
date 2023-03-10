import type { FunctionComponent, ChangeEventHandler } from "react";
import { useState, useEffect } from "react";
import Table from "../components/table";
import Slider from "../components/slider";
import { api } from "../utils/api";

type Props = {
    season: string;
};

const LeagueSlider: FunctionComponent<Props> = ({ season }) => {
    const maxGameweek = api.league.getMaxGameweek.useQuery({ season: season })
        .data?._max.gameweek;
    const [gameweek, setGameweek] = useState<number>(maxGameweek ?? 1);

    useEffect(() => {
        setGameweek(maxGameweek ?? 1);
    }, [maxGameweek]);

    const onSliderChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setGameweek(parseInt(event.target.value));
    };

    return (
        <div id="table-container">
            <Slider
                max={maxGameweek ?? 1}
                value={gameweek}
                rangeHandler={onSliderChange}
            ></Slider>
            <Table
                season={season}
                tablePageIndex={gameweek}
                tablePageSize={10}
                tablePageCount={gameweek}
            ></Table>
        </div>
    );
};
export default LeagueSlider;
