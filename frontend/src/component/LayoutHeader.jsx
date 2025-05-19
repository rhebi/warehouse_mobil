import Header from "./header";
import { Outlet } from "react-router-dom";

const LayoutHeader = () => {
  return (
    <>
      <Header />
      <main className="pt-20 px-4 bg-black text-white min-h-screen">
        <Outlet />
      </main>
    </>
  );
};

export default LayoutHeader;
