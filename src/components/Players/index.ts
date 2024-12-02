import { useCallback } from "react";
import { PLAYERS } from "./data";

export { Players as default } from "./Players";
export { PLAYERS } from "./data";
export type PlayerId = keyof typeof PLAYERS;

export const isPlayerId = (v: string): v is PlayerId => {
  return v in PLAYERS && v.length === 1;
};

export const usePlayerInfo = () => {
  return useCallback((id: string) => {
    const info = PLAYERS[id as PlayerId];
    if (!info) {
      throw new Error(`Unknown player: ${id}`);
    }
    return info;
  }, []);
};
