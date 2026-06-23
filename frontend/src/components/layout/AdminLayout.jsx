import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="h-screen bg-[var(--color-bg)] flex font-sans relative overflow-hidden">
      {/* Elegant Flat Background - No Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[var(--color-bg)]"></div>

      {/* Admin Sidebar */}
      <div className="w-[260px] flex-shrink-0 relative z-40 border-r border-[var(--color-border)] bg-white h-full">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen relative z-10 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 lg:p-12">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
