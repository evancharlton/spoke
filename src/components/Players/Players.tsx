import Buttons from "../Buttons";
import ChallengeDialog from "../ChallengeDialog";
import { useGame } from "../GameLogic";
import {
  PlayerIdContext,
  useCurrentPlayer,
  usePlayerId,
} from "../GameLogic/context";
import GameOverDialog from "../GameOverDialog";
import Keyboard from "../Keyboard";
import { usePlayerIds } from "../OpponentSelector/context";
import { RandomPlayer } from "./RandomPlayer";

const HumanPlayer = () => {
  const { actions } = useGame();
  const currentPlayer = useCurrentPlayer();
  const myId = usePlayerId();

  const showChallengeDialog =
    actions[0]?.move === "challenge" && currentPlayer === myId;

  return (
    <>
      <Keyboard />
      <Buttons />
      {showChallengeDialog ? <ChallengeDialog /> : null}
      <GameOverDialog />
    </>
  );
};

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
