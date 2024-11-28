import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { PlayersContext } from "./context";
import { useMemo } from "react";
import classes from "./OpponentSelector.module.css";
import { PlayerId } from "../Players";
import { PLAYERS } from "../Players/Players";

const Opponent = ({
  id,
  name,
  icon,
  children,
}: {
  id: PlayerId;
  name: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <Link to={`./${id}`}>
      <h3>
        {icon} {name}
      </h3>
      <p>{children}</p>
    </Link>
  );
};

export const OpponentSelector = () => {
  return (
    <div className={classes.container}>
      <h2>Velg en motstander!</h2>
      <p>Alle motstandene vet samme ord, men spiller forskellige.</p>
      <div className={classes.opponents}>
        <Opponent id="r" name="Tilfeldig" icon="🎲">
          Velger en gyldig bokstav tilfeldig. Vil innrømme å tape.
        </Opponent>
        <Opponent id="t" name="Tilfeldig #2" icon="🎲🎲">
          Velger en gyldig bokstav tilfeldig, men vil ikke innrømme nederlag før
          konfrontert.
        </Opponent>
      </div>
    </div>
  );
};

export const OpponentProvider = () => {
  const { lang, opponentId } = useParams();
  if (!opponentId) {
    throw new Error("Wrong routing");
  }

  const ids = useMemo(
    () => ["human", opponentId as PlayerId] satisfies PlayerId[],
    [opponentId]
  );

  const navigate = useNavigate();
  if (!PLAYERS[opponentId as PlayerId]) {
    navigate(`/${lang}`);
    return null;
  }

  return (
    <PlayersContext.Provider value={ids}>
      <Outlet />
    </PlayersContext.Provider>
  );
};
