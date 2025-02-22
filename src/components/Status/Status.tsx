import { Link } from "react-router";
import { useGame } from "../GameLogic";
import { usePlayerInfo } from "../Players";
import Scoreboard from "../Scoreboard";
import classes from "./Status.module.css";
import { useNewGame } from "../GameLogic/context";

const GameOverInfo = () => {
  const { losses } = useGame();
  const newGame = useNewGame();
  const playerInfo = usePlayerInfo();

  const loser = Object.entries(losses).find(([_id, v]) => v >= 5)?.[0];
  if (!loser) {
    throw new Error("GameOverInfo rendered when the game isn't over");
  }

  // TODO: Show a breakdown/summary/overview of all of the rounds and the
  //       words that can be learned :)

  return (
    <div className={classes.gameOverContainer}>
      <h3>{playerInfo(loser).name} har tapte</h3>
      <Link to=".." replace>
        Begynn på nytt
      </Link>

      <Link
        to="."
        replace
        reloadDocument
        onClick={(e) => {
          newGame();
          e.preventDefault();
        }}
      >
        Omkamp
      </Link>
    </div>
  );
};

export const Status = () => {
  const { gameOver, current, endingWord } = useGame();

  return (
    <>
      <Scoreboard />
      {gameOver ? (
        <GameOverInfo />
      ) : (
        <h1 className={classes.input}>{endingWord || current}</h1>
      )}
    </>
  );
};
