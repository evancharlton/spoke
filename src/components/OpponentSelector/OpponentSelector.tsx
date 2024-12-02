import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { PlayersContext } from "./context";
import { useMemo } from "react";
import classes from "./OpponentSelector.module.css";
import { isPlayerId, PlayerId, PLAYERS } from "../Players";

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
    <Link to={`./${id}`} replace>
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
      <h2>Velg din motstander!</h2>
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

  const navigate = useNavigate();

  const ids = useMemo(() => {
    const opponentIds: PlayerId[] = opponentId
      .split("")
      .filter((v) => isPlayerId(v));

    const uniques = new Set(opponentIds);
    if (uniques.size !== opponentIds.length) {
      navigate(`/${lang}`, { state: "unknown-players" });
      return [];
    }

    if (opponentIds.length === 0) {
      navigate(`/${lang}`, { state: "no-known-opponents" });
      return [];
    }

    return ["human", ...opponentIds] satisfies PlayerId[];
  }, [lang, navigate, opponentId]);

  if (ids.length === 0) {
    return null;
  }

  return (
    <PlayersContext.Provider key={ids.join("")} value={ids}>
      <Outlet />
    </PlayersContext.Provider>
  );
};
