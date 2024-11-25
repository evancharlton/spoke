import { Forfeit, Reveal, AddLetter, Challenge } from "../../moves";
import { Letter, nodeOptions, Trie, walk } from "../../trie";

export type Opponent = {
  name: string;
  challenge: (trie: Trie, current: string) => Promise<Forfeit | Reveal>;
  play: (
    trie: Trie,
    current: string
  ) => Promise<AddLetter | Forfeit | Challenge>;
  validate: (trie: Trie, word: string) => Promise<boolean>;

  // TODO: Remove this
  all: (trie: Trie, current: string) => string[];
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

    challenge: async (trie, current) => {
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

    play: async (trie, current) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

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

    validate: async (trie, word) => {
      const node = walk(trie, word);
      return !!node?._?.length;
    },

    all: (trie, current) => {
      const expand = (node: Trie): string[] => {
        if (node._?.length) {
          return node._ ?? [];
        }
        return nodeOptions(node)
          .map((letter) => (node[letter] ? expand(node[letter]) : []))
          .flat();
      };

      const start = walk(trie, current);
      if (!start) {
        return [];
      }

      return expand(start) ?? [];
    },
  },
} as const;
