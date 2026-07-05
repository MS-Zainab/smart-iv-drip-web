import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PatientsPage from "./pages/PatientsPage";
import DevicesPage from "./pages/DevicesPage";
import SessionsPage from "./pages/SessionsPage";
import AlertsPage from "./pages/AlertsPage";
import NursesPage from "./pages/NursesPage";
import WardsPage from "./pages/WardsPage";

const NotFoundPage = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-3">404 - Page Not Found</h1>
      <p className="text-slate-600">
        The page you are trying to access does not exist.
      </p>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const ProtectedLayout = ({ children }) => {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedLayout>
              <DashboardPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/patients"
          element={
            <ProtectedLayout>
              <PatientsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/devices"
          element={
            <ProtectedLayout>
              <DevicesPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/sessions"
          element={
            <ProtectedLayout>
              <SessionsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/alerts"
          element={
            <ProtectedLayout>
              <AlertsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/nurses"
          element={
            <ProtectedLayout>
              <NursesPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/wards"
          element={
            <ProtectedLayout>
              <WardsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="*"
          element={
            <ProtectedLayout>
              <NotFoundPage />
            </ProtectedLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;