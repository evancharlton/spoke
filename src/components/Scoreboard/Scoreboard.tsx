import classes from "./Scoreboard.module.css";
import { useGame } from "../GameLogic";
import { usePlayerInfo } from "../Players";
import { Fragment } from "react/jsx-runtime";

const LETTERS = ["s", "p", "ø", "k", "e"] as const;

export const Scoreboard = () => {
  const { playerIds, losses, player } = useGame();
  const playerInfo = usePlayerInfo();
  return (
    <div
      className={classes.container}
      style={{ gridTemplateRows: `repeat(${(playerIds.length, "auto")})` }}
    >
      {playerIds.map((id, i) => (
        <Fragment key={id}>
          <strong className={classes.player}>
            {player === i ? "👉 " : null}
            {playerInfo(id).name}
          </strong>
          {LETTERS.map((letter, i) => (
            <div
              key={`${id}-${letter}`}
              className={[
                classes.letter,
                i + 1 <= losses[id] ? classes.gained : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {letter}
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  );
};
