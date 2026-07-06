import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/", icon: "📊" },
  { name: "Patients", path: "/patients", icon: "🧑‍⚕️" },
  { name: "Devices", path: "/devices", icon: "🩺" },
  { name: "Sessions", path: "/sessions", icon: "💉" },
  { name: "Alerts", path: "/alerts", icon: "🚨" },
  { name: "Nurses", path: "/nurses", icon: "👩‍⚕️" },
  { name: "Wards", path: "/wards", icon: "🏥" },
];

function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-950 text-white shadow-2xl z-40 border-r border-slate-800">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg">
            💧
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-wide leading-tight">
              Smart IV Drip
            </h1>
            <p className="text-xs text-slate-300 mt-1">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-92px)]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-2xl px-4 py-3.5 font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-900/30"
                  : "text-slate-200 hover:bg-slate-900 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;