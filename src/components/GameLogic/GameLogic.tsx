import { useCallback, useReducer } from "react";
import { GameActionsContext, GameStateContext } from "./context";
import { GameState, reducer } from "./state";
import { firstWord, Letter, possibleWord, walk } from "../../trie";
import { useTrie } from "../AppSetup/TrieProvider";
import { usePlayerIds } from "../OpponentSelector/context";

export const GameLogic = ({ children }: { children: React.ReactNode }) => {
  const playerIds = usePlayerIds();
  const trie = useTrie();
  const [state, dispatch] = useReducer(reducer, {
    player: 0,
    playerIds,
    actions: [],
    current: "",
    endingWord: "",
    resolution: undefined,
    losses: {},
  } satisfies GameState);

  const addLetter = useCallback((letter: Letter) => {
    dispatch({ move: "add-letter", letter });
  }, []);

  const challenge = useCallback(() => {
    const busted = firstWord(trie, state.current);
    if (busted) {
      dispatch({ move: "overlooked-word", word: busted });
      return;
    }

    dispatch({ move: "challenge" });
  }, [state, trie]);

  const declareVictory = useCallback(() => {
    const node = walk(trie, state.current);
    if (!node) {
      // We walked off the end. Someone lost ...
      dispatch({ move: "word-spelled" });
      return;
    }

    if (node._?.length) {
      // Correct! A word was formed. The previous player loses
      dispatch({ move: "word-spelled" });
      return;
    }

    // Incorrect! This wasn't yet a word
    dispatch({
      move: "false-victory",
      possibleWord: possibleWord(trie, state.current),
    });
  }, [state, trie]);

  const answerChallenge = useCallback(
    (word: string) => {
      const node = walk(trie, word);
      if (node?._?.length) {
        dispatch({ move: "challenge -> real word", word });
      } else {
        dispatch({ move: "challenge -> fake word", word });
      }
    },
    [trie]
  );

  const newRound = useCallback(() => {
    dispatch({ move: "new-round" });
  }, []);

  return (
    <GameActionsContext.Provider
      value={{
        addLetter,
        challenge,
        declareVictory,
        answerChallenge,
        newRound,
      }}
    >
      <GameStateContext.Provider value={state}>
        {children}
      </GameStateContext.Provider>
    </GameActionsContext.Provider>
  );
};
