import { createContext, useContext } from "react";
import { PlayerId } from "../Players";

export const PlayersContext = createContext<PlayerId[] | undefined>(undefined);

export const usePlayerIds = () => {
  const players = useContext(PlayersContext);
  if (!players) {
    throw new Error(
      "usePlayers() must live inside <PlayersContext.Provider ../>"
    );
  }

  if (!players.length) {
    throw new Error("No players");
  }

  if (players.length === 1) {
    throw new Error("Only one player");
  }

  return players;
};
