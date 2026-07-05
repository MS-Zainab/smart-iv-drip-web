import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/" },
  { name: "Patients", path: "/patients" },
  { name: "Devices", path: "/devices" },
  { name: "Sessions", path: "/sessions" },
  { name: "Alerts", path: "/alerts" },
  { name: "Nurses", path: "/nurses" },
  { name: "Wards", path: "/wards" },
];

function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white shadow-xl z-40">
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-2xl font-bold tracking-wide">Smart IV Drip</h1>
        <p className="text-sm text-slate-300 mt-1">Admin Panel</p>
      </div>

      <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-88px)]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 font-medium transition ${
                isActive
                  ? "bg-cyan-500 text-white shadow-md"
                  : "text-slate-200 hover:bg-slate-800"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;