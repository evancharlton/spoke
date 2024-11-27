import { Link, Outlet, useParams } from "react-router-dom";
import { PlayersContext } from "./context";
import { useMemo } from "react";

export const OpponentSelector = () => {
  return (
    <>
      <Link to="./random">Random</Link>
    </>
  );
};

export const OpponentProvider = () => {
  const { opponentId } = useParams();
  if (!opponentId) {
    throw new Error("Wrong routing");
  }

  const ids = useMemo(() => ["human", opponentId], [opponentId]);

  return (
    <PlayersContext.Provider value={ids}>
      <Outlet />
    </PlayersContext.Provider>
  );
};
