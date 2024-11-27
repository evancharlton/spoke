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
    gameOver: false,
  } satisfies GameState);

  const { current } = state;

  const addLetter = useCallback((letter: Letter) => {
    dispatch({ move: "add-letter", letter: letter.toLowerCase() as Letter });
  }, []);

  const challenge = useCallback(() => {
    try {
      const busted = firstWord(trie, current);
      if (busted) {
        dispatch({ move: "overlooked-word", word: busted });
        return;
      }
    } catch {
      // If we get here, it's because current doesn't actually form a word that
      // we know about, so pass it back to the player to verify.
    }
    dispatch({ move: "challenge" });
  }, [current, trie]);

  const declareVictory = useCallback(() => {
    const node = walk(trie, current);
    if (!node) {
      // We walked off the end. Someone lost .. I think? I have no idea if this
      // is the right logic for attributing the loss.
      //
      // Whatever.
      dispatch({ move: "word-spelled" });
      return;
    }

    if (node._?.length) {
      // Correct! A word was formed. The previous player loses
      dispatch({ move: "word-spelled" });
      return;
    }

    // Incorrect victory! This wasn't yet a word
    const answer = possibleWord(trie, current);
    if (answer) {
      dispatch({
        move: "false-victory",
        possibleWord: answer,
      });
    } else {
      dispatch({
        move: "false-victory",
        possibleWord: "<impossible situation>",
      });
    }
  }, [current, trie]);

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

  const newGame = useCallback(() => {
    dispatch({ move: "new-game" });
  }, []);

  return (
    <GameActionsContext.Provider
      value={{
        addLetter,
        challenge,
        declareVictory,
        answerChallenge,
        newRound,
        newGame,
      }}
    >
      <GameStateContext.Provider value={state}>
        {children}
      </GameStateContext.Provider>
    </GameActionsContext.Provider>
  );
};
