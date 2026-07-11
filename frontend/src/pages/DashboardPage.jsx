// import StatCard from "../components/common/StatCard";
// import SectionCard from "../components/common/SectionCard";
// import { useAuth } from "../context/AuthContext";

// const DashboardPage = () => {
//   const { user } = useAuth();

//   const stats = [
//     {
//       title: "Total Patients",
//       value: 24,
//       subtitle: "Registered in system",
//       color: "blue",
//     },
//     {
//       title: "Active Devices",
//       value: 12,
//       subtitle: "Currently online",
//       color: "green",
//     },
//     {
//       title: "Active Sessions",
//       value: 8,
//       subtitle: "IV sessions running",
//       color: "purple",
//     },
//     {
//       title: "Critical Alerts",
//       value: 3,
//       subtitle: "Require attention",
//       color: "red",
//     },
//   ];

//   const recentAlerts = [
//     {
//       id: 1,
//       patient: "Ali Raza",
//       device: "DEV-001",
//       type: "Low Bottle",
//       severity: "High",
//       time: "2 min ago",
//     },
//     {
//       id: 2,
//       patient: "Sara Khan",
//       device: "DEV-004",
//       type: "Abnormal Flow",
//       severity: "Medium",
//       time: "10 min ago",
//     },
//     {
//       id: 3,
//       patient: "Ahmed Ali",
//       device: "DEV-002",
//       type: "Session Completed",
//       severity: "Low",
//       time: "18 min ago",
//     },
//   ];

//   const activeDevices = [
//     { id: "DEV-001", name: "Smart IV Monitor 1", ward: "Ward A", status: "Online" },
//     { id: "DEV-002", name: "Smart IV Monitor 2", ward: "Ward B", status: "Online" },
//     { id: "DEV-003", name: "Smart IV Monitor 3", ward: "Ward C", status: "Offline" },
//   ];

//   const getSeverityBadge = (severity) => {
//     const styles = {
//       High: "bg-red-100 text-red-700",
//       Medium: "bg-yellow-100 text-yellow-700",
//       Low: "bg-green-100 text-green-700",
//     };

//     return (
//       <span
//         className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[severity]}`}
//       >
//         {severity}
//       </span>
//     );
//   };

//   const getStatusBadge = (status) => {
//     const styles = {
//       Online: "bg-green-100 text-green-700",
//       Offline: "bg-slate-200 text-slate-700",
//     };

//     return (
//       <span
//         className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
//       >
//         {status}
//       </span>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
//         <h1 className="text-2xl font-bold text-slate-800">
//           Welcome back{user?.fullName ? `, ${user.fullName}` : ""} 👋
//         </h1>
//         <p className="text-slate-500 mt-2">
//           Here’s a quick overview of your Smart IV Drip Monitoring System.
//         </p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
//         {stats.map((item, index) => (
//           <StatCard
//             key={index}
//             title={item.title}
//             value={item.value}
//             subtitle={item.subtitle}
//             color={item.color}
//           />
//         ))}
//       </div>

//       {/* Middle section */}
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//         {/* Recent Alerts */}
//         <SectionCard title="Recent Alerts" actionText="View All">
//           <div className="space-y-4">
//             {recentAlerts.map((alert) => (
//               <div
//                 key={alert.id}
//                 className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
//               >
//                 <div>
//                   <h3 className="font-semibold text-slate-800">
//                     {alert.type} — {alert.patient}
//                   </h3>
//                   <p className="text-sm text-slate-500">
//                     Device: {alert.device} • {alert.time}
//                   </p>
//                 </div>

//                 <div>{getSeverityBadge(alert.severity)}</div>
//               </div>
//             ))}
//           </div>
//         </SectionCard>

//         {/* Device Overview */}
//         <SectionCard title="Device Overview" actionText="Manage Devices">
//           <div className="space-y-4">
//             {activeDevices.map((device, index) => (
//               <div
//                 key={index}
//                 className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
//               >
//                 <div>
//                   <h3 className="font-semibold text-slate-800">
//                     {device.name}
//                   </h3>
//                   <p className="text-sm text-slate-500">
//                     {device.id} • {device.ward}
//                   </p>
//                 </div>

//                 <div>{getStatusBadge(device.status)}</div>
//               </div>
//             ))}
//           </div>
//         </SectionCard>
//       </div>

//       {/* Bottom section */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//         <SectionCard title="System Health">
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-slate-600">Backend API</span>
//               <span className="text-green-600 font-semibold">Operational</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-slate-600">Socket Connection</span>
//               <span className="text-green-600 font-semibold">Connected</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-slate-600">Database</span>
//               <span className="text-green-600 font-semibold">Healthy</span>
//             </div>
//           </div>
//         </SectionCard>

//         <SectionCard title="Today’s Activity">
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-slate-600">New Patients</span>
//               <span className="font-bold text-slate-800">5</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-slate-600">Resolved Alerts</span>
//               <span className="font-bold text-slate-800">11</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-slate-600">Completed Sessions</span>
//               <span className="font-bold text-slate-800">7</span>
//             </div>
//           </div>
//         </SectionCard>

//         <SectionCard title="Quick Notes">
//           <div className="space-y-3 text-sm text-slate-600">
//             <p>• Monitor low bottle alerts in Ward A.</p>
//             <p>• Check device DEV-003 connectivity issue.</p>
//             <p>• Review completed sessions before shift handover.</p>
//           </div>
//         </SectionCard>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;import { useEffect, useMemo, useState } from "react";
import { useEffect, useMemo, useState } from "react";
import StatCard from "../components/common/StatCard";
import SectionCard from "../components/common/SectionCard";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const DashboardPage = () => {
  const { user } = useAuth();

  const [patients, setPatients] = useState([]);
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  // =========================================================
  // FETCH DASHBOARD DATA
  // =========================================================
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setDashboardError("");

      const [patientsRes, devicesRes, alertsRes] = await Promise.all([
        axiosInstance.get("/patients"),
        axiosInstance.get("/devices"),
        axiosInstance.get("/alerts"),
      ]);

      setPatients(patientsRes?.data?.data || []);
      setDevices(devicesRes?.data?.data || []);
      setAlerts(alertsRes?.data?.data || []);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      setDashboardError(
        err?.response?.data?.message || "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =========================================================
  // STATS
  // =========================================================
  const totalPatients = patients.length;

  const activeDevices = useMemo(() => {
    return devices.filter((device) => device.connectivity === "Online").length;
  }, [devices]);

  const activeSessions = useMemo(() => {
    return devices.filter((device) => device.deviceStatus === "Running").length;
  }, [devices]);

  const criticalAlerts = useMemo(() => {
    return alerts.filter(
      (alert) =>
        (alert.severity === "High" || alert.severity === "Critical") &&
        !alert.isResolved
    ).length;
  }, [alerts]);

  const stats = [
    {
      title: "Total Patients",
      value: loading ? "..." : totalPatients,
      subtitle: "Registered in system",
      color: "blue",
    },
    {
      title: "Active Devices",
      value: loading ? "..." : activeDevices,
      subtitle: "Currently online",
      color: "green",
    },
    {
      title: "Active Sessions",
      value: loading ? "..." : activeSessions,
      subtitle: "IV sessions running",
      color: "purple",
    },
    {
      title: "Critical Alerts",
      value: loading ? "..." : criticalAlerts,
      subtitle: "Require attention",
      color: "red",
    },
  ];

  // =========================================================
  // RECENT ALERTS
  // =========================================================
  const recentAlerts = useMemo(() => {
    return alerts.slice(0, 5).map((alert) => ({
      id: alert._id,
      patient: alert.patient?.fullName || "Unknown Patient",
      device: alert.device?.deviceId || "N/A",
      type: alert.alertType || "Alert",
      severity: alert.severity || "Low",
      time: alert.createdAt
        ? new Date(alert.createdAt).toLocaleString()
        : "Recently",
      isResolved: alert.isResolved,
    }));
  }, [alerts]);

  // =========================================================
  // DEVICE OVERVIEW
  // =========================================================
  const deviceOverview = useMemo(() => {
    return devices.slice(0, 5).map((device) => ({
      id: device.deviceId || device._id,
      name: device.deviceName || "Smart IV Monitor",
      ward: device.ward?.wardName || "No Ward",
      status: device.connectivity || "Offline",
    }));
  }, [devices]);

  // =========================================================
  // TODAY ACTIVITY
  // =========================================================
  const todaysNewPatients = useMemo(() => {
    const today = new Date().toDateString();

    return patients.filter((patient) => {
      if (!patient.createdAt) return false;
      return new Date(patient.createdAt).toDateString() === today;
    }).length;
  }, [patients]);

  const resolvedAlerts = useMemo(() => {
    return alerts.filter((alert) => alert.isResolved).length;
  }, [alerts]);

  const completedSessions = useMemo(() => {
    return patients.filter((patient) => patient.status === "Discharged").length;
  }, [patients]);

  // =========================================================
  // BADGES
  // =========================================================
  const getSeverityBadge = (severity, isResolved = false) => {
    if (isResolved) {
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 whitespace-nowrap">
          Resolved
        </span>
      );
    }

    const styles = {
      Critical: "bg-red-200 text-red-800",
      High: "bg-red-100 text-red-700",
      Medium: "bg-yellow-100 text-yellow-700",
      Low: "bg-green-100 text-green-700",
    };

    return (
      <span
        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
          styles[severity] || "bg-slate-100 text-slate-700"
        }`}
      >
        {severity}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      Online: "bg-green-100 text-green-700",
      Offline: "bg-slate-200 text-slate-700",
    };

    return (
      <span
        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
          styles[status] || "bg-slate-100 text-slate-700"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 break-words">
              Welcome back{user?.fullName ? `, ${user.fullName}` : ""} 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-2 leading-relaxed">
              Here’s a quick overview of your Smart IV Drip Monitoring System.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
          >
            Refresh Dashboard
          </button>
        </div>
      </div>

      {/* Error */}
      {dashboardError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm sm:text-base">
          {dashboardError}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((item, index) => (
          <StatCard
            key={index}
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
            color={item.color}
          />
        ))}
      </div>

      {/* Middle section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
        {/* Recent Alerts */}
        <SectionCard title="Recent Alerts" actionText="Latest 5">
          {loading ? (
            <div className="py-10 text-center text-slate-500 text-sm sm:text-base">
              Loading alerts...
            </div>
          ) : recentAlerts.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-sm sm:text-base">
              No alerts found.
            </div>
          ) : (
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-start md:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-800 text-sm sm:text-base break-words leading-6">
                      {alert.type} — {alert.patient}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 break-words leading-6">
                      Device: {alert.device} • {alert.time}
                    </p>
                  </div>

                  <div className="self-start md:self-center shrink-0">
                    {getSeverityBadge(alert.severity, alert.isResolved)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Device Overview */}
        <SectionCard title="Device Overview" actionText="Live Devices">
          {loading ? (
            <div className="py-10 text-center text-slate-500 text-sm sm:text-base">
              Loading devices...
            </div>
          ) : deviceOverview.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-sm sm:text-base">
              No devices found.
            </div>
          ) : (
            <div className="space-y-4">
              {deviceOverview.map((device) => (
                <div
                  key={device.id}
                  className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-start md:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-800 text-sm sm:text-base break-words leading-6">
                      {device.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 break-words leading-6">
                      {device.id} • {device.ward}
                    </p>
                  </div>

                  <div className="self-start md:self-center shrink-0">
                    {getStatusBadge(device.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">
        <SectionCard title="System Health">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <span className="text-slate-600 text-sm sm:text-base">
                Backend API
              </span>
              <span className="text-green-600 font-semibold text-sm sm:text-base text-right">
                Operational
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="text-slate-600 text-sm sm:text-base">
                Socket Connection
              </span>
              <span className="text-green-600 font-semibold text-sm sm:text-base text-right">
                Connected
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="text-slate-600 text-sm sm:text-base">
                Database
              </span>
              <span className="text-green-600 font-semibold text-sm sm:text-base text-right">
                Healthy
              </span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Today’s Activity">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <span className="text-slate-600 text-sm sm:text-base">
                New Patients
              </span>
              <span className="font-bold text-slate-800 text-sm sm:text-base text-right">
                {loading ? "..." : todaysNewPatients}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="text-slate-600 text-sm sm:text-base">
                Resolved Alerts
              </span>
              <span className="font-bold text-slate-800 text-sm sm:text-base text-right">
                {loading ? "..." : resolvedAlerts}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="text-slate-600 text-sm sm:text-base">
                Completed Sessions
              </span>
              <span className="font-bold text-slate-800 text-sm sm:text-base text-right">
                {loading ? "..." : completedSessions}
              </span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Quick Notes">
          <div className="space-y-3 text-sm text-slate-600 leading-6">
            <p>• Monitor unresolved high-severity IV alerts.</p>
            <p>• Check offline devices and ward assignments.</p>
            <p>• Review patient discharge updates before shift handover.</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default DashboardPage;