import { useCallback, useReducer } from "react";
import { GameActionsContext, GameStateContext } from "./context";
import { GameState, reducer } from "./state";
import { firstWord, Letter, possibleWord, walk } from "../../trie";
import { useTrie } from "../AppSetup/TrieProvider";
import { usePlayerIds } from "../OpponentSelector/context";
import { PlayerId } from "../Players";
import { MINIMUM_WORD_LENGTH } from "./constants";

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
    losses: {} as Record<PlayerId, number>,
    gameOver: false,
  } satisfies GameState);

  const { current, resolution } = state;
  const roundOver = !!resolution;

  const addLetter = useCallback(
    (letter: Letter) => {
      if (roundOver) {
        throw new Error("Cannot play (addLetter) when the round is over");
      }
      dispatch({ move: "add-letter", letter: letter.toLowerCase() as Letter });
    },
    [roundOver]
  );

  const challenge = useCallback(() => {
    if (roundOver) {
      throw new Error("Cannot play (challenge) when the round is over");
    }
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
  }, [current, roundOver, trie]);

  const declareVictory = useCallback(() => {
    if (roundOver) {
      throw new Error("Cannot play (declareVictory) when the round is over");
    }
    if (current.length < MINIMUM_WORD_LENGTH) {
      // This is impossible - you can't declare victory so soon.
      throw new Error(
        `Cannot declare victory before ${MINIMUM_WORD_LENGTH} letters`
      );
    }

    const node = walk(trie, current);
    if (!node) {
      // We walked off the end. Technically, this should be a challenge, and
      // to claim victory would mean that the current user lost. However, let's
      // be a little less-strict because it's easy to mix up the buttons.
      //
      // Auto-correct this back to a challenge.

      challenge();
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
  }, [challenge, current, roundOver, trie]);

  /** Used by robots when they know they're playing a losing word. */
  const admitDefeat = useCallback(
    (word: string) => {
      if (roundOver) {
        throw new Error("Cannot play (admitDefeat) when the round is over");
      }
      dispatch({ move: "defeated", word });
    },
    [roundOver]
  );

  const answerChallenge = useCallback(
    (word: string) => {
      if (roundOver) {
        throw new Error("Cannot play (answerChallenge) when the round is over");
      }
      const node = walk(trie, word);
      if (node?._?.length) {
        dispatch({ move: "challenge -> real word", word });
      } else {
        dispatch({ move: "challenge -> fake word", word });
      }
    },
    [roundOver, trie]
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
        admitDefeat,
        answerChallenge,
        challenge,
        declareVictory,
        newGame,
        newRound,
      }}
    >
      <GameStateContext.Provider value={state}>
        {children}
      </GameStateContext.Provider>
    </GameActionsContext.Provider>
  );
};
