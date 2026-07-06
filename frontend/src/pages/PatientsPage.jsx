import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const initialForm = {
  patientId: "",
  fullName: "",
  age: "",
  gender: "Male",
  bloodGroup: "A+",
  diagnosis: "",
  allergies: "",
  ward: "",
  bedNumber: "",
  assignedDoctor: "",
  assignedNurse: "",
  emergencyContactName: "",
  emergencyContactRelation: "",
  emergencyContactPhone: "",
  notes: "",
};

const PatientsPage = () => {
  // -----------------------------
  // Patients listing states
  // -----------------------------
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [patientsError, setPatientsError] = useState("");

  // -----------------------------
  // Modal states
  // -----------------------------
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // -----------------------------
  // Dropdown data for Add Patient
  // -----------------------------
  const [wards, setWards] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [metaLoading, setMetaLoading] = useState(false);
  const [metaError, setMetaError] = useState("");

  // -----------------------------
  // Add patient form state
  // -----------------------------
  const [formData, setFormData] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // =========================================================
  // FETCH PATIENTS
  // =========================================================
  const fetchPatients = async () => {
    try {
      setLoadingPatients(true);
      setPatientsError("");

      const res = await axiosInstance.get("/patients");
      setPatients(res?.data?.data || []);
    } catch (err) {
      console.error("Fetch Patients Error:", err);
      setPatientsError(
        err?.response?.data?.message || "Failed to fetch patients."
      );
    } finally {
      setLoadingPatients(false);
    }
  };

  // =========================================================
  // FETCH WARDS / DOCTORS / NURSES FOR ADD MODAL
  // =========================================================
  const fetchMetaData = async () => {
    try {
      setMetaLoading(true);
      setMetaError("");

      const [wardsRes, doctorsRes, nursesRes] = await Promise.all([
        axiosInstance.get("/wards"),
        axiosInstance.get("/users?role=Doctor"),
        axiosInstance.get("/users?role=Nurse"),
      ]);

      setWards(wardsRes?.data?.data || []);
      setDoctors(doctorsRes?.data?.data || []);
      setNurses(nursesRes?.data?.data || []);
    } catch (err) {
      console.error("Fetch Patient Meta Error:", err);
      setMetaError(
        err?.response?.data?.message ||
          "Failed to fetch wards/doctors/nurses."
      );
    } finally {
      setMetaLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // =========================================================
  // SUMMARY COUNTS
  // =========================================================
  const totalPatients = patients.length;

  const onIVCount = useMemo(() => {
    return patients.filter((patient) => patient.ivStatus === "Running").length;
  }, [patients]);

  const criticalCount = useMemo(() => {
    return patients.filter((patient) => patient.status === "Critical").length;
  }, [patients]);

  // =========================================================
  // OPEN / CLOSE MODAL
  // =========================================================
  const openAddModal = async () => {
    setShowAddModal(true);
    setFormError("");
    setFormSuccess("");
    setFormData(initialForm);
    await fetchMetaData();
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setFormError("");
    setFormSuccess("");
    setMetaError("");
    setFormData(initialForm);
  };

  // =========================================================
  // FORM CHANGE
  // =========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // VALIDATION
  // =========================================================
  const validateForm = () => {
    if (
      !formData.patientId.trim() ||
      !formData.fullName.trim() ||
      !formData.age ||
      !formData.gender ||
      !formData.bloodGroup ||
      !formData.ward ||
      !formData.bedNumber.trim()
    ) {
      return "Patient ID, Full Name, Age, Gender, Blood Group, Ward and Bed Number are required.";
    }

    if (Number(formData.age) <= 0) {
      return "Age must be greater than 0.";
    }

    return "";
  };

  // =========================================================
  // SUBMIT ADD PATIENT
  // =========================================================
  const handleAddPatient = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      setFormSuccess("");

      const payload = {
        patientId: formData.patientId.trim(),
        fullName: formData.fullName.trim(),
        age: Number(formData.age),
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        diagnosis: formData.diagnosis.trim(),
        allergies: formData.allergies
          ? formData.allergies
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        ward: formData.ward,
        bedNumber: formData.bedNumber.trim(),
        assignedDoctor: formData.assignedDoctor || null,
        assignedNurse: formData.assignedNurse || null,
        emergencyContact: {
          name: formData.emergencyContactName.trim(),
          relation: formData.emergencyContactRelation.trim(),
          phone: formData.emergencyContactPhone.trim(),
        },
        notes: formData.notes.trim(),
      };

      const res = await axiosInstance.post("/patients", payload);

      if (res?.data?.success) {
        setFormSuccess("Patient added successfully.");
        await fetchPatients();

        setTimeout(() => {
          closeAddModal();
        }, 700);
      }
    } catch (err) {
      console.error("Add Patient Error:", err);
      setFormError(
        err?.response?.data?.message || "Failed to add patient."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // STATUS BADGE
  // =========================================================
  const getStatusBadge = (patient) => {
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
      <span
        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${classes}`}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Patients</h1>
          <p className="text-slate-500 mt-2">
            View and manage registered patients in the Smart IV Drip system.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
        >
          Add Patient
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <p className="text-sm text-slate-500">Total Patients</p>
          <h2 className="text-4xl font-bold text-slate-900 mt-3">
            {loadingPatients ? "..." : totalPatients}
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <p className="text-sm text-slate-500">Currently on IV</p>
          <h2 className="text-4xl font-bold text-blue-700 mt-3">
            {loadingPatients ? "..." : onIVCount}
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <p className="text-sm text-slate-500">Critical Watch</p>
          <h2 className="text-4xl font-bold text-red-600 mt-3">
            {loadingPatients ? "..." : criticalCount}
          </h2>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-slate-900">Patient Records</h2>

          <button
            onClick={fetchPatients}
            className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
          >
            Refresh
          </button>
        </div>

        {loadingPatients ? (
          <div className="py-14 text-center text-slate-500">
            Loading patients...
          </div>
        ) : patientsError ? (
          <div className="py-14 text-center text-red-600">{patientsError}</div>
        ) : patients.length === 0 ? (
          <div className="py-14 text-center text-slate-500">
            No patients found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="py-3 px-3 text-slate-500 font-semibold">
                    Patient
                  </th>
                  <th className="py-3 px-3 text-slate-500 font-semibold">ID</th>
                  <th className="py-3 px-3 text-slate-500 font-semibold">Age</th>
                  <th className="py-3 px-3 text-slate-500 font-semibold">
                    Gender
                  </th>
                  <th className="py-3 px-3 text-slate-500 font-semibold">
                    Ward / Bed
                  </th>
                  <th className="py-3 px-3 text-slate-500 font-semibold">
                    Diagnosis
                  </th>
                  <th className="py-3 px-3 text-slate-500 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {patients.map((patient) => (
                  <tr
                    key={patient._id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="py-4 px-3 font-semibold text-slate-900">
                      {patient.fullName}
                    </td>

                    <td className="py-4 px-3 text-slate-600">
                      {patient.patientId}
                    </td>

                    <td className="py-4 px-3 text-slate-600">{patient.age}</td>

                    <td className="py-4 px-3 text-slate-600">
                      {patient.gender || "N/A"}
                    </td>

                    <td className="py-4 px-3 text-slate-600">
                      {patient.ward?.wardName || "N/A"} •{" "}
                      {patient.bedNumber || "N/A"}
                    </td>

                    <td className="py-4 px-3 text-slate-600">
                      {patient.diagnosis || "N/A"}
                    </td>

                    <td className="py-4 px-3">{getStatusBadge(patient)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===================================================== */}
      {/* ADD PATIENT MODAL */}
      {/* ===================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="w-full max-w-6xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-7 border-b border-slate-200">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  Add Patient
                </h2>
                <p className="text-slate-500 mt-2">
                  Register a new patient in the Smart IV Drip system.
                </p>
              </div>

              <button
                onClick={closeAddModal}
                className="text-slate-500 hover:text-slate-700 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="p-7 space-y-8">
              {formError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">
                  {formSuccess}
                </div>
              )}

              {metaError && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-700">
                  {metaError}
                </div>
              )}

              {/* Basic Information */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-5">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Patient ID *
                    </label>
                    <input
                      type="text"
                      name="patientId"
                      value={formData.patientId}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                      placeholder="PAT-002"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                      placeholder="22"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Blood Group *
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                    >
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                        (group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Bed Number *
                    </label>
                    <input
                      type="text"
                      name="bedNumber"
                      value={formData.bedNumber}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                      placeholder="B-05"
                    />
                  </div>
                </div>
              </div>

              {/* Medical Details */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-5">
                  Medical Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Diagnosis
                    </label>
                    <input
                      type="text"
                      name="diagnosis"
                      value={formData.diagnosis}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                      placeholder="Enter diagnosis"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Allergies
                    </label>
                    <input
                      type="text"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                      placeholder="Dust, Penicillin"
                    />
                    <p className="text-xs text-slate-400 mt-2">
                      Separate multiple allergies with commas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ward & Staff */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-5">
                  Ward & Staff Assignment
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Ward *
                    </label>
                    <select
                      name="ward"
                      value={formData.ward}
                      onChange={handleChange}
                      disabled={metaLoading}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-100"
                    >
                      <option value="">Select Ward</option>
                      {wards.map((ward) => (
                        <option key={ward._id} value={ward._id}>
                          {ward.wardName} ({ward.wardCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Assigned Doctor
                    </label>
                    <select
                      name="assignedDoctor"
                      value={formData.assignedDoctor}
                      onChange={handleChange}
                      disabled={metaLoading}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-100"
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          {doctor.fullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Assigned Nurse
                    </label>
                    <select
                      name="assignedNurse"
                      value={formData.assignedNurse}
                      onChange={handleChange}
                      disabled={metaLoading}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-100"
                    >
                      <option value="">Select Nurse</option>
                      {nurses.map((nurse) => (
                        <option key={nurse._id} value={nurse._id}>
                          {nurse.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-5">
                  Emergency Contact
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                      placeholder="Contact name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Relation
                    </label>
                    <input
                      type="text"
                      name="emergencyContactRelation"
                      value={formData.emergencyContactRelation}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                      placeholder="Brother / Father / Mother"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                      placeholder="03001234567"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-5">Notes</h3>

                <textarea
                  rows={4}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300 resize-none"
                  placeholder="Additional patient notes..."
                />
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="px-5 py-3 rounded-2xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Adding..." : "Add Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsPage;