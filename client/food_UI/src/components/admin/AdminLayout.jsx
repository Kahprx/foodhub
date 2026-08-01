import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

function AdminLayout({ showHeader = true }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        {showHeader && <AdminHeader onMenuClick={() => setSidebarOpen(true)} />}
        <main className="flex-1 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
