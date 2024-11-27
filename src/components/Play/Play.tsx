import GameLogic from "../GameLogic";
import Players from "../Players";
import Status from "../Status";
import classes from "./Play.module.css";

export const Play = () => {
  return (
    <div className={classes.container}>
      <GameLogic>
        <Status />
        <Players />
      </GameLogic>
    </div>
  );
};
