import { useNavigate, useParams } from "react-router-dom";
import { PlayerContext } from "../GameLogic/context";
import { usePlayerIds } from "../OpponentSelector/context";
import { HumanPlayer } from "./HumanPlayer";
import { RandomPlayer, RandomPlayer2 } from "./RandomPlayer";

export const PLAYERS = {
  human: {
    impl: HumanPlayer,
    name: "Du",
  },
  r: {
    impl: RandomPlayer,
    name: "Tilfeldig",
  },
  t: {
    impl: RandomPlayer2,
    name: "Tilfeldig 2",
  },
} as const;

export const Players = () => {
  const players = usePlayerIds();
  const navigate = useNavigate();
  const { lang } = useParams();

  return players.map((playerId) => {
    const { impl: Impl, name } =
      PLAYERS[playerId as keyof typeof PLAYERS] ?? {};

    if (!Impl) {
      navigate(`/${lang}`);
      return null;
    }

    return (
      <PlayerContext.Provider key={playerId} value={{ id: playerId, name }}>
        <Impl />
      </PlayerContext.Provider>
    );
  });
};
