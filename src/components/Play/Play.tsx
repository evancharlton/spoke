import GameLogic from "../GameLogic";
import { Hamburger } from "../Hamburger";
import Players from "../Players";
import Status from "../Status";
import classes from "./Play.module.css";

export const Play = () => {
  return (
    <div className={classes.container}>
      <GameLogic>
        {/* TODO: I don't like that this doesn't show up until you're playing. */}
        <Hamburger />
        <Status />
        <Players />
      </GameLogic>
    </div>
  );
};
