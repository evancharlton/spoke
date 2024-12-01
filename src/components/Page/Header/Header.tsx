import { Link } from "react-router-dom";
import classes from "./Header.module.css";
import HelpDialog from "../../HelpDialog";
import { usePwa } from "../../PwaContainer";
import { MdOutlineRefresh } from "react-icons/md";

export const Header = () => {
  const { updateNeeded, performUpdate } = usePwa();

  return (
    <div className={classes.container}>
      <h1>
        <Link to="/">
          <img src="/ghost.svg" width="32" height="32" />
          Spøke
        </Link>
      </h1>
      {updateNeeded ? (
        <button onClick={() => performUpdate()} className={classes.update}>
          <MdOutlineRefresh />
        </button>
      ) : null}
      <HelpDialog />
    </div>
  );
};
