import { Link, Outlet, useParams } from "react-router-dom";

export const OpponentSelector = () => {
  const { opponentId } = useParams();

  if (!opponentId) {
    return (
      <>
        <Link to="./random">Random</Link>
        <Link to="./perfect">Perfect</Link>
      </>
    );
  }

  return <Outlet />;
};
