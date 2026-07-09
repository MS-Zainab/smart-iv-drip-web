

// import { useLocation } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// const pageContent = {
//   "/": {
//     title: "Smart IV Dashboard",
//     subtitle: "Monitor IV devices, patients, sessions and alerts in real time.",
//   },
//   "/patients": {
//     title: "Patients",
//     subtitle:
//       "Manage patient records, admission details and IV monitoring assignments.",
//   },
//   "/devices": {
//     title: "Devices",
//     subtitle:
//       "Track Smart IV devices, status, ward mapping and availability.",
//   },
//   "/sessions": {
//     title: "Sessions",
//     subtitle:
//       "Monitor active IV sessions, flow rates, infusion progress and treatment status.",
//   },
//   "/alerts": {
//     title: "Alerts",
//     subtitle:
//       "Review low fluid, low bottle and critical IV monitoring alerts.",
//   },
//   "/nurses": {
//     title: "Nurses",
//     subtitle:
//       "Manage nursing staff responsible for patient monitoring and IV sessions.",
//   },
//   "/wards": {
//     title: "Wards",
//     subtitle:
//       "Organize wards, beds and patient placement across the monitoring system.",
//   },
// };

// function Navbar({ setSidebarOpen }) {
//   const { user, logout } = useAuth();
//   const location = useLocation();

//   const currentPage =
//     pageContent[location.pathname] || {
//       title: "Smart IV Dashboard",
//       subtitle: "Monitor IV devices, patients, sessions and alerts in real time.",
//     };

//   return (
//     <header className="bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-6 py-4 shadow-sm">
//       <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//         {/* Left Branding / Page Heading */}
//         <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
//           {/* Mobile menu button */}
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="lg:hidden mt-1 sm:mt-0 h-11 w-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center shadow-sm shrink-0"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6 text-slate-700"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M4 6h16M4 12h16M4 18h16"
//               />
//             </svg>
//           </button>

//           <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-md shrink-0">
//             <svg
//               viewBox="0 0 64 64"
//               className="w-7 h-7 sm:w-8 sm:h-8"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M32 12C32 12 20 27 20 36C20 43.1797 25.8203 49 33 49C40.1797 49 46 43.1797 46 36C46 27 32 12 32 12Z"
//                 fill="white"
//               />
//               <path
//                 d="M32 18C32 18 24.5 28 24.5 35C24.5 39.6944 28.3056 43.5 33 43.5C37.6944 43.5 41.5 39.6944 41.5 35C41.5 28 32 18 32 18Z"
//                 fill="#2563EB"
//                 fillOpacity="0.18"
//               />
//             </svg>
//           </div>

//           <div className="min-w-0">
//             <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight break-words">
//               {currentPage.title}
//             </h2>
//             <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
//               {currentPage.subtitle}
//             </p>
//           </div>
//         </div>

//         {/* Right User Block */}
//         <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
//           <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm w-full sm:min-w-[220px] sm:w-auto">
//             <div className="flex items-center gap-3">
//               <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-base sm:text-lg font-bold shadow-sm shrink-0">
//                 {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
//               </div>

//               <div className="min-w-0">
//                 <p className="text-sm sm:text-base font-semibold text-slate-800 truncate">
//                   {user?.fullName || "Admin User"}
//                 </p>
//                 <p className="text-xs sm:text-sm text-slate-500 truncate">
//                   {user?.role || "Administrator"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <button
//             onClick={logout}
//             className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl font-semibold transition shadow-sm w-full sm:w-auto"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Navbar;



import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const pageContent = {
  "/": {
    title: "Smart IV Dashboard",
    subtitle: "Monitor IV devices, patients, sessions and alerts in real time.",
  },
  "/patients": {
    title: "Patients",
    subtitle:
      "Manage patient records, admission details and IV monitoring assignments.",
  },
  "/devices": {
    title: "Devices",
    subtitle: "Track Smart IV devices, status, ward mapping and availability.",
  },
  "/sessions": {
    title: "Sessions",
    subtitle:
      "Monitor active IV sessions, flow rates, infusion progress and treatment status.",
  },
  "/alerts": {
    title: "Alerts",
    subtitle: "Review low fluid, low bottle and critical IV monitoring alerts.",
  },
  "/nurses": {
    title: "Nurses",
    subtitle:
      "Manage nursing staff responsible for patient monitoring and IV sessions.",
  },
  "/wards": {
    title: "Wards",
    subtitle:
      "Organize wards, beds and patient placement across the monitoring system.",
  },
};

function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const currentPage = pageContent[location.pathname] || {
    title: "Smart IV Dashboard",
    subtitle: "Monitor IV devices, patients, sessions and alerts in real time.",
  };

  return (
    <header className="bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-5 lg:px-6 py-4 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Top row */}
        <div className="flex items-start sm:items-center justify-between gap-3">
          {/* Left section */}
          <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden h-11 w-11 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-center shrink-0"
              aria-label="Open sidebar"
            >
              <svg
                className="w-6 h-6 text-slate-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Brand icon */}
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-md shrink-0">
              <svg
                viewBox="0 0 64 64"
                className="w-7 h-7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32 12C32 12 20 27 20 36C20 43.1797 25.8203 49 33 49C40.1797 49 46 43.1797 46 36C46 27 32 12 32 12Z"
                  fill="white"
                />
                <path
                  d="M32 18C32 18 24.5 28 24.5 35C24.5 39.6944 28.3056 43.5 33 43.5C37.6944 43.5 41.5 39.6944 41.5 35C41.5 28 32 18 32 18Z"
                  fill="#2563EB"
                  fillOpacity="0.18"
                />
              </svg>
            </div>

            {/* Page title */}
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 leading-tight break-words">
                {currentPage.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                {currentPage.subtitle}
              </p>
            </div>
          </div>

          {/* Logout button desktop/tablet */}
          <button
            onClick={logout}
            className="hidden sm:inline-flex bg-red-500 hover:bg-red-600 text-white px-4 lg:px-5 py-2.5 lg:py-3 rounded-2xl font-semibold transition shadow-sm shrink-0"
          >
            Logout
          </button>
        </div>

        {/* Bottom row: user card + mobile logout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm w-full sm:w-auto sm:min-w-[240px]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-base sm:text-lg font-bold shadow-sm shrink-0">
                {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
              </div>

              <div className="min-w-0">
                <p className="text-sm sm:text-base font-semibold text-slate-800 truncate">
                  {user?.fullName || "Admin User"}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 truncate">
                  {user?.role || "Administrator"}
                </p>
              </div>
            </div>
          </div>

          {/* Logout button mobile */}
          <button
            onClick={logout}
            className="sm:hidden bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-2xl font-semibold transition shadow-sm w-full"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;