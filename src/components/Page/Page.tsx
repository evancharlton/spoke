import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import classes from "./Page.module.css";

export const Page = () => {
  return (
    <>
      <Header />
      <div className={classes.contents}>
        <Outlet />
      </div>
    </>
  );
};
