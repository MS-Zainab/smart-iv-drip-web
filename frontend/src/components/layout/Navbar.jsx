import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Smart IV Dashboard</h2>
        <p className="text-sm text-slate-500">
          Monitor IV devices, patients, sessions and alerts
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-800">
            {user?.fullName || "Admin User"}
          </p>
          <p className="text-xs text-slate-500">
            {user?.role || "Admin"}
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;