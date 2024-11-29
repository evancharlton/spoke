import { Link } from "react-router-dom";
import { useGame } from "../GameLogic";
import { useCurrentPlayer } from "../GameLogic";
import { usePlayerInfo } from "../Players";
import Scoreboard from "../Scoreboard";
import classes from "./Status.module.css";

const GameOverInfo = () => {
  const loserId = useCurrentPlayer();
  const playerInfo = usePlayerInfo();

  // TODO: Show a breakdown/summary/overview of all of the rounds and the
  //       words that can be learned :)

  return (
    <div className={classes.gameOverContainer}>
      <h3>{playerInfo(loserId).name} tapte</h3>
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
