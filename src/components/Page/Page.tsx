import { Outlet } from "react-router-dom";

export const Page = () => {
  return (
    <div>
      <h1>Spøke</h1>
      <hr />
      <Outlet />
    </div>
  );
};
