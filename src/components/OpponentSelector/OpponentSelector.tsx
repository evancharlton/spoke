import { Link, Outlet, useParams } from "react-router-dom";
import { PlayersContext } from "./context";

export const OpponentSelector = () => {
  const { opponentId } = useParams();

  if (!opponentId) {
    return (
      <>
        <Link to="./random">Random</Link>
      </>
    );
  }

  return (
    <PlayersContext.Provider value={["human", opponentId]}>
      <Outlet />
    </PlayersContext.Provider>
  );
};
