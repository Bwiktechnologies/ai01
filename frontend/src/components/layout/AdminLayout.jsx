import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      {/* Admin Sidebar */}
      <div className="w-[260px] flex-shrink-0 z-40 fixed h-full bg-[#1A1A2E]">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-[260px] min-h-screen">
        <main className="w-full min-h-screen relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
