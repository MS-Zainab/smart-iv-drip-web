import { useEffect, useMemo, useState } from "react";
import SectionCard from "../components/common/SectionCard";
import axiosInstance from "../api/axiosInstance";

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resolvingId, setResolvingId] = useState("");

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosInstance.get("/alerts");

      if (res.data?.success) {
        setAlerts(res.data.data || []);
      } else {
        setAlerts([]);
      }
    } catch (err) {
      console.error("Fetch Alerts Error:", err);
      setError(err.response?.data?.message || "Failed to fetch alerts");
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleResolveAlert = async (alertId) => {
    try {
      setResolvingId(alertId);

      const res = await axiosInstance.put(`/alerts/${alertId}/resolve`, {
        notes: "Resolved from admin dashboard",
      });

      if (res.data?.success) {
        await fetchAlerts();
      }
    } catch (err) {
      console.error("Resolve Alert Error:", err);
      alert(err.response?.data?.message || "Failed to resolve alert");
    } finally {
      setResolvingId("");
    }
  };

  const totalAlerts = alerts.length;

  const highSeverityCount = useMemo(() => {
    return alerts.filter(
      (alert) => alert.severity === "High" || alert.severity === "Critical"
    ).length;
  }, [alerts]);

  const resolvedCount = useMemo(() => {
    return alerts.filter((alert) => alert.isResolved).length;
  }, [alerts]);

  const unresolvedCount = useMemo(() => {
    return alerts.filter((alert) => !alert.isResolved).length;
  }, [alerts]);

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

  const getStatusBadge = (isResolved) => {
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          isResolved
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {isResolved ? "Resolved" : "Unresolved"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Alerts</h1>
            <p className="text-slate-500 mt-2">
              Track IV drip alerts, critical warnings, device issues and resolution status in real time.
            </p>
          </div>

          <button
            onClick={fetchAlerts}
            className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
          >
            Refresh Alerts
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Total Alerts</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            {loading ? "..." : totalAlerts}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">High / Critical</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {loading ? "..." : highSeverityCount}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Unresolved Alerts</p>
          <h2 className="text-3xl font-bold text-orange-600 mt-2">
            {loading ? "..." : unresolvedCount}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Resolved Alerts</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {loading ? "..." : resolvedCount}
          </h2>
        </div>
      </div>

      {/* Alerts Table */}
      <SectionCard title="Alert Center" actionText="Live Data">
        {loading ? (
          <div className="py-10 text-center text-slate-500">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="py-10 text-center text-slate-500">No alerts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="py-3 px-3 text-sm font-semibold text-slate-600">Alert ID</th>
                  <th className="py-3 px-3 text-sm font-semibold text-slate-600">Patient</th>
                  <th className="py-3 px-3 text-sm font-semibold text-slate-600">Device</th>
                  <th className="py-3 px-3 text-sm font-semibold text-slate-600">Type</th>
                  <th className="py-3 px-3 text-sm font-semibold text-slate-600">Severity</th>
                  <th className="py-3 px-3 text-sm font-semibold text-slate-600">Message</th>
                  <th className="py-3 px-3 text-sm font-semibold text-slate-600">Created</th>
                  <th className="py-3 px-3 text-sm font-semibold text-slate-600">Status</th>
                  <th className="py-3 px-3 text-sm font-semibold text-slate-600">Action</th>
                </tr>
              </thead>

              <tbody>
                {alerts.map((alertItem) => (
                  <tr
                    key={alertItem._id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="py-4 px-3 text-sm font-medium text-slate-700">
                      {alertItem.alertId || "-"}
                    </td>

                    <td className="py-4 px-3">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {alertItem.patient?.fullName || "Unknown Patient"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {alertItem.patient?.patientId || "-"}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      <div>
                        <p className="font-medium text-slate-700">
                          {alertItem.device?.deviceId || "-"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {alertItem.device?.deviceName || "-"}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-3 text-sm text-slate-600">
                      {alertItem.alertType || "-"}
                    </td>

                    <td className="py-4 px-3">
                      {getSeverityBadge(alertItem.severity)}
                    </td>

                    <td className="py-4 px-3 text-sm text-slate-600 max-w-[250px]">
                      {alertItem.message || "-"}
                    </td>

                    <td className="py-4 px-3 text-sm text-slate-600">
                      {alertItem.createdAt
                        ? new Date(alertItem.createdAt).toLocaleString()
                        : "-"}
                    </td>

                    <td className="py-4 px-3">
                      {getStatusBadge(alertItem.isResolved)}
                    </td>

                    <td className="py-4 px-3">
                      {!alertItem.isResolved ? (
                        <button
                          onClick={() => handleResolveAlert(alertItem._id)}
                          disabled={resolvingId === alertItem._id}
                          className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                          {resolvingId === alertItem._id ? "Resolving..." : "Resolve"}
                        </button>
                      ) : (
                        <span className="text-sm text-slate-400">Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Lower section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard title="Alert Summary">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Total Alerts</span>
              <span className="font-bold text-slate-800">{totalAlerts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">High / Critical</span>
              <span className="font-bold text-red-600">{highSeverityCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Resolved</span>
              <span className="font-bold text-green-600">{resolvedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Unresolved</span>
              <span className="font-bold text-orange-600">{unresolvedCount}</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Quick Notes">
          <div className="space-y-3 text-sm text-slate-600">
            <p>• Alerts are now fetched directly from backend alert records.</p>
            <p>• Resolve button updates alert status in MongoDB.</p>
            <p>• Critical and High alerts are counted dynamically from real data.</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default AlertsPage;