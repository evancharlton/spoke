import { useNavigate, useParams } from "react-router";
import { PlayerContext } from "../GameLogic/context";
import { usePlayerIds } from "../OpponentSelector/context";
import { PLAYERS } from "./data";

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
