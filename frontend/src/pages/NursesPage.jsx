import { useEffect, useMemo, useState } from "react";
import SectionCard from "../components/common/SectionCard";
import axiosInstance from "../api/axiosInstance";

const NursesPage = () => {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNurses = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosInstance.get("/nurses");

      if (res.data?.success) {
        setNurses(res.data.data || []);
      } else {
        setNurses([]);
      }
    } catch (err) {
      console.error("Fetch Nurses Error:", err);
      setError(err.response?.data?.message || "Failed to fetch nurses");
      setNurses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNurses();
  }, []);

  const totalNurses = nurses.length;

  const activeNurses = useMemo(() => {
    return nurses.filter((nurse) => nurse.isActive).length;
  }, [nurses]);

  const inactiveNurses = useMemo(() => {
    return nurses.filter((nurse) => !nurse.isActive).length;
  }, [nurses]);

  const getStatusBadge = (isActive) => {
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-800">Nurses Management</h1>
        <p className="text-slate-500 mt-2">
          View all nurses, their department, contact info, assigned patients and current status.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Total Nurses</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-2">{totalNurses}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Active Nurses</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">{activeNurses}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Inactive Nurses</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">{inactiveNurses}</h2>
        </div>
      </div>

      {/* Nurses List */}
      <SectionCard title="All Nurses" actionText="Add Nurse">
        {loading ? (
          <div className="py-10 text-center text-slate-500">Loading nurses...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-500">{error}</div>
        ) : nurses.length === 0 ? (
          <div className="py-10 text-center text-slate-500">No nurses found.</div>
        ) : (
          <div className="space-y-4">
            {nurses.map((nurse) => (
              <div
                key={nurse._id}
                className="border border-slate-200 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 hover:shadow-sm transition"
              >
                {/* Left Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {nurse.fullName}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-700">Email:</span>{" "}
                      {nurse.email || "-"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">Phone:</span>{" "}
                      {nurse.phone || "-"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">
                        Employee ID:
                      </span>{" "}
                      {nurse.employeeId || "-"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">
                        Department:
                      </span>{" "}
                      {nurse.department || "-"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">
                        Assigned Patients:
                      </span>{" "}
                      {nurse.assignedPatientsCount ?? 0}
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">
                        Created:
                      </span>{" "}
                      {nurse.createdAt
                        ? new Date(nurse.createdAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* Right Badge */}
                <div className="flex flex-wrap items-center gap-3">
                  {getStatusBadge(nurse.isActive)}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default NursesPage;