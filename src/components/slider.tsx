import type { ChangeEventHandler, FunctionComponent } from "react";

type Props = {
    max: number;
    value: number;
    rangeHandler: ChangeEventHandler<HTMLInputElement>;
};

const Slider: FunctionComponent<Props> = ({ max, value, rangeHandler }) => {
    return (
        <div id="slider-container" className="h-1/2 w-full">
            <label
                htmlFor="gameweek-range"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
                Gameweek: {value}
            </label>
            <input
                id="gameweek-range"
                type="range"
                min="1"
                max={max}
                value={value}
                className="mb-4 mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                onChange={rangeHandler}
            ></input>
        </div>
    );
};
export default Slider;
