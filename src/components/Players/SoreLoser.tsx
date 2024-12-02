import { useRef, useCallback } from "react";
import { Trie, possibleWord, walk, nodeOptions } from "../../trie";
import { useGame, useGameActions, Action } from "../GameLogic";
import { LETTERS } from "../../letters";
import { usePlay } from "./usePlay";

export const SoreLoser = () => {
  const { actions } = useGame();
  const { addLetter, challenge, answerChallenge, declareVictory, myTurn } =
    useGameActions();

  const lastAction = useRef<Action | undefined>();
  lastAction.current = actions[0];

  const play = useCallback(
    (root: Trie, current: string) => {
      if (!myTurn) {
        console.error(`It's not SoreLoser's turn`);
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

      if (safeOptions.length > 0) {
        addLetter(safeOptions[Math.floor(Math.random() * safeOptions.length)]);
        return;
      }

      // Any move we might take will end in our defeat. Let's just make up a
      // letter and see if the next player knows what they're doing ...
      const imaginaryLetters = LETTERS.filter(
        (letter) => !options.includes(letter)
      );
      if (imaginaryLetters.length) {
        addLetter(
          imaginaryLetters[Math.floor(Math.random() * imaginaryLetters.length)]
        );
        return;
      }

      // There are no safe plays here. Let's just play it and hope that the
      // next player doesn't notice ...
      addLetter(options[Math.floor(Math.random() * options.length)]);
    },
    [addLetter, answerChallenge, challenge, declareVictory, myTurn]
  );

  usePlay(play);

  return null;
};
