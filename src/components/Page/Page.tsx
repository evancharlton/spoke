import { Outlet } from "react-router-dom";

export const Page = () => {
  return (
    <>
      <h1>Spøke</h1>
      <Outlet />
    </>
  );
};
