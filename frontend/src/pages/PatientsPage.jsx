import { useEffect, useMemo, useState } from "react";
import SectionCard from "../components/common/SectionCard";
import axiosInstance from "../api/axiosInstance";

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosInstance.get("/patients");

      // backend response: { success, total, currentPage, totalPages, data: [...] }
      setPatients(res?.data?.data || []);
    } catch (err) {
      console.error("Fetch Patients Error:", err);
      setError(
        err?.response?.data?.message || "Failed to fetch patients."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // ---------- Summary ----------
  const totalPatients = patients.length;

  const onIVCount = useMemo(() => {
    return patients.filter((patient) => patient.ivStatus === "Running").length;
  }, [patients]);

  const criticalCount = useMemo(() => {
    return patients.filter((patient) => patient.status === "Critical").length;
  }, [patients]);

  // ---------- Badge Logic ----------
  const getStatusBadge = (patient) => {
    // Priority:
    // 1) If IV is running => On IV
    // 2) If patient critical => Critical
    // 3) If discharged => Discharged
    // 4) Else stable/admitted
    let label = "Stable";
    let classes = "bg-green-100 text-green-700";

    if (patient.ivStatus === "Running") {
      label = "On IV";
      classes = "bg-blue-100 text-blue-700";
    } else if (patient.status === "Critical") {
      label = "Critical";
      classes = "bg-red-100 text-red-700";
    } else if (patient.status === "Discharged") {
      label = "Discharged";
      classes = "bg-slate-200 text-slate-700";
    } else {
      label = patient.status || "Stable";
      classes = "bg-green-100 text-green-700";
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${classes}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-800">Patients</h1>
        <p className="text-slate-500 mt-2">
          View and manage registered patients in the Smart IV Drip system.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Total Patients</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            {loading ? "..." : totalPatients}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Currently on IV</p>
          <h2 className="text-3xl font-bold text-blue-700 mt-2">
            {loading ? "..." : onIVCount}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Critical Watch</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {loading ? "..." : criticalCount}
          </h2>
        </div>
      </div>

      {/* Patients table/list */}
      <SectionCard title="Patient Records" actionText="Add Patient">
        {loading ? (
          <div className="py-10 text-center text-slate-500">Loading patients...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-600">{error}</div>
        ) : patients.length === 0 ? (
          <div className="py-10 text-center text-slate-500">
            No patients found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-200">
                  <th className="py-3 px-2 text-slate-500 font-semibold">Patient</th>
                  <th className="py-3 px-2 text-slate-500 font-semibold">ID</th>
                  <th className="py-3 px-2 text-slate-500 font-semibold">Age</th>
                  <th className="py-3 px-2 text-slate-500 font-semibold">Ward / Bed</th>
                  <th className="py-3 px-2 text-slate-500 font-semibold">Diagnosis</th>
                  <th className="py-3 px-2 text-slate-500 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {patients.map((patient) => (
                  <tr
                    key={patient._id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="py-4 px-2 font-semibold text-slate-800">
                      {patient.fullName}
                    </td>

                    <td className="py-4 px-2 text-slate-600">
                      {patient.patientId}
                    </td>

                    <td className="py-4 px-2 text-slate-600">
                      {patient.age}
                    </td>

                    <td className="py-4 px-2 text-slate-600">
                      {patient.ward?.wardName || "N/A"} • {patient.bedNumber || "N/A"}
                    </td>

                    <td className="py-4 px-2 text-slate-600">
                      {patient.diagnosis || "N/A"}
                    </td>

                    <td className="py-4 px-2">
                      {getStatusBadge(patient)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default PatientsPage;