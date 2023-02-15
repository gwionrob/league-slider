import type { ChangeEventHandler, FunctionComponent } from "react";

type Props = {
    season: string;
    seasons: Array<string | null>;
    onSeasonChange: ChangeEventHandler<HTMLSelectElement>;
};

const Config: FunctionComponent<Props> = ({
    season,
    seasons,
    onSeasonChange,
}) => {
    return (
        <div id="config-container" className="h-1/2 w-full">
            <label
                htmlFor="season-select"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
                Season: {season}
            </label>
            <select
                id="season-select"
                className="mb-4 mt-3"
                value={season}
                onChange={onSeasonChange}
            >
                {seasons
                    ? seasons.map((season, index) => {
                          return <option key={index}>{season}</option>;
                      })
                    : "Data Loading..."}
            </select>
        </div>
    );
};
export default Config;
