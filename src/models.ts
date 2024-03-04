export enum GameStep {
  chooseCell = "choose-cell",
  guessHorizontal = "guess-horizontal",
  guessVertical = "guess-vertical",
  gameOver = "game-over",
}

export type GameState = {
  gameId: string;
  board: {
    value: string;
    status: string;
    isHighlighted: boolean;
  }[][];
  step: GameStep;
  totalGuesses: number;
  totalCellsClicked: number;
  score: number;
  guess: {
    verticalWord: string | null;
    horizontalWord: string | null;
    hint: string | null;
  };
};
