import React, { useState, useEffect } from 'react';
import { Users, Activity, Mail, UserPlus, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; // Needed for token

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    activeThisWeek: 0,
    emailsSent: 0,
    newThisMonth: 0,
  });

  const [timeStr, setTimeStr] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        
        const response = await fetch('http://localhost:5000/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const stats = [
    { label: 'TOTAL STUDENTS', value: dashboardData.totalStudents, icon: Users, bg: 'bg-blue-500/10 text-blue-400', trend: 'Live Data', up: true },
    { label: 'ACTIVE THIS WEEK', value: dashboardData.activeThisWeek, icon: Activity, bg: 'bg-green-500/10 text-green-400', trend: 'Live Data', up: true },
    { label: 'EMAILS SENT', value: dashboardData.emailsSent, icon: Mail, bg: 'bg-orange-500/10 text-orange-400', trend: 'Live Data', up: true },
    { label: 'NEW THIS MONTH', value: dashboardData.newThisMonth, icon: UserPlus, bg: 'bg-purple-500/10 text-purple-400', trend: 'Live Data', up: true },
  ];

  const activityData = [
    { day: '01', users: 2400 },
    { day: '05', users: 1398 },
    { day: '10', users: 4800 },
    { day: '15', users: 3908 },
    { day: '20', users: 4800 },
    { day: '25', users: 3800 },
    { day: '30', users: 4300 },
  ];

  const workshopData = [
    { name: 'Memory Workshop', value: 400 },
    { name: 'Goal Setting Mastery', value: 300 },
    { name: 'Public Speaking', value: 300 },
    { name: 'Student Excellence', value: 200 },
  ];
  const COLORS = ['#FF6B35', '#F5A623', '#3B82F6', '#10B981'];

  const recentStudents = [
    { id: 1, name: 'Aarav Patel', email: 'aarav@example.com', workshop: 'Memory Workshop', dateAdded: 'Oct 12, 2023', lastLogin: 'Today, 10:30 AM', status: 'Active' },
  ];

  if (loading) {
    return <div className="p-8 max-w-7xl mx-auto w-full flex justify-center items-center h-[50vh]"><p className="text-gray-500 font-inter">Loading Real-Time Stats...</p></div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div>
        <h2 className="text-[24px] font-poppins font-bold text-[var(--color-text-primary)]">
          Good {timeStr}, Sajan Shah 👋
        </h2>
        <p className="text-[14px] font-inter text-text-secondary mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-5 hover:shadow-card-hover transition-shadow duration-200">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-inter font-bold text-[#9CA3AF] uppercase tracking-wide">
                {stat.label}
              </span>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-[32px] font-poppins font-bold text-[var(--color-text-primary)] mt-3">
              {stat.value.toLocaleString()}
            </div>
            <div className={`flex items-center gap-1 mt-2 text-[12px] font-inter font-medium ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
              <TrendingUp className="w-3.5 h-3.5" />
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="glass-card rounded-2xl p-5 shadow-card">
          <h3 className="text-[16px] font-poppins font-semibold text-[var(--color-text-primary)] mb-6">Student Activity — Last 30 Days</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #1f2937', background: '#0a0a0a', color: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }} />
                <Line type="monotone" dataKey="users" stroke="#FF6B35" strokeWidth={3} dot={{ r: 4, fill: '#FF6B35', strokeWidth: 2, stroke: '#0a0a0a' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 shadow-card flex flex-col">
          <h3 className="text-[16px] font-poppins font-semibold text-[var(--color-text-primary)] mb-2">Workshop Distribution</h3>
          <div className="flex-1 flex flex-row items-center justify-center">
            <div className="h-[200px] w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workshopData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {workshopData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #1f2937', background: '#0a0a0a', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} itemStyle={{ color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="ml-4 flex flex-col gap-3">
              {workshopData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-[13px] font-inter text-text-secondary">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Students Table */}
      <div className="glass-card rounded-2xl shadow-card mt-8 overflow-hidden">
        <div className="p-5 border-b border-[var(--color-border)] flex justify-between items-center">
          <h3 className="text-[16px] font-poppins font-semibold text-[var(--color-text-primary)]">Recently Added Students</h3>
          <button onClick={() => navigate('/admin/students')} className="text-[14px] font-inter font-medium text-[var(--color-accent)] hover:underline">
            View All Students →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-section-alt)] border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-[11px] font-inter font-bold text-[#9CA3AF] uppercase tracking-wide">Name</th>
                <th className="px-5 py-3 text-[11px] font-inter font-bold text-[#9CA3AF] uppercase tracking-wide">Email</th>
                <th className="px-5 py-3 text-[11px] font-inter font-bold text-[#9CA3AF] uppercase tracking-wide">Workshop</th>
                <th className="px-5 py-3 text-[11px] font-inter font-bold text-[#9CA3AF] uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((student) => (
                <tr key={student.id} className="border-b border-[var(--color-border)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="px-5 py-4 text-[14px] font-inter font-semibold text-[var(--color-text-primary)] whitespace-nowrap">{student.name}</td>
                  <td className="px-5 py-4 text-[13px] font-inter text-text-secondary">{student.email}</td>
                  <td className="px-5 py-4 text-[13px] font-inter text-text-secondary">{student.workshop}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[12px] font-inter font-semibold bg-green-500/10 text-green-400`}>
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
