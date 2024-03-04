import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

const Home = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/game")
      .then((response) => response.json())
      .then(({ gameId }) => {
        navigate(`/game/${gameId}`);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to create game");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return <LoadingScreen />;
};

export default Home;
