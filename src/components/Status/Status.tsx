import { Link } from "react-router-dom";
import { useGame } from "../GameLogic";
import { usePlayerInfo } from "../Players";
import Scoreboard from "../Scoreboard";
import classes from "./Status.module.css";

const GameOverInfo = () => {
  const { losses } = useGame();
  const playerInfo = usePlayerInfo();

  const loser = Object.entries(losses).find(([_id, v]) => v >= 5)?.[0];
  if (!loser) {
    throw new Error("GameOverInfo rendered when the game isn't over");
  }

  // TODO: Show a breakdown/summary/overview of all of the rounds and the
  //       words that can be learned :)

  return (
    <div className={classes.gameOverContainer}>
      <h3>{playerInfo(loser).name} tapte</h3>
      <Link to="..">Begynn på nytt</Link>
    </div>
  );
};

export const Status = () => {
  const { gameOver, current } = useGame();

  return (
    <>
      <Scoreboard />
      {gameOver ? (
        <GameOverInfo />
      ) : (
        <h1 className={classes.input}>{current}</h1>
      )}
    </>
  );
};
