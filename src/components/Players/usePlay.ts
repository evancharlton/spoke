import { useRef, useEffect } from "react";
import { useTrie } from "../AppSetup/TrieProvider";
import { useGame, useGameActions } from "../GameLogic";
import { Trie } from "../../trie";

type PlayFunction = (trie: NonNullable<Trie>, current: string) => void;

export const usePlay = (play: PlayFunction) => {
  const trie = useTrie();
  const { current, resolution } = useGame();
  const { myTurn } = useGameActions();

  const roundOver = !!resolution;
  const roundOverRef = useRef(roundOver);
  roundOverRef.current = roundOver;

  useEffect(() => {
    if (roundOver) {
      return;
    }

    if (myTurn) {
      const id = setTimeout(() => {
        if (roundOverRef.current) {
          return;
        }

        play(trie, current);
      }, 500);
      return () => {
        clearTimeout(id);
      };
    }
  }, [current, roundOver, myTurn, play, trie]);
};
