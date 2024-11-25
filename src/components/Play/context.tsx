import { createContext, useContext } from "react";
import { Letter } from "../../trie";
import { Move } from "../../moves";
import { PLAYERS } from "./state";

export const PlayContext = createContext<
  | {
      addLetter: (letter: Letter) => void;
      challenge: () => void;
      forfeit: () => void;
      reset: () => void;
      current: string;
      player: (typeof PLAYERS)[number];
      lastAction: Move | undefined;
      winner: number | undefined;
    }
  | undefined
>(undefined);

export const usePlayContext = () => {
  const context = useContext(PlayContext);
  if (!context) {
    throw new Error(
      "usePlayContext() can only be used inside <PlayContext.Provider />"
    );
  }
  return context;
};
