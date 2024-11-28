import { useCallback } from "react";
import { PLAYERS } from "./Players";

export { Players as default } from "./Players";
export type PlayerId = keyof typeof PLAYERS;

export const usePlayerInfo = () => {
  return useCallback((id: string) => {
    const info = PLAYERS[id as PlayerId];
    if (!info) {
      throw new Error(`Unknown player: ${id}`);
    }
    return info;
  }, []);
};
