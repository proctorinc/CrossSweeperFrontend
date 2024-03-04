import { useEffect, useState } from "react";
import Cell from "./Cell";

const LoadingScreen = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setTimeout(() => setIndex((prev) => (prev >= 7 ? 0 : prev + 1)), 100);
  }, [index]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="gap-2 grid grid-cols-3 grid-rows-3">
        <Cell isHighlighted={index === 0} />
        <Cell isHighlighted={index === 1} />
        <Cell isHighlighted={index === 2} />
        <Cell isHighlighted={index === 7} />
        <Cell value=" " status="correct" />
        <Cell isHighlighted={index === 3} />
        <Cell isHighlighted={index === 6} />
        <Cell isHighlighted={index === 5} />
        <Cell isHighlighted={index === 4} />
      </div>
    </div>
  );
};

export default LoadingScreen;
