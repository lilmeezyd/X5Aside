import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ShieldCheck,
  Table2,
  LogOut,
  ChevronDown,
  HelpCircle
} from "lucide-react";
import { useDatabase } from "../hooks/useDatabase";
import { useLogoutMutation } from "../slices/userApiSlice";
import { logout } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import CompetitionDropdown from "../components/CompetitionDropdown";

const loggedInNavItems = [
  { name: "Home", path: "/", icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: "Teams", path: "/teams", icon: <Users className="h-5 w-5" /> },
  { name: "Fixtures", path: "/fixtures", icon: <CalendarCheck className="h-5 w-5" /> },
  { name: "Players", path: "/players", icon: <ShieldCheck className="h-5 w-5" /> },
  { name: "Tables", path: "/tables", icon: <Table2 className="h-5 w-5" /> },
  { name: "Events", path: "/events", icon: <CalendarCheck className="h-5 w-5" /> },
  { name: "Help", path: "/help", icon: <HelpCircle className="h-5 w-5" />}

];

const guestNavItems = [
  { name: "Home", path: "/", icon: <LayoutDashboard size={20} /> },
  { name: "Teams", path: "/teams", icon: <Users size={20} /> },
  { name: "Fixtures", path: "/fixtures", icon: <CalendarCheck size={20} /> },
  { name: "Players", path: "/players", icon: <ShieldCheck size={20} /> },
  { name: "Tables", path: "/tables", icon: <Table2 size={20} /> },
  { name: "Help", path: "/help",
  icon: <HelpCircle size={20} />}
];

const competitions = [
  { name: "X5Aside", db: "X5Aside" },
  { name: "WhatsApp5", db: "app5Aside" },
 /* { name: "Test", db: "test"}*/
];

export default function SidebarLayout() {
  const { dbName, changeDb } = useDatabase();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileCompOpen, setMobileCompOpen] = useState(false);
  const [loadingDbChange, setLoadingDbChange] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeDb = async (newDb) => {
    if (newDb === dbName) return;
    try {
      setLoadingDbChange(true);
      await changeDb(newDb);
      navigate("/");
    } catch (err) {
      console.error("DB change failed", err);
    } finally {
      setLoadingDbChange(false);
    }
  };

  return (
      <div className={`relative flex flex-col min-h-0 ${loadingDbChange ? "cursor-wait" : ""}`}>

      {/* Top Navbar for guest (desktop) */}
      {!userInfo && (
        <div className="hidden md:flex justify-between items-center bg-gray-900 text-white p-4 fixed top-0 left-0 right-0 z-50">
          <div className="flex items-center gap-8">
            <h1 className="text-lg font-bold">
              {dbName === "X5Aside" ? "X5ASIDE" : dbName === "app5Aside" ? "FFK" : "5ASIDE"}
            </h1>
            <nav className="flex gap-6">
              {guestNavItems.map(({ name, path }) => (
                <Link
                  key={path}
                  to={path}
                  className={`hover:text-gray-300 ${
                    location.pathname === path ? "text-blue-400" : "text-white"
                  }`}
                >
                  {name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 hover:text-gray-300"
            >
              Competitions <ChevronDown className="w-4 h-4" />
            </button>
            {dropdownOpen && (
              <CompetitionDropdown
                open={dropdownOpen}
                setOpen={setDropdownOpen}
                competitions={competitions}
                changeDb={handleChangeDb}
              />
            )}
          </div>
        </div>
      )}

      {/* Layout Body */}
      <div className={`flex flex-1 `}>
        {/* mt-${!userInfo ? "20" : "5"} pt-${!userInfo ? "20" : "0"} */}
        {userInfo && (
          <aside className="hidden md:block w-64 bg-gray-800 text-white p-4">
            <h1 className="text-xl font-bold mb-6">{dbName === 'app5Aside' ? 'FFK' : dbName === 'X5Aside' ? 'X5' : '5Aside'} Admin</h1>
            <nav className="space-y-1">
              {loggedInNavItems.map(({ name, path }) => (
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
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </nav>
          </aside>
        )}

        <main
            className={`flex-1 bg-gray-100 pb-20 md:pt-20 px-4 ${
              !userInfo ? "md:px-20" : "md:px-4"
            }`}
          >

          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav for logged-in users */}
      {userInfo && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 shadow">
          <div className="flex justify-around items-center py-2">
            {loggedInNavItems.map(({ name, path, icon }) => (
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
      )}

      {/* Mobile Top Nav for guests */}
      {!userInfo && (
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-t z-50 shadow px-4 py-3 flex justify-between items-center">
         <Link to="/"> <h1 className="text-lg font-bold">
            {dbName === "X5Aside" ? "X5ASIDE" : dbName === "app5Aside" ? "FFK" : "5ASIDE"}
          </h1></Link>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="space-y-1">
                <div className="w-6 h-0.5 bg-gray-800" />
                <div className="w-6 h-0.5 bg-gray-800" />
                <div className="w-6 h-0.5 bg-gray-800" />
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute top-12 right-0 bg-white border rounded shadow-lg w-48 z-50">
                <nav className="flex flex-col p-2">
                  {guestNavItems.map(({ name, path }) => (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setDropdownOpen(false)}
                      className={`px-4 py-2 text-sm hover:bg-gray-100 ${
                        location.pathname === path ? "text-blue-600 font-medium" : "text-gray-800"
                      }`}
                    >
                      {name}
                    </Link>
                  ))}
                  <hr className="my-1" />
                  <button
                    onClick={() => setMobileCompOpen(!mobileCompOpen)}
                    className="px-4 py-2 text-sm text-left hover:bg-gray-100 w-full"
                  >
                    Competitions
                  </button>
                  {mobileCompOpen &&
                    competitions.map((c) => (
                      <button
                        key={c.db}
                        onClick={() => {
                          handleChangeDb(c.db);
                          setMobileCompOpen(false);
                          setDropdownOpen(false);
                        }}
                        className="px-6 py-1 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      >
                        {c.name}
                      </button>
                    ))}
                  <button
                    onClick={() => setDropdownOpen(false)}
                    className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 text-left"
                  >
                    Close
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spinner Overlay */}
      {loadingDbChange && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex flex-col items-center justify-center pointer-events-auto space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid" />
          <p className="text-white text-lg font-semibold">Switching Competition...</p>
        </div>
      )}


      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center text-sm p-4">
        <div className="container mx-auto flex flex-col justify-between items-center gap-2">
          <img
            src={`https://ik.imagekit.io/cap10/fiveaside.png`}
            alt="fiveaside"
            className="h-20 w-20 object-contain rounded"
          />
          <p>© {new Date().getFullYear()} 5-a-Side Mini League. All rights reserved.</p>
          <div className="flex gap-4 text-xs">
            <Link to="/home" className="hover:underline">Home</Link>
            <Link to="/teams" className="hover:underline">Teams</Link>
            <Link to="/players" className="hover:underline">Players</Link>
            <Link to="/fixtures" className="hover:underline">Fixtures</Link>
            <Link to="/tables" className="hover:underline">Tables</Link>
            <Link to="/help" className="hover:underline">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
