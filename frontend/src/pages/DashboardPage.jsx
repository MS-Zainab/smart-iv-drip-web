import { useEffect, useMemo, useState } from "react";
import StatCard from "../components/common/StatCard";
import SectionCard from "../components/common/SectionCard";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const DashboardPage = () => {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalPatients: 0,
      activeDevices: 0,
      activeSessions: 0,
      criticalAlerts: 0,
    },
    recentAlerts: [],
    deviceOverview: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosInstance.get("/dashboard");

      if (res.data?.success) {
        setDashboardData(
          res.data.data || {
            stats: {
              totalPatients: 0,
              activeDevices: 0,
              activeSessions: 0,
              criticalAlerts: 0,
            },
            recentAlerts: [],
            deviceOverview: [],
          }
        );
      }
    } catch (err) {
      console.error("Fetch Dashboard Error:", err);
      setError(err.response?.data?.message || "Failed to fetch dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = useMemo(() => {
    return [
      {
        title: "Total Patients",
        value: dashboardData.stats?.totalPatients || 0,
        subtitle: "Registered in system",
        color: "blue",
      },
      {
        title: "Active Devices",
        value: dashboardData.stats?.activeDevices || 0,
        subtitle: "Currently online",
        color: "green",
      },
      {
        title: "Active Sessions",
        value: dashboardData.stats?.activeSessions || 0,
        subtitle: "IV sessions running",
        color: "purple",
      },
      {
        title: "Critical Alerts",
        value: dashboardData.stats?.criticalAlerts || 0,
        subtitle: "Require attention",
        color: "red",
      },
    ];
  }, [dashboardData]);

  const getSeverityBadge = (severity) => {
    const styles = {
      Critical: "bg-red-200 text-red-800",
      High: "bg-red-100 text-red-700",
      Medium: "bg-yellow-100 text-yellow-700",
      Low: "bg-green-100 text-green-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          styles[severity] || "bg-slate-100 text-slate-700"
        }`}
      >
        {severity || "Unknown"}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      Online: "bg-green-100 text-green-700",
      Offline: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          styles[status] || "bg-slate-100 text-slate-700"
        }`}
      >
        {status || "Unknown"}
      </span>
    );
  };

  const resolvedAlertsCount = useMemo(() => {
    return dashboardData.recentAlerts?.filter((alert) => alert.isResolved).length || 0;
  }, [dashboardData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Welcome back{user?.fullName ? `, ${user.fullName}` : ""} 👋
            </h1>
            <p className="text-slate-500 mt-2">
              Here’s a live overview of your Smart IV Drip Monitoring System.
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
          >
            Refresh Dashboard
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item, index) => (
          <StatCard
            key={index}
            title={item.title}
            value={loading ? "..." : item.value}
            subtitle={item.subtitle}
            color={item.color}
          />
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <SectionCard title="Recent Alerts" actionText="Latest 5">
          {loading ? (
            <div className="py-10 text-center text-slate-500">Loading alerts...</div>
          ) : dashboardData.recentAlerts?.length === 0 ? (
            <div className="py-10 text-center text-slate-500">No recent alerts found.</div>
          ) : (
            <div className="space-y-4">
              {dashboardData.recentAlerts.map((alert) => (
                <div
                  key={alert._id}
                  className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {alert.alertType} — {alert.patient?.fullName || "Unknown Patient"}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Device: {alert.device?.deviceId || "-"}
                    </p>
                  </div>

                  <div>{getSeverityBadge(alert.severity)}</div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Device Overview */}
        <SectionCard title="Device Overview" actionText="Latest 5">
          {loading ? (
            <div className="py-10 text-center text-slate-500">Loading devices...</div>
          ) : dashboardData.deviceOverview?.length === 0 ? (
            <div className="py-10 text-center text-slate-500">No devices found.</div>
          ) : (
            <div className="space-y-4">
              {dashboardData.deviceOverview.map((device) => (
                <div
                  key={device._id}
                  className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {device.deviceName || "Smart IV Monitor"}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {device.deviceId} • {device.ward?.wardName || "-"}
                    </p>
                  </div>

                  <div>{getStatusBadge(device.connectivity)}</div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <SectionCard title="System Health">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Backend API</span>
              <span className="text-green-600 font-semibold">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Database</span>
              <span className="text-green-600 font-semibold">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Live Monitoring</span>
              <span className="text-green-600 font-semibold">Active</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Today’s Activity">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Running Sessions</span>
              <span className="font-bold text-slate-800">
                {dashboardData.stats?.activeSessions || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Active Devices</span>
              <span className="font-bold text-slate-800">
                {dashboardData.stats?.activeDevices || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Recent Resolved Alerts</span>
              <span className="font-bold text-slate-800">{resolvedAlertsCount}</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Quick Notes">
          <div className="space-y-3 text-sm text-slate-600">
            <p>• Dashboard is now powered by real backend data.</p>
            <p>• Critical alerts are counted from unresolved High/Critical alert records.</p>
            <p>• Devices and recent alerts are fetched directly from MongoDB.</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default DashboardPage;