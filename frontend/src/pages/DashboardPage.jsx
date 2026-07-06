import StatCard from "../components/common/StatCard";
import SectionCard from "../components/common/SectionCard";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Patients",
      value: 24,
      subtitle: "Registered in system",
      color: "blue",
    },
    {
      title: "Active Devices",
      value: 12,
      subtitle: "Currently online",
      color: "green",
    },
    {
      title: "Active Sessions",
      value: 8,
      subtitle: "IV sessions running",
      color: "purple",
    },
    {
      title: "Critical Alerts",
      value: 3,
      subtitle: "Require attention",
      color: "red",
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      patient: "Ali Raza",
      device: "DEV-001",
      type: "Low Bottle",
      severity: "High",
      time: "2 min ago",
    },
    {
      id: 2,
      patient: "Sara Khan",
      device: "DEV-004",
      type: "Abnormal Flow",
      severity: "Medium",
      time: "10 min ago",
    },
    {
      id: 3,
      patient: "Ahmed Ali",
      device: "DEV-002",
      type: "Session Completed",
      severity: "Low",
      time: "18 min ago",
    },
  ];

  const activeDevices = [
    { id: "DEV-001", name: "Smart IV Monitor 1", ward: "Ward A", status: "Online" },
    { id: "DEV-002", name: "Smart IV Monitor 2", ward: "Ward B", status: "Online" },
    { id: "DEV-003", name: "Smart IV Monitor 3", ward: "Ward C", status: "Offline" },
  ];

  const getSeverityBadge = (severity) => {
    const styles = {
      High: "bg-red-100 text-red-700",
      Medium: "bg-yellow-100 text-yellow-700",
      Low: "bg-green-100 text-green-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[severity]}`}
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
        className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back{user?.fullName ? `, ${user.fullName}` : ""} 👋
        </h1>
        <p className="text-slate-500 mt-2">
          Here’s a quick overview of your Smart IV Drip Monitoring System.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <SectionCard title="Recent Alerts" actionText="View All">
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {alert.type} — {alert.patient}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Device: {alert.device} • {alert.time}
                  </p>
                </div>

                <div>{getSeverityBadge(alert.severity)}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Device Overview */}
        <SectionCard title="Device Overview" actionText="Manage Devices">
          <div className="space-y-4">
            {activeDevices.map((device, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {device.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {device.id} • {device.ward}
                  </p>
                </div>

                <div>{getStatusBadge(device.status)}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <SectionCard title="System Health">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Backend API</span>
              <span className="text-green-600 font-semibold">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Socket Connection</span>
              <span className="text-green-600 font-semibold">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Database</span>
              <span className="text-green-600 font-semibold">Healthy</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Today’s Activity">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">New Patients</span>
              <span className="font-bold text-slate-800">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Resolved Alerts</span>
              <span className="font-bold text-slate-800">11</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Completed Sessions</span>
              <span className="font-bold text-slate-800">7</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Quick Notes">
          <div className="space-y-3 text-sm text-slate-600">
            <p>• Monitor low bottle alerts in Ward A.</p>
            <p>• Check device DEV-003 connectivity issue.</p>
            <p>• Review completed sessions before shift handover.</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default DashboardPage;