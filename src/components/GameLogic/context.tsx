import { ContextType, createContext, useContext, useMemo } from "react";
import { GameState } from "./state";
import { usePlayerIds } from "../OpponentSelector/context";
import { Letter } from "../../trie";

export const GameStateContext = createContext<GameState | undefined>(undefined);

export const GameActionsContext = createContext<
  | {
      addLetter: (letter: Letter) => void;
      challenge: () => void;
      answerChallenge: (word: string) => void;
      declareVictory: () => void;
      admitDefeat: (word: string) => void;
      newRound: () => void;
      newGame: () => void;
    }
  | undefined
>(undefined);

export const PlayerContext = createContext<
  { id: string; name: string } | undefined
>(undefined);

export const usePlayerId = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error(
      "Cannot use usePlayerId(..) outside of <PlayerContext.Provider .. />"
    );
  }
  return context.id;
};

export const usePlayerName = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error(
      "Cannot use usePlayerName(..) outside of <PlayerContext.Provider .. />"
    );
  }
  return context.name;
};

export const useGame = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error(
      "useGame() must be used inside of <GameStateContext.Provider />!"
    );
  }
  return context;
};

export const useNewGame = () => {
  const context = useContext(GameActionsContext);
  if (!context) {
    throw new Error(
      "useGameActions() must be used inside of <GameActionsContext.Provider />!"
    );
  }
  return context.newGame;
};

export const useGameActions = (): ContextType<typeof GameActionsContext> & {
  myTurn: boolean;
} => {
  const { player, playerIds } = useGame();
  const context = useContext(GameActionsContext);
  if (!context) {
    throw new Error(
      "useGameActions() must be used inside of <GameActionsContext.Provider />!"
    );
  }

  return {
    ...context,
    myTurn: playerIds[player] === usePlayerId(),
  };
};

export const useCurrentPlayer = () => {
  const { player, playerIds } = useGame();
  return playerIds[player];
};

export const useNeighbors = () => {
  const { player, playerIds } = useGame();
  return {
    next: playerIds[(player + 1) % playerIds.length],
    previous: playerIds[(player + playerIds.length - 1) % playerIds.length],
  };
};

export const useOtherPlayers = () => {
  const { player } = useGame();
  const players = usePlayerIds();
  return useMemo(
    () => players.filter((_, i) => i !== player),
    [player, players]
  );
};
