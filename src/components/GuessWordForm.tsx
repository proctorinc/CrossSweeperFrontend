import { FC, FormEvent, createRef, useEffect } from "react";
import LetterInput from "./LetterInput";

type GuessWordFormProps = {
  wordToGuess: (string | null)[];
  onGuess: (word: string) => void;
  onSkip: () => void;
  isError: boolean;
};

const GuessWordForm: FC<GuessWordFormProps> = ({
  wordToGuess,
  onGuess,
  onSkip,
  isError,
}) => {
  const submitGuessWord = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const word = refList
      .map((ref, i) => {
        return ref.current === null ? wordToGuess[i] : ref.current.value;
      })
      .join("");

    if (word.length === wordToGuess.length) {
      onGuess(word);
    }
  };

  useEffect(() => {
    jumpToNextInput(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jumpToNextInput = (currentIndex: number) => {
    let nextIndex = currentIndex + 1;
    let nextRef = null;

    while (nextRef === null && nextIndex <= refList.length - 1) {
      const aRef = refList[nextIndex];
      if (aRef.current !== null) {
        nextRef = aRef;
      }
      nextIndex++;
    }

    if (nextRef !== null) {
      nextRef.current?.focus();
    }
  };

  const jumpToPreviousInput = (currentIndex: number) => {
    let nextIndex = currentIndex - 1;
    let nextRef = null;

    while (nextRef === null && nextIndex >= 0) {
      const aRef = refList[nextIndex];
      if (aRef.current !== null) {
        nextRef = aRef;
      }
      nextIndex--;
    }

    if (nextRef && nextRef.current) {
      nextRef.current.focus();
    }
  };

  const refList = wordToGuess.map(() => createRef<HTMLInputElement>());

  return (
    <form
      onSubmit={submitGuessWord}
      className="flex items-center w-full flex-col gap-8"
    >
      <div className="flex gap-4 font-bold items-center text-3xl">
        {wordToGuess.map((letter, i) => {
          if (letter === null) {
            return (
              <LetterInput
                ref={refList[i]}
                key={`guess-letter-${i}`}
                isError={isError}
                onNext={() => jumpToNextInput(i)}
                onBack={() => jumpToPreviousInput(i)}
              />
            );
          } else {
            return <span key={`revealed-letter-${i}`}>{letter}</span>;
          }
        })}
      </div>
      <div className="flex gap-4 w-lg">
        <button
          type="button"
          onClick={onSkip}
          className="border-2 border-blue-500 bg-blue-300 text-blue-600 font-bold px-4 py-2 text-xl rounded-xl"
        >
          Skip
        </button>
        <button
          type="submit"
          className="border-2 border-yellow-500 bg-yellow-300 text-yellow-600 font-bold px-4 py-2 text-xl rounded-xl"
        >
          Guess
        </button>
      </div>
    </form>
  );
};

export default GuessWordForm;
