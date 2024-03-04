import { FC } from "react";
import { useNavigate } from "react-router-dom";

type ErrorScreenProps = {
  error: string;
};

const ErrorScreen: FC<ErrorScreenProps> = ({ error }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex-col gap-8 flex p-4 items-center justify-center">
      <h1 className="bg-red-300 rounded-xl max-w-xs text-xl text-red-500 border-2 border-red-600 py-2 px-4">
        Error: {error}
      </h1>
      <button
        onClick={() => navigate("/")}
        className="border-2 border-yellow-500 bg-yellow-300 text-yellow-600 font-bold px-4 py-2 text-xl rounded-xl"
      >
        Start a new game
      </button>
    </div>
  );
};

export default ErrorScreen;
