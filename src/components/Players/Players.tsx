import { PlayerIdContext } from "../GameLogic/context";
import { usePlayerIds } from "../OpponentSelector/context";
import { HumanPlayer } from "./HumanPlayer";
import { RandomPlayer } from "./RandomPlayer";

const PLAYERS = {
  human: HumanPlayer,
  random: RandomPlayer,
} as const;

export const Players = () => {
  const players = usePlayerIds();

  return players.map((playerId) => {
    const Impl = PLAYERS[playerId as keyof typeof PLAYERS];
    if (!Impl) {
      throw new Error(`Unknown player: ${playerId}`);
    }
    return (
      <PlayerIdContext.Provider key={playerId} value={playerId}>
        <Impl />
      </PlayerIdContext.Provider>
    );
  });
};
