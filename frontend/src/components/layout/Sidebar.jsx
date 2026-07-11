import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { name: "Dashboard", path: "/", icon: "📊" },
  { name: "Patients", path: "/patients", icon: "🧑‍⚕️" },
  { name: "Devices", path: "/devices", icon: "🩺" },
  { name: "Sessions", path: "/sessions", icon: "💉" },
  { name: "Alerts", path: "/alerts", icon: "🚨" },
  { name: "Nurses", path: "/nurses", icon: "👩‍⚕️" },
  { name: "Wards", path: "/wards", icon: "🏥" },
];

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-slate-950 border-r border-slate-800 shadow-2xl
        transform transition-transform duration-300 flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg text-xl">
                💧
              </div>

              <div>
                <h2 className="text-white font-bold text-lg">
                  Smart IV Drip
                </h2>

                <p className="text-slate-400 text-xs">
                  Admin Panel
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* User */}
        <div className="px-4 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="min-w-0">
              <p className="text-white font-semibold truncate">
                {user?.fullName || "Admin User"}
              </p>

              <p className="text-slate-400 text-sm truncate">
                {user?.role || "Administrator"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 font-semibold transition"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;