import { useEffect, useMemo, useState } from "react";
import SectionCard from "../components/common/SectionCard";
import axiosInstance from "../api/axiosInstance";

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/sessions");

      if (res.data?.success) {
        setSessions(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const summary = useMemo(() => {
    const total = sessions.length;
    const running = sessions.filter(
      (session) => session.sessionStatus === "Running"
    ).length;

    const completed = sessions.filter(
      (session) => session.sessionStatus === "Completed"
    ).length;

    const paused = sessions.filter(
      (session) => session.sessionStatus === "Paused"
    ).length;

    return { total, running, completed, paused };
  }, [sessions]);

  const getStatusBadge = (status) => {
    const styles = {
      Running: "bg-green-100 text-green-700",
      Completed: "bg-slate-200 text-slate-700",
      Paused: "bg-yellow-100 text-yellow-700",
      Cancelled: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          styles[status] || "bg-slate-100 text-slate-700"
        }`}
      >
        {status}
      </span>
    );
  };

  const formatDateTime = (value) => {
    if (!value) return "--";
    return new Date(value).toLocaleString();
  };

  const getProgress = (session) => {
    const prescribed = Number(session.prescribedVolume || 0);
    const infused = Number(session.infusedVolume || 0);

    if (!prescribed || prescribed <= 0) return 0;

    return Math.min(Math.round((infused / prescribed) * 100), 100);
  };

  const getProgressColor = (status, progress) => {
    if (status === "Cancelled") return "bg-red-500";
    if (status === "Completed") return "bg-slate-500";
    if (progress >= 80) return "bg-emerald-500";
    if (progress >= 40) return "bg-blue-500";
    return "bg-yellow-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Sessions</h1>
            <p className="text-slate-500 mt-2">
              Track active IV drip sessions, flow rate, progress and patient infusion status.
            </p>
          </div>

          <button className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition">
            + Start Session
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Total Sessions</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            {summary.total}
          </h2>
          <p className="text-sm text-slate-400 mt-1">All recorded sessions</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Running Now</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {summary.running}
          </h2>
          <p className="text-sm text-slate-400 mt-1">Currently active</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Paused Sessions</p>
          <h2 className="text-3xl font-bold text-yellow-600 mt-2">
            {summary.paused}
          </h2>
          <p className="text-sm text-slate-400 mt-1">Temporarily stopped</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Completed</p>
          <h2 className="text-3xl font-bold text-slate-700 mt-2">
            {summary.completed}
          </h2>
          <p className="text-sm text-slate-400 mt-1">Finished sessions</p>
        </div>
      </div>

      {/* Sessions Table */}
      <SectionCard title="Session Monitor" actionText="Refresh">
        {loading ? (
          <div className="py-10 text-center text-slate-500">
            Loading sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-10 text-center text-slate-500">
            No sessions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="py-3 px-3 text-sm font-semibold text-slate-600">
                    Session ID
                  </th>
                  <th className="py-3 px-3 text-sm font-semibold text-slate-600">
                    Patient
                  </th>
                  <th className="py-3 px-3 text-sm font-semibold text-slate-600">
                    Device
                  </th>
                  <th className="py-3 px-3 text-sm font-semibold text-slate-600">
                    Ward / Bed
                  </th>
                  <th className="py-3 px-3 text-sm font-semibold text-slate-600">
                    Medicine
                  </th>
                  <th className="py-3 px-3 text-sm font-semibold text-slate-600">
                    Flow Rate
                  </th>
                  <th className="py-3 px-3 text-sm font-semibold text-slate-600">
                    Progress
                  </th>
                  <th className="py-3 px-3 text-sm font-semibold text-slate-600">
                    Nurse
                  </th>
                  <th className="py-3 px-3 text-sm font-semibold text-slate-600">
                    Started
                  </th>
                  <th className="py-3 px-3 text-sm font-semibold text-slate-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {sessions.map((session) => {
                  const progress = getProgress(session);

                  return (
                    <tr
                      key={session._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="py-4 px-3 text-sm font-medium text-slate-700">
                        {session.sessionId}
                      </td>

                      <td className="py-4 px-3">
                        <div>
                          <p className="font-semibold text-slate-800">
                            {session.patient?.fullName || "--"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {session.patient?.patientId || "--"}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-3 text-sm text-slate-600">
                        {session.device?.deviceId || "--"}
                      </td>

                      <td className="py-4 px-3 text-sm text-slate-600">
                        {session.patient?.ward?.wardName || "--"} •{" "}
                        {session.patient?.bedNumber || "--"}
                      </td>

                      <td className="py-4 px-3 text-sm text-slate-600">
                        {session.medicineName || "--"}
                      </td>

                      <td className="py-4 px-3 text-sm text-slate-600">
                        {session.flowRate ? `${session.flowRate} ml/hr` : "--"}
                      </td>

                      <td className="py-4 px-3 min-w-[180px]">
                        <div className="space-y-2">
                          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getProgressColor(
                                session.sessionStatus,
                                progress
                              )}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            {progress}% completed
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-3 text-sm text-slate-600">
                        {session.nurse?.fullName || "--"}
                      </td>

                      <td className="py-4 px-3 text-sm text-slate-600">
                        {formatDateTime(session.startTime)}
                      </td>

                      <td className="py-4 px-3">
                        {getStatusBadge(session.sessionStatus)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default SessionsPage;