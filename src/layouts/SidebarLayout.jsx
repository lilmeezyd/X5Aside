import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ShieldCheck,
  CalendarDays,
  Table2,
  LogOut,
} from "lucide-react";import { useLogoutMutation } from "../slices/userApiSlice";
import { logout } from "../slices/authSlice";

import { useDispatch, useSelector } from "react-redux";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: "Teams", path: "/teams", icon: <Users className="h-5 w-5" /> },
  { name: "Fixtures", path: "/fixtures", icon: <CalendarCheck className="h-5 w-5" /> },
  { name: "Players", path: "/players", icon: <ShieldCheck className="h-5 w-5" /> },
  { name: "Tables", path: "/tables", icon: <Table2 className="h-5 w-5" /> },
  { name: "Events", path: "/events", icon: <CalendarDays className="h-5 w-5" />}
];

export default function SidebarLayout() {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();



  const handleLogout = async () => {
    try {
     const res = await logoutApiCall().unwrap();
    dispatch(logout());
    navigate("/login");
    } catch(err) {
      console.log(err)
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-gray-800 text-white p-4">
          <h1 className="text-xl font-bold mb-6">5Aside Admin</h1>
          <nav className="space-y-1">
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
            <button
              onClick={handleLogout}
              className="w-full mt-6 flex items-center gap-2 px-3 py-2 rounded hover:bg-red-600 bg-red-500 text-white text-sm"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-4 pb-20 md:pb-4">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 shadow">
        <div className="flex justify-around items-center py-2">
          {navItems.map(({ name, path, icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center text-xs ${
                location.pathname === path ? "text-blue-600" : "text-gray-600"
              }`}
            >
              {icon}
              <span>{name}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center text-xs text-red-600"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
