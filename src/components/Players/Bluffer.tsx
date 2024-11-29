import { useRef, useCallback, useEffect } from "react";
import { Trie, possibleWord, walk, nodeOptions } from "../../trie";
import { useTrie } from "../AppSetup/TrieProvider";
import { useGame, useGameActions, Action } from "../GameLogic";
import { LETTERS } from "../../letters";

export const Bluffer = () => {
  const trie = useTrie();
  const { current, actions, playerIds } = useGame();
  const { addLetter, challenge, answerChallenge, declareVictory, myTurn } =
    useGameActions();

  const lastAction = useRef<Action | undefined>();
  lastAction.current = actions[0];

  const numPlayers = playerIds.length;

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
          addLetter(
            imaginaryLetters[
              Math.floor(Math.random() * imaginaryLetters.length)
            ]
          );
          return;
        }

        // Otherwise, fall through.
      }

      if (choice === 1 && current.length > numPlayers) {
        // Don't even think - just challenge.
        challenge();
        return;
      }

      // Otherwise, just play
      addLetter(options[Math.floor(Math.random() * options.length)]);
    },
    [addLetter, answerChallenge, challenge, declareVictory, myTurn, numPlayers]
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
