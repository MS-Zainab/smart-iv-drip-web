// import { useState } from "react";
// import { useNavigate, Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// function LoginPage() {
//   const navigate = useNavigate();
//   const { login, loading, isAuthenticated } = useAuth();

//   const [formData, setFormData] = useState({
//     email: "admin@smartiv.com",
//     password: "Admin@123",
//   });

//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     const result = await login(formData.email, formData.password);

//     if (result.success) {
//       navigate("/", { replace: true });
//     } else {
//       setError(result.message || "Login failed.");
//     }
//   };

//   if (isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   return (
//     <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-slate-800">Smart IV Drip</h1>
//           <p className="text-slate-500 mt-2">
//             Login to access the monitoring dashboard
//           </p>
//         </div>

//         {error && (
//           <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-slate-700 mb-2"
//             >
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
//               required
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-slate-700 mb-2"
//             >
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 transition disabled:opacity-60 disabled:cursor-not-allowed"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <div className="mt-6 text-xs text-slate-500 text-center">
//           Smart IV Drip Monitoring System
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: "admin@smartiv.com",
    password: "Admin@123",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setError(result.message || "Login failed.");
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-100 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-120px] right-[-80px] w-80 h-80 bg-cyan-200/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] left-[-80px] w-80 h-80 bg-sky-200/40 rounded-full blur-3xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.08),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(6,182,212,0.08),_transparent_30%)]"></div>

      <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left Branding / Illustration Panel */}
        <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-10 xl:p-14">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8 text-cyan-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v8" />
                  <path d="M9 6h6" />
                  <path d="M10 10v3.5a4 4 0 1 0 4 0V10" />
                  <path d="M12 22c3.3 0 6-2.7 6-6 0-1.7-.7-3.2-1.9-4.3l-.1-.1V10" />
                </svg>
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight">Smart IV Drip</h1>
                <p className="text-slate-300 text-sm mt-1">
                  Monitoring Dashboard
                </p>
              </div>
            </div>

            <div className="mt-14 max-w-xl">
              <h2 className="text-4xl font-bold leading-tight">
                Real-time IV drip monitoring for patients, nurses and hospital wards.
              </h2>

              <p className="mt-5 text-slate-300 text-lg leading-8">
                Securely manage patients, monitor device activity, track live IV
                sessions and respond to critical alerts from one centralized
                admin dashboard.
              </p>
            </div>

            {/* Feature cards */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-300">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 21s-6-4.35-8.5-8A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 20.5 13c-2.5 3.65-8.5 8-8.5 8Z" />
                      <path d="M12 8v5" />
                      <path d="M9.5 10.5h5" />
                    </svg>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">Patient Safety</h3>
                    <p className="text-sm text-slate-300 mt-1">
                      Monitor bottle status, fluid level and active infusion
                      sessions with better visibility.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-300">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 12h18" />
                      <path d="M12 3v18" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">Live Monitoring</h3>
                    <p className="text-sm text-slate-300 mt-1">
                      Keep an eye on connected devices, active sessions and
                      real-time hospital activity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-300">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v4" />
                      <path d="M12 18v4" />
                      <path d="M4.93 4.93l2.83 2.83" />
                      <path d="M16.24 16.24l2.83 2.83" />
                      <path d="M2 12h4" />
                      <path d="M18 12h4" />
                      <path d="M4.93 19.07l2.83-2.83" />
                      <path d="M16.24 7.76l2.83-2.83" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">Critical Alerts</h3>
                    <p className="text-sm text-slate-300 mt-1">
                      Detect low bottle, low fluid and device issues early for
                      faster intervention.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-300">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21V7a2 2 0 0 0-2-2h-3V3H9v2H6a2 2 0 0 0-2 2v14" />
                      <path d="M9 11h6" />
                      <path d="M9 15h6" />
                    </svg>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">Centralized Control</h3>
                    <p className="text-sm text-slate-300 mt-1">
                      Manage nurses, wards, patients, devices and sessions from
                      a single admin panel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <div>
              <p className="text-sm text-slate-300">System Status</p>
              <p className="font-semibold text-white mt-1">
                Backend connected • Monitoring active
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1.5 text-emerald-300 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              Online
            </div>
          </div>
        </div>

        {/* Right Login Panel */}
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-xl">
            {/* Mobile Branding */}
            <div className="lg:hidden mb-8 text-center">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8 text-sky-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v8" />
                  <path d="M9 6h6" />
                  <path d="M10 10v3.5a4 4 0 1 0 4 0V10" />
                  <path d="M12 22c3.3 0 6-2.7 6-6 0-1.7-.7-3.2-1.9-4.3l-.1-.1V10" />
                </svg>
              </div>
              <h1 className="mt-4 text-3xl font-bold text-slate-800">
                Smart IV Drip
              </h1>
              <p className="text-slate-500 mt-2">
                Monitoring Dashboard
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              {/* Top strip */}
              <div className="px-8 pt-8 pb-6 border-b border-slate-200 bg-gradient-to-r from-sky-50 via-cyan-50 to-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-sky-700 uppercase tracking-wide">
                      Admin Access
                    </p>
                    <h2 className="text-3xl font-bold text-slate-800 mt-2">
                      Welcome back
                    </h2>
                    <p className="text-slate-500 mt-2">
                      Sign in to access your Smart IV Drip monitoring dashboard.
                    </p>
                  </div>

                  <div className="hidden sm:flex h-14 w-14 rounded-2xl bg-white shadow-sm border border-sky-100 items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7 text-sky-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v8" />
                      <path d="M9 6h6" />
                      <path d="M10 10v3.5a4 4 0 1 0 4 0V10" />
                      <path d="M12 22c3.3 0 6-2.7 6-6 0-1.7-.7-3.2-1.9-4.3l-.1-.1V10" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="px-8 py-8">
                {/* Demo credentials note */}
                <div className="mb-6 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-4">
                  <p className="text-sm font-semibold text-sky-800">
                    Default Admin Credentials
                  </p>
                  <p className="text-sm text-sky-700 mt-1">
                    Email: <span className="font-medium">admin@smartiv.com</span>
                  </p>
                  <p className="text-sm text-sky-700">
                    Password: <span className="font-medium">Admin@123</span>
                  </p>
                </div>

                {error && (
                  <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <path d="m3 7 9 6 9-6" />
                        </svg>
                      </span>

                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-4 py-3.5 outline-none transition focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="11" width="18" height="10" rx="2" />
                          <path d="M7 11V8a5 5 0 0 1 10 0v3" />
                        </svg>
                      </span>

                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-14 py-3.5 outline-none transition focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        required
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-sm font-medium text-slate-500 hover:text-slate-700"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* Login button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-slate-900/10"
                  >
                    {loading ? "Logging in..." : "Login to Dashboard"}
                  </button>
                </form>

                {/* Footer note */}
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Smart IV Drip Monitoring System
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Secure access for hospital monitoring and IV session management.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700 text-xs font-semibold border border-emerald-100 w-fit">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    System Ready
                  </div>
                </div>
              </div>
            </div>

            {/* Small mobile helper text */}
            <p className="text-center text-xs text-slate-500 mt-6 lg:hidden">
              Smart IV Drip — Hospital IV Monitoring Dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;