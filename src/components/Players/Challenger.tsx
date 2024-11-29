import { useRef, useCallback, useEffect } from "react";
import { Trie, possibleWord, walk, nodeOptions } from "../../trie";
import { useTrie } from "../AppSetup/TrieProvider";
import { useGame, useGameActions, Action } from "../GameLogic";

export const Challenger = () => {
  const trie = useTrie();
  const { current, actions } = useGame();
  const { addLetter, challenge, answerChallenge, declareVictory, myTurn } =
    useGameActions();

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
        } else {
          answerChallenge(current);
        }
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

      // Look at all of these options - we want to see if there are any options
      // which do *not* result in defeat.
      const safeOptions = options.filter((letter) => {
        const next = node[letter];
        if (!next) {
          // This should be impossible ... maybe I should throw instead?
          return false;
        }

        return !next._?.length;
      });

      if (safeOptions.length === 0) {
        // Any move we might take will end in our defeat. Let's see if they
        // actually had a word in mind if if they were bluffing ...
        challenge();
      } else {
        addLetter(safeOptions[Math.floor(Math.random() * safeOptions.length)]);
      }
    },
    [addLetter, answerChallenge, challenge, declareVictory, myTurn]
  );

  useEffect(() => {
    if (myTurn) {
      const id = setTimeout(() => play(trie, current), 500);
      return () => {
        clearTimeout(id);
      };
    }
  }, [current, myTurn, play, trie]);
  return null;
};
