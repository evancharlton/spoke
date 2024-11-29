import { Letter } from "./trie";

export const LETTERS = [
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
] as const;

export const LETTER_SET = new Set<Letter>(LETTERS);

export const isLetter = (letter: string): letter is Letter => {
  return LETTER_SET.has(letter as Letter);
};
