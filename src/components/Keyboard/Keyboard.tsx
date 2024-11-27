import { useEffect } from "react";
import { useGameActions } from "../GameLogic/context";
import classes from "./Keyboard.module.css";
import { Letter } from "../../trie";

const ALPHABET = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "å"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ø", "æ"],
  ["z", "x", "c", "v", "b", "n", "m"],
] as const;

const LETTERS = new Set<Letter>(ALPHABET.flat());

export const Keyboard = () => {
  const { addLetter, myTurn } = useGameActions();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase() as Letter;
      if (LETTERS.has(key)) {
        addLetter(key);
      }
    };

    addEventListener("keypress", onKey);
    return () => {
      removeEventListener("keypress", onKey);
    };
  }, [addLetter]);

  return (
    <div className={classes.keyboard}>
      {ALPHABET.map((row, i) => (
        <div key={`row-${i}`} className={classes.row}>
          {row.map((letter) => (
            <button
              disabled={!myTurn}
              key={letter}
              onClick={() => addLetter!(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};
