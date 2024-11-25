import { Letter } from "./trie";

export type Forfeit = {
  move: "forfeit";
};

export type Challenge = {
  move: "challenge";
};

export type AddLetter = {
  move: "play";
  letter: Letter;
};

export type Reveal = {
  move: "show";
  word: string;
};

export type Move = AddLetter | Forfeit | Challenge | Reveal;
