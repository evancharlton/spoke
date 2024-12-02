import { useCallback, useRef } from "react";
import { nodeOptions, possibleWord, Trie, walk } from "../../trie";
import { useGame, useGameActions } from "../GameLogic/context";
import { Action } from "../GameLogic";
import { usePlay } from "./usePlay";

// const remaining = (root: Trie, current: string) => {
//   const start = walk(root, current);
//   if (!start) {
//     return null;
//   }

//   const expand = (node: Trie): string[] => {
//     if (node._?.length) {
//       return node._;
//     }

//     return nodeOptions(node)
//       .map((letter) => expand(node[letter] ?? {}))
//       .flat();
//   };

//   return expand(start);
// };

const useRandom = ({ giveUp }: { giveUp: boolean }) => {
  const { actions } = useGame();
  const {
    addLetter,
    admitDefeat,
    challenge,
    answerChallenge,
    declareVictory,
    myTurn,
  } = useGameActions();

  const lastAction = useRef<Action | undefined>();
  lastAction.current = actions[0];

  const play = useCallback(
    (root: Trie, current: string) => {
      if (!myTurn) {
        throw new Error("It's not my turn");
      }

      if (lastAction.current?.move === "challenge") {
        // Respond to the challenge
        const word = possibleWord(root, current);
        if (word) {
          answerChallenge(word);
        }
        answerChallenge(current);
        return;
      }

      const node = walk(root, current);
      if (!node) {
        // We walked off the end. At this point, the board has a bogus word and
        // we should challenge
        challenge();
        return;
      }

      const options = nodeOptions(node);
      if (options.length === 0) {
        // We have no options -- this means that a word was formed and we can
        // declare victory.
        declareVictory();
        return;
      }

      const letter = options[Math.floor(Math.random() * options.length)];
      if (!letter) {
        throw new Error("Something went wrong picking a random letter");
      }

      // Peek at the next node to see whether it's defeat or not.
      const next = node[letter];
      if (giveUp && next?._?.length) {
        admitDefeat(next._[0]);
        return;
      }
      addLetter(letter);
    },
    [
      addLetter,
      admitDefeat,
      answerChallenge,
      challenge,
      declareVictory,
      giveUp,
      myTurn,
    ]
  );

  usePlay(play);
  return null;
};

export const RandomPlayer = () => {
  useRandom({ giveUp: false });
  return null;
};

export const RandomPlayer2 = () => {
  useRandom({ giveUp: true });
  return null;
};
