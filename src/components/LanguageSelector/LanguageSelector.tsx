import { Link } from "react-router-dom";
import classes from "./LanguageSelector.module.css";

export const LanguageSelector = () => {
  return (
    <div className={classes.container}>
      <Link to="/nb">bokmål</Link>
      <Link to="/nn">nynorsk</Link>
    </div>
  );
};

export const Hello = () => <h1>Hello</h1>;
