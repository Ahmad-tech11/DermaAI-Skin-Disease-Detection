import { NavLink as RouterNavLink } from "react-router-dom";

const NavLink = ({ to, children, className }) => (
  <RouterNavLink
    to={to}
    className={({ isActive }) =>
      `${className} text-slate-300 hover:text-white transition-all duration-200 font-medium ${
        isActive ? "text-sky-400" : ""
      }`
    }
  >
    {children}
  </RouterNavLink>
);
export default NavLink;
