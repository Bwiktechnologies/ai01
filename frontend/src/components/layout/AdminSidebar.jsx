import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, BarChart2, Users, UserPlus, Upload, 
  Mail, Code2, Gamepad2, Settings, LogOut 
} from 'lucide-react';

const AdminSidebar = () => {
  const { logout } = useAuth();

  const sections = [
    {
      label: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
        { label: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
      ]
    },
    {
      label: 'STUDENTS',
      items: [
        { label: 'All Students', path: '/admin/students', icon: Users },
        { label: 'Add Student', path: '/admin/add-student', icon: UserPlus },
        { label: 'Upload CSV', path: '/admin/upload-csv', icon: Upload },
        { label: 'Email Logs', path: '/admin/email-logs', icon: Mail },
      ]
    },
    {
      label: 'CONTENT',
      items: [
        { label: 'AI Prompt Editor', path: '/admin/prompt-editor', icon: Code2 },
        { label: 'Brain Gym Scores', path: '/admin/content', icon: Gamepad2 },
      ]
    },
    {
      label: 'SYSTEM',
      items: [
        { label: 'Settings', path: '/admin/settings', icon: Settings },
      ]
    }
  ];

  return (
    <div className="w-full h-full bg-[#1A1A2E] flex flex-col overflow-y-auto text-white/60">
      {/* Top Logo */}
      <div className="h-[64px] border-b border-[#2D2D44] px-5 flex items-center justify-between flex-shrink-0">
        <span className="text-[16px] font-poppins font-bold text-white">AI Sajan Shah</span>
        <span className="bg-[#FF6B35]/20 text-[#FF6B35] border border-orange-300/30 rounded-full px-2 py-0.5 text-[10px] font-inter font-bold">
          ADMIN
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-2 flex flex-col overflow-y-auto">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-2">
            <div className="text-[10px] font-inter font-bold text-white/40 uppercase tracking-widest px-4 pt-5 pb-2">
              {section.label}
            </div>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) => `
                  flex items-center gap-3 mx-3 px-3 py-2.5 rounded-[10px] cursor-pointer transition-all duration-150
                  ${isActive 
                    ? 'bg-[#FF6B35] text-white' 
                    : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-[18px] h-[18px] ${isActive ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`} />
                    <span className={`text-[14px] font-inter ${isActive ? 'font-semibold' : 'font-medium'}`}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom Logout */}
      <div className="border-t border-white/10 p-3 mx-3 mt-auto flex-shrink-0">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors text-[14px] font-inter font-medium text-left"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
