import { Letter, Trie } from "../../trie";

type Forfeit = {
  move: "forfeit";
};

type Challenge = {
  move: "challenge";
};

type AddLetter = {
  move: "play";
  letter: Letter;
};

type ShowWord = {
  move: "show";
  word: string;
};

export type Opponent = {
  name: string;
  challenge: (trie: Trie, current: string) => Forfeit | ShowWord;
  play: (trie: Trie, current: string) => AddLetter | Forfeit | Challenge;
};

const walk = (trie: Trie, current: string): Trie | undefined => {
  let node: Trie | undefined = trie;
  for (let i = 0; i < current.length; i += 1) {
    if (!node) {
      return undefined;
    }
    node = node[current[i] as Letter];
  }
  return node;
};

const nodeOptions = (trie: Trie): Letter[] => {
  return Object.keys(trie).filter((v) => v !== "_") as Letter[];
};

const firstWord = (trie: Trie): string => {
  if (trie._?.length) {
    return trie._[0];
  }

  const firstOption = nodeOptions(trie)[0];
  const next = trie[firstOption];
  if (!next) {
    throw new Error("Impossible situation arose: walked off the trie");
  }

  return firstWord(next);
};

export const OPPONENTS: Record<string, Opponent> = {
  random: {
    name: "Tilfeldig",

    challenge: (trie, current) => {
      const node = walk(trie, current);
      if (!node) {
        return { move: "forfeit" };
      }

      const options = nodeOptions(node);
      if (options.length === 0) {
        return { move: "forfeit" };
      }

      return { move: "show", word: firstWord(node) };
    },

    play: (trie, current) => {
      const node = walk(trie, current);
      if (!node) {
        return { move: "challenge" };
      }

      const options = nodeOptions(node);
      const letter = options[Math.floor(Math.random() * options.length)];
      if (!letter) {
        return { move: "forfeit" };
      }
      return { move: "play", letter: letter as Letter };
    },
  },
} as const;
