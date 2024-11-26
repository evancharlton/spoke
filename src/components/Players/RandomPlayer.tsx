import { useCallback, useEffect, useRef } from "react";
import { useTrie } from "../AppSetup/TrieProvider";
import { nodeOptions, Trie, walk } from "../../trie";
import { useGame, useGameActions } from "../GameLogic/context";

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
  const { current } = useGame();
  const { addLetter, challenge, declareVictory, myTurn } = useGameActions();

  const play = useCallback(
    (root: Trie, current: string) => {
      if (!myTurn) {
        throw new Error("It's not my turn");
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
    [addLetter, challenge, declareVictory, myTurn]
  );

  const semaphore = useRef(true);

  useEffect(() => {
    if (myTurn) {
      semaphore.current = false;
      play(trie, current);
    }
    return () => {
      semaphore.current = true;
    };
  }, [current, myTurn, play, trie]);

  return (
    <div>
      <button disabled={!myTurn} onClick={() => play(trie, current)}>
        (Robot play)
      </button>
      <button disabled={!myTurn} onClick={() => challenge()}>
        (Robot challenge)
      </button>
      <pre>
        {JSON.stringify(current ? remaining(trie, current) : "", null, 2)}
      </pre>
    </div>
  );
};
