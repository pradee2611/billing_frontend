import { NavLink } from "react-router-dom";
import BrandLogo, { BrandName } from "./BrandLogo.jsx";

export default function AppNavbar({ onSignOut }) {
  return (
    <nav className="navbar navbar-expand app-navbar no-print">
      <div className="container-xxl">
        <NavLink to="/" className="navbar-brand d-flex align-items-center gap-2">
          <BrandLogo size={36} />
          <BrandName />
        </NavLink>
        <div className="navbar-nav ms-auto flex-row align-items-center gap-1">
          <NavLink to="/new" className="nav-link">New Bill</NavLink>
          <NavLink to="/" end className="nav-link">Orders</NavLink>
          <button type="button" className="btn btn-sm btn-warning fw-semibold ms-2 logout-btn" onClick={onSignOut}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
