import { Link } from "react-router-dom";
import classes from "./Header.module.css";
import HelpDialog from "../../HelpDialog";

export const Header = () => {
  return (
    <div className={classes.container}>
      <h1>
        <Link to="/">
          <img src="/ghost.svg" width="32" height="32" />
          Spøke
        </Link>
      </h1>
      <HelpDialog />
    </div>
  );
};
