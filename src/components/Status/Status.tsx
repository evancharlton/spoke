import { useGame } from "../GameLogic";
import Scoreboard from "../Scoreboard";
import classes from "./Status.module.css";

export const Status = () => {
  return (
    <>
      <Scoreboard />
      <h1 className={classes.input}>{useGame().current}</h1>
    </>
  );
};
