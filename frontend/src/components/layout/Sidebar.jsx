

// import { NavLink } from "react-router-dom";

// const navItems = [
//   { name: "Dashboard", path: "/", icon: "📊" },
//   { name: "Patients", path: "/patients", icon: "🧑‍⚕️" },
//   { name: "Devices", path: "/devices", icon: "🩺" },
//   { name: "Sessions", path: "/sessions", icon: "💉" },
//   { name: "Alerts", path: "/alerts", icon: "🚨" },
//   { name: "Nurses", path: "/nurses", icon: "👩‍⚕️" },
//   { name: "Wards", path: "/wards", icon: "🏥" },
// ];

// function Sidebar({ sidebarOpen, setSidebarOpen }) {
//   return (
//     <>
//       {/* Mobile Backdrop */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <aside
//         className={`
//           fixed top-0 left-0 h-screen w-64 bg-slate-950 text-white shadow-2xl z-50 border-r border-slate-800
//           transform transition-transform duration-300 ease-in-out
//           ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//           lg:translate-x-0
//         `}
//       >
//         {/* Brand + Mobile Close */}
//         <div className="px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
//           <div className="flex items-center justify-between gap-3">
//             <div className="flex items-center gap-3">
//               <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg">
//                 💧
//               </div>

//               <div>
//                 <h1 className="text-xl font-bold tracking-wide leading-tight">
//                   Smart IV Drip
//                 </h1>
//                 <p className="text-xs text-slate-300 mt-1">Admin Panel</p>
//               </div>
//             </div>

//             {/* Mobile close button */}
//             <button
//               onClick={() => setSidebarOpen(false)}
//               className="lg:hidden text-slate-300 hover:text-white text-2xl leading-none"
//             >
//               ×
//             </button>
//           </div>
//         </div>

//         {/* Nav */}
//         <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-92px)]">
//           {navItems.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               end={item.path === "/"}
//               onClick={() => setSidebarOpen(false)}
//               className={({ isActive }) =>
//                 `group flex items-center gap-3 rounded-2xl px-4 py-3.5 font-medium transition-all duration-200 ${
//                   isActive
//                     ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-900/30"
//                     : "text-slate-200 hover:bg-slate-900 hover:text-white"
//                 }`
//               }
//             >
//               <span className="text-lg">{item.icon}</span>
//               <span>{item.name}</span>
//             </NavLink>
//           ))}
//         </nav>
//       </aside>
//     </>
//   );
// }

// export default Sidebar;

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

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-slate-950/50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-slate-950 text-white shadow-2xl border-r border-slate-800
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Brand */}
        <div className="px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg shrink-0">
              💧
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-wide leading-tight truncate">
                Smart IV Drip
              </h1>
              <p className="text-xs text-slate-300 mt-1">Admin Panel</p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden ml-3 text-slate-300 hover:text-white text-2xl leading-none"
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-92px)]">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-4 py-3.5 font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-900/30"
                    : "text-slate-200 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <span className="text-lg shrink-0">{item.icon}</span>
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;