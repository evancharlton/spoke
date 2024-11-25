import { Outlet } from "react-router-dom";

export const Page = () => {
  return (
    <div>
      <h1>Ghost</h1>
      <hr />
      <Outlet />
    </div>
  );
};
