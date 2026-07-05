import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <div className="ml-64 min-h-screen flex flex-col">
        {/* Sticky Navbar */}
        <div className="sticky top-0 z-30">
          <Navbar />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;