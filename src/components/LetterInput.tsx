import { KeyboardEvent, forwardRef, useState } from "react";

type LetterInputProps = {
  isError: boolean;
  onNext: () => void;
  onBack: () => void;
};

const LetterInput = forwardRef<HTMLInputElement, LetterInputProps>(
  ({ isError, onNext, onBack }, ref) => {
    const [letter, setLetter] = useState("");

    const isBackspace = (key: string) => {
      return key === "Backspace";
    };
    const isRightArrow = (key: string) => {
      return key === "ArrowRight";
    };
    const isLeftArrow = (key: string) => {
      return key === "ArrowLeft";
    };
    const isValidCharacter = (key: string) => {
      // Length of 1 to validate character and not other function keys
      // Match regex to validate alphabetic character
      return key.length === 1 && /[a-zA-Z]/.test(key);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (isBackspace(event.key) && letter.length === 0) {
        onBack();
        setLetter("");
      } else if (isBackspace(event.key)) {
        setLetter("");
        // onBack();
      } else if (isRightArrow(event.key)) {
        // On right arrow key pressed, go next
        onNext();
      } else if (isLeftArrow(event.key)) {
        // On left arrow key pressed, go back
        onBack();
      } else if (isValidCharacter(event.key)) {
        // Make sure letter pressed is a letter
        setLetter(event.key.toUpperCase());
        onNext();
      }
    };

    const inputStyle = isError
      ? "caret-red-200 font-bold text-3xl border text-center border-red-500 w-8 h-8 rounded-md bg-red-200 text-red-600 focus:ring-2 focus:ring-blue-500"
      : "caret-white font-bold text-3xl border text-center border-gray-300 w-8 h-8 rounded-md bg-white focus:ring-4 focus:ring-blue-500 focus:outline-blue-400";

    return (
      <input
        ref={ref}
        onChange={() => {}}
        value={letter}
        onKeyDown={handleKeyDown}
        className={inputStyle}
      />
    );
  }
);

export default LetterInput;
