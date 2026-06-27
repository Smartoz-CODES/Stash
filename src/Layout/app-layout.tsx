import { Outlet } from "react-router-dom";
import "../Styles/app-layout.css";

const AppLayout = () => {
  return (
    <div className="app-layout">
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
