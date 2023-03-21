import type { FunctionComponent, ChangeEventHandler } from "react";
import type { RouterOutputs } from "../utils/api";
import { useState } from "react";
import Table from "../components/Table";
import Slider from "../components/Slider";
import { api } from "../utils/api";

type Props = {
    season: string;
};

const LeagueSlider: FunctionComponent<Props> = ({ season }) => {
    const setData = (data: RouterOutputs["league"]["getMaxGameweek"]) => {
        if (!data) return;
        if (data._max.gameweek) {
            const newMaxGameweek = data._max.gameweek;
            setMaxGameweek(newMaxGameweek);
            setGameweek(newMaxGameweek);
            if (!leagueUpdated) {
                updateLeague.mutate({
                    gameweek: newMaxGameweek,
                    season: season,
                });
                setLeagueUpdated(true);
            }
        }
    };
    const { isLoading } = api.league.getMaxGameweek.useQuery(
        {
            season: season,
        },
        { onSuccess: setData },
    );
    const updateLeague = api.league.updateLeague.useMutation();
    const [maxGameweek, setMaxGameweek] = useState<number>(1);
    const [gameweek, setGameweek] = useState<number>(1);
    const [leagueUpdated, setLeagueUpdated] = useState<boolean>(false);

    const onSliderChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setGameweek(parseInt(event.target.value));
    };

    if (isLoading) {
        return <div></div>;
    }

    return (
        <div id="main-container" className="flex flex-col">
            <Slider
                max={maxGameweek}
                value={gameweek}
                rangeHandler={onSliderChange}
            />
            <Table
                season={season}
                tablePageIndex={gameweek}
                tablePageSize={10}
                tablePageCount={maxGameweek}
            />
        </div>
    );
};
export default LeagueSlider;
