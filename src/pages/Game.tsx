import { useEffect, useState } from "react";
import Cell from "../components/Cell";
import GuessWordForm from "../components/GuessWordForm";
import { GameState, GameStep } from "../models";
import { useNavigate, useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import ErrorScreen from "../components/ErrorScreen";

function Game() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [wordsToGuess, setWordsToGuess] = useState<{
    horizontalWord: (string | null)[] | null;
    verticalWord: (string | null)[] | null;
  }>({ horizontalWord: null, verticalWord: null });
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/api/game/${gameId}`)
      .then((response) => response.json())
      .then((state) => {
        setGameState(state);
        navigate(`/game/${state.gameId}`);
      })
      .catch(() => setError("Invalid game ID"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (gameState && gameState.step === GameStep.gameOver) {
      setModalOpen(true);
    }
  }, [gameState]);

  const handleCellClick = (row: number, column: number) => {
    setFormError("");
    if (gameState !== null && gameState.step === "choose-cell") {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row, column }),
      };
      fetch(
        `http://localhost:3000/api/game/${gameId}/choose-cell`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          setWordsToGuess(data.guess);
          setGameState(data.state);
        })
        .catch((error) => setFormError(error.message));
    }
  };

  const handleWordGuess = async (word: string) => {
    setFormError("");
    if (
      gameState !== null &&
      (gameState.step === "guess-horizontal" ||
        gameState.step === "guess-vertical")
    ) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word,
        }),
      };
      fetch(
        `http://localhost:3000/api/game/${gameId}/guess-word`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          setWordsToGuess(data.guess);
          setGameState(data.state);
        })
        .catch((error) => setFormError(error.message));
    }
  };

  const handleSkipGuess = () => {
    setFormError("");
    if (
      gameState !== null &&
      (gameState.step === "guess-horizontal" ||
        gameState.step === "guess-vertical")
    ) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      };
      fetch(
        `http://localhost:3000/api/game/${gameId}/skip-guess`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          setGameState(data.state);
        })
        .catch((error) => console.error(error));
    }
  };

  if (error) {
    return <ErrorScreen error={error} />;
  }

  if (!gameState) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full h-screen overflow-y-hidden">
      <div className="gap-4 flex h-screen items-center w-full pt-8 md:pb-8 md:px-8 flex-col justify-center">
        <h1 className="text-4xl font-extrabold pb-4">Cross Sweeper</h1>
        {/* <div className="flex flex-col md:flex-row gap-4"> */}
        <div className="flex md:hidden gap-4 items-end max-w-xs justify-between w-full">
          <h2 className="text-sm">Guesses: {gameState.totalGuesses}</h2>
          <h2 className="text-2xl">Score: {gameState.score}</h2>
          <h2 className="text-sm">Clicks: {gameState.totalCellsClicked}</h2>
        </div>
        <div className="max-w-4xl flex-grow flex flex-col w-full md:w-fit border border-gray-300 bg-gray-100 py-5 md:px-5 gap-4 md:rounded-md">
          <div className="flex flex-col items-center w-full gap-1">
            {gameState.board.map((row, i) => {
              return (
                <div key={i} className="flex gap-1">
                  {row.map((_, j) => {
                    const cell = gameState.board[i][j];
                    return (
                      <Cell
                        key={`${i},${j}`}
                        gameStep={gameState.step}
                        isHighlighted={cell.isHighlighted}
                        value={cell.value}
                        status={cell.status}
                        onClick={() => handleCellClick(i, j)}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
          {gameState.step === GameStep.gameOver && (
            <div className="w-full py-4 justify-center items-center flex flex-col gap-4">
              <button
                onClick={() => setModalOpen(true)}
                className="border-2 border-yellow-500 bg-yellow-300 text-yellow-600 font-bold px-4 py-2 text-xl rounded-xl"
              >
                See Results
              </button>
            </div>
          )}
          {gameState.step === "choose-cell" && (
            <div className="w-full py-4 justify-center items-center flex flex-col gap-4">
              <h2 className="">Click on a cell!</h2>
            </div>
          )}
          {(gameState.step === "guess-horizontal" ||
            gameState.step === "guess-vertical") && (
            <div className="w-full py-4 justify-center items-center flex flex-col gap-4">
              {!formError && <h2 className="">Guess the word:</h2>}
              {!!formError && <h2 className="text-red-500">{formError}</h2>}
              {gameState &&
                (gameState.step === "guess-horizontal" ||
                  gameState.step === "guess-vertical") &&
                gameState.guess.hint && (
                  <p className="">Hint: {gameState.guess.hint}</p>
                )}
              {gameState.step === "guess-horizontal" &&
                wordsToGuess.horizontalWord && (
                  <GuessWordForm
                    wordToGuess={wordsToGuess.horizontalWord}
                    isError={!!formError}
                    onGuess={handleWordGuess}
                    onSkip={handleSkipGuess}
                  />
                )}
              {gameState.step === "guess-vertical" &&
                wordsToGuess.verticalWord && (
                  <GuessWordForm
                    wordToGuess={wordsToGuess.verticalWord}
                    isError={!!formError}
                    onGuess={handleWordGuess}
                    onSkip={handleSkipGuess}
                  />
                )}
            </div>
          )}
        </div>
        {/* </div> */}
      </div>
      {modalOpen && (
        <div
          className="top-0 flex shadow-xl justify-center items-center absolute w-full h-screen bg-gray-600/50 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div className="z-50 relative flex flex-col gap-10 border border-gray-300 bg-white py-10 px-6 w-full max-w-xs md:max-w-md rounded-xl">
            <button
              className="absolute text-xl right-5 top-3"
              onClick={() => setModalOpen(false)}
            >
              x
            </button>
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl text-center font-extrabold">
                Cross Sweeper
              </h1>
              <span className="text-center">You completed the puzzle!</span>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <h3>Score: {gameState.score}</h3>
                <div className="flex gap-1">
                  <Cell isHighlighted />
                  <Cell isHighlighted />
                  <Cell isHighlighted />
                  <Cell status="correct" value=" " />
                  <Cell status="correct" value=" " />
                </div>
              </div>
              <div className="flex justify-between">
                <h3>Guesses: {gameState.totalGuesses}</h3>
                <div className="flex gap-1">
                  <Cell status="incorrect" />
                  <Cell status="incorrect" />
                  <Cell status="correct" value=" " />
                  <Cell status="correct" value=" " />
                  <Cell status="correct" value=" " />
                </div>
              </div>
              <div className="flex justify-between">
                <h3>Clicks: {gameState.totalCellsClicked}</h3>
                <div className="flex gap-1">
                  <Cell status="correct" />
                  <Cell status="correct" />
                  <Cell status="correct" />
                  <Cell status="correct" />
                  <Cell status="correct" value=" " />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setModalOpen(false)}
                className="border-2 border-blue-500 bg-blue-300 text-blue-600 font-bold px-4 py-2 text-xl rounded-xl"
              >
                View Board
              </button>
              <button
                onClick={() => navigate("/")}
                className="border-2 border-yellow-500 bg-yellow-300 text-yellow-600 font-bold px-4 py-2 text-xl rounded-xl"
              >
                Start a new game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
