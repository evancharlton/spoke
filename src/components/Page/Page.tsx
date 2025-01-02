import { Outlet } from "react-router";
import classes from "./Page.module.css";
import { Header } from "../../spa-components/Header";
import HelpDialog from "../HelpDialog";

export const Page = () => {
  return (
    <div className={classes.page}>
      <Header title="Spøke" logo="/ghost.svg">
        <HelpDialog />
      </Header>
      <div className={classes.contents}>
        <Outlet />
      </div>
    </div>
  );
};
