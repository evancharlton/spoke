import { useRef, useCallback } from "react";
import { Trie, possibleWord, walk, nodeOptions } from "../../trie";
import { useGame, useGameActions, Action } from "../GameLogic";
import { LETTERS } from "../../letters";
import { MINIMUM_WORD_LENGTH } from "../GameLogic/constants";
import { usePlay } from "./usePlay";
import { randomItem } from "../../arrays";

export const Bluffer = () => {
  const { actions } = useGame();
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

      if (node._?.length) {
        // We have no options -- this means that a word was formed and we can
        // declare victory.
        declareVictory();
        return;
      }

      const options = nodeOptions(node);

      // Decide randomly whether to bluff, challenge, or play.
      const choice = Math.floor(Math.random() * 3);
      if (choice === 0) {
        // Time to bluff - let's just add a random letter
        const imaginaryLetters = LETTERS.filter(
          (letter) => !options.includes(letter)
        );
        if (imaginaryLetters.length > 0) {
          addLetter(randomItem(imaginaryLetters));
          return;
        }

        // Otherwise, fall through.
      }

      if (choice === 1 && current.length >= MINIMUM_WORD_LENGTH) {
        // Don't even think - just challenge.
        challenge();
        return;
      }

      // Otherwise, just play
      addLetter(randomItem(options));
    },
    [addLetter, answerChallenge, challenge, declareVictory, myTurn]
  );

  usePlay(play);

  return null;
};
