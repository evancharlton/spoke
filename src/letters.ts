import { Letter } from "./trie";

export const LETTERS = new Set<Letter>([
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "å",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "ø",
  "æ",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
]);

export const isLetter = (letter: string): letter is Letter => {
  return LETTERS.has(letter as Letter);
};
