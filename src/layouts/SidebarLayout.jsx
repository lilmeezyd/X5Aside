import { Link, useLocation } from "react-router-dom";

const SidebarLayout = ({ children }) => {
  const location = useLocation();
  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Teams", path: "/teams" },
    { name: "Fixtures", path: "/fixtures" },
    { name: "Players", path: "/players" },
    { name: 'Tables', path: '/tables' } 


  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold mb-6">x5Aside Admin</h1>
        <nav>
          {navItems.map(({ name, path }) => (
            <Link
              key={path}
              to={path}
              className={`block px-3 py-2 rounded hover:bg-gray-700 ${
                location.pathname === path ? "bg-gray-700" : ""
              }`}
            >
              {name}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
};

export default SidebarLayout;
