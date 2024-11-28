import { Fragment, useEffect } from "react";
import { useGame, useGameActions } from "../GameLogic/context";
import classes from "./Keyboard.module.css";
import { Letter } from "../../trie";
import { neverGuard } from "../../utils";
import { isLetter } from "../../letters";

const LAYOUT = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "å"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ø", "æ"],
  ["🤔", "z", "x", "c", "v", "b", "n", "m", "🎉"],
] as const;

export const Keyboard = ({ disabled }: { disabled: boolean }) => {
  const { current, playerIds } = useGame();
  const { addLetter, myTurn, challenge, declareVictory } = useGameActions();

  const enoughLetters = current.length >= playerIds.length;

  useEffect(() => {
    if (disabled || !myTurn) {
      return;
    }

    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase() as Letter;
      if (isLetter(key)) {
        addLetter(key);
      }
    };

    addEventListener("keypress", onKey);
    return () => {
      removeEventListener("keypress", onKey);
    };
  }, [addLetter, disabled, myTurn]);

  return (
    <div className={classes.keyboard}>
      {LAYOUT.map((row, i) => (
        <Fragment key={`row-${i}`}>
          {row.map((letter) => {
            if (isLetter(letter)) {
              return (
                <button
                  disabled={disabled || !myTurn}
                  key={letter}
                  onClick={() => addLetter!(letter)}
                >
                  {letter}
                </button>
              );
            } else if (letter === "🤔") {
              return (
                <button
                  className={classes.action}
                  disabled={disabled || !myTurn || !enoughLetters}
                  key={letter}
                  onClick={() => challenge()}
                >
                  {letter}
                </button>
              );
            } else if (letter === "🎉") {
              return (
                <button
                  className={classes.action}
                  disabled={disabled || !myTurn || !enoughLetters}
                  key={letter}
                  onClick={() => declareVictory()}
                >
                  {letter}
                </button>
              );
            } else {
              return neverGuard(letter, null);
            }
          })}
        </Fragment>
      ))}
    </div>
  );
};
