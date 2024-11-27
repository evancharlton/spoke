import { useCallback, useEffect, useRef } from "react";
import { useTrie } from "../AppSetup/TrieProvider";
import { nodeOptions, possibleWord, Trie, walk } from "../../trie";
import { useGame, useGameActions } from "../GameLogic/context";
import { Action } from "../GameLogic";

const remaining = (root: Trie, current: string) => {
  const start = walk(root, current);
  if (!start) {
    return null;
  }

  const expand = (node: Trie): string[] => {
    if (node._?.length) {
      return node._;
    }

    return nodeOptions(node)
      .map((letter) => expand(node[letter] ?? {}))
      .flat();
  };

  return expand(start);
};

export const RandomPlayer = () => {
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

      const letter = options[Math.floor(Math.random() * options.length)];
      if (!letter) {
        throw new Error("Something went wrong picking a random letter");
      }

      addLetter(letter);
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

  if (import.meta.env.PROD) {
    return null;
  }

  const words = remaining(trie, current);

  return (
    <div>
      <button disabled={!myTurn} onClick={() => play(trie, current)}>
        (Robot play)
      </button>
      <button disabled={!myTurn} onClick={() => challenge()}>
        (Robot challenge)
      </button>
      <pre>{JSON.stringify(words?.slice(0, 5), null, 2)}</pre>
      <details>
        <summary>{words?.length} words</summary>
        <pre>{JSON.stringify(words, null, 2)}</pre>
      </details>
    </div>
  );
};
