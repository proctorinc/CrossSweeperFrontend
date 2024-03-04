import { FC } from "react";
import { GameStep } from "../models";

type CellProps = {
  isHighlighted: boolean;
  value: string;
  status: string;
  gameStep: GameStep;
  onClick: () => void;
};

const Cell: FC<CellProps> = ({
  isHighlighted,
  value,
  status,
  gameStep,
  onClick,
}) => {
  let cellStyle =
    "border-gray-300 bg-white text-black hover:bg-yellow-200 hover:border-yellow-400";

  if (
    gameStep === GameStep.guessHorizontal ||
    gameStep === GameStep.guessVertical
  ) {
    cellStyle = "border-gray-300 bg-white text-black";
  }

  if (status === "correct" && isHighlighted) {
    cellStyle =
      "border-green-500 bg-yellow-300 text-green-500 shadow-md shadow-gray-400 animate-pulse";
  } else if (status === "incorrect" && isHighlighted) {
    cellStyle =
      "border-red-500 bg-yellow-300 text-red-500 shadow-md shadow-gray-400 animate-pulse";
  } else if (isHighlighted) {
    cellStyle =
      "border-yellow-500 bg-yellow-300 text-yellow-600 shadow-lg shadow-gray-400 animate-pulse";
  } else if (status === "correct" && value === " ") {
    cellStyle = "border-gray-400 bg-gray-300";
  } else if (status === "correct") {
    cellStyle = "border-green-500 bg-green-300 text-green-600";
  } else if (status === "incorrect") {
    cellStyle = "border-red-500 bg-red-300 text-red-600";
  }

  return (
    <button
      onClick={() => onClick()}
      disabled={
        gameStep === GameStep.guessHorizontal ||
        gameStep === GameStep.guessVertical ||
        status === "correct"
      }
      className={`border h-6 w-6 md:h-8 md:w-8 md:text-xl flex justify-center shadow-sm font-bold rounded-sm items-center aspect-square ${cellStyle}`}
    >
      {status === "hidden" ? null : value}
    </button>
  );
};

export default Cell;
