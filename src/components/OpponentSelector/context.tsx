import { createContext, useContext } from "react";
import { Opponent, OPPONENTS } from "./opponents";
import { useParams } from "react-router-dom";

export const useOpponent = () => {
  const { opponentId } = useParams();
  if (!opponentId) {
    throw new Error("Missing opponent ID");
  }

  const opponent = OPPONENTS[opponentId];
  if (!opponent) {
    throw new Error(`Unknown opponent: ${opponentId}`);
  }

  return opponent;
};
