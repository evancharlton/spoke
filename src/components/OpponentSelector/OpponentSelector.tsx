import { Link, Outlet, useNavigate, useParams } from "react-router";
import { PlayersContext } from "./context";
import { useMemo, useRef, useState } from "react";
import classes from "./OpponentSelector.module.css";
import { isPlayerId, PlayerId, PLAYERS } from "../Players";
import { randomItem } from "../../arrays";

const PLAYER_IDS = Object.keys(PLAYERS).filter((id) => !PLAYERS[id].unpickable);

export const OpponentSelector = () => {
  const [selected, setSelected] = useState<PlayerId[]>([]);
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  const startPositionRef = useRef<number | undefined>(0);

  const [stuck, setStuck] = useState(false);

  return (
    <div
      className={classes.container}
      onScroll={() => {
        setStuck(
          (messageRef.current?.offsetTop ?? 0) >
            (startPositionRef.current ?? 0),
        );
      }}
    >
      <h2>Velg dine motstandere</h2>
      <p
        className={stuck ? classes.stuck : undefined}
        ref={(ref) => {
          messageRef.current = ref;
          startPositionRef.current = ref?.offsetTop;
        }}
      >
        Alle motstandene vet samme ord, men spiller forskellige.
      </p>
      <div className={classes.opponents}>
        {Object.entries(PLAYERS)
          .filter(([_, { unpickable }]) => !unpickable)
          .map(([id, { name, icon, description }]) => (
            <button
              key={id}
              onClick={() =>
                setSelected((v) =>
                  v.includes(id) ? v.filter((i) => i !== id) : [...v, id],
                )
              }
              className={[
                classes.opponent,
                selected.includes(id) ? classes.added : false,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <h3>
                {icon} {name}
              </h3>
              <p>{description}</p>
            </button>
          ))}
      </div>
      <div className={classes.spacer}></div>

      <Link
        to={`./${
          selected.length === 0 ? randomItem(PLAYER_IDS) : selected.join("")
        }`}
        replace
        className={classes.start}
      >
        {selected.length === 0
          ? "Overrask meg"
          : selected.map((id) => PLAYERS[id].icon).join(" ")}
      </Link>
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
