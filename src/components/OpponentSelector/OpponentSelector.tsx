import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { PlayersContext } from "./context";
import { useMemo } from "react";
import classes from "./OpponentSelector.module.css";
import { PlayerId, PLAYERS } from "../Players";

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
        {Object.entries(PLAYERS)
          .filter(([_, { unpickable }]) => !unpickable)
          .map(([id, { name, icon, description }]) => (
            <Opponent key={id} id={id} name={name} icon={icon}>
              {description}
            </Opponent>
          ))}
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
