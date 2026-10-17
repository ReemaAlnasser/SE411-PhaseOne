import { NavLink } from 'react-router-dom';

const links = [
  { to: '/cars', label: 'Cars', end: true },
  { to: '/cars/new', label: 'Add Car' },
  { to: '/about', label: 'About' },
];

export default function NavBar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <span className="brand">🚗 Fleet Manager</span>
        <nav aria-label="Main menu">
          <ul className="nav-links">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => (isActive ? 'active' : undefined)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
