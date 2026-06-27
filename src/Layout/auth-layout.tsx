import { Outlet } from "react-router-dom";
import "../Styles/auth-layout.css";

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-brand">
        <div className="brand-content">
          <div className="brand-logo">
            <span className="brand-logo-icon">S</span>
            <span className="brand-logo-text">stash</span>
          </div>
          <h1 className="brand-heading">Your Knowledge, always within reach.</h1>
          <p className="brand-sub">Save, organize, and search the resources that matter most to you.</p>
          <div className="brand-features">
            <p>Save anything from the web instantly</p>
            <p>Organize with collections and tags</p>
            <p>Rediscover resources</p>
          </div>
        </div>
      </div>
      <div className="auth-form-area">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;