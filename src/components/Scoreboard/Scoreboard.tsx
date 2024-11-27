import classes from "./Scoreboard.module.css";
import { useGame } from "../GameLogic";

const LETTERS = ["s", "p", "ø", "k", "e"] as const;

export const Scoreboard = () => {
  const { playerIds, losses } = useGame();
  return (
    <div
      className={classes.container}
      style={{ gridTemplateRows: `repeat(${(playerIds.length, "auto")})` }}
    >
      {playerIds.map((id) => (
        <>
          <strong>{id}</strong>
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
        </>
      ))}
    </div>
  );
};
