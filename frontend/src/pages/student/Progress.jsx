import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Trophy, Flame, Target, Activity } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Progress = () => {
  const { userProfile } = useAuth();

  const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const activityData = daysOrder.map(day => ({
    day,
    minutes: userProfile?.dailyActivity?.[day] || 0
  }));

  const goalData = userProfile?.goalTrajectory || [
    { week: 'W1', completion: 0 }, { week: 'W2', completion: 0 }, { week: 'W3', completion: 0 },
    { week: 'W4', completion: 0 }, { week: 'W5', completion: 0 }
  ];

  const stats = [
    { label: 'Current Streak', value: `${userProfile?.streakCount || 0} Days`, icon: Flame, color: '#f26522', bg: 'rgba(242,101,34,0.1)' },
    { label: 'Total XP', value: `${userProfile?.xp || 0}`, icon: Trophy, color: '#F5A623', bg: 'rgba(245,166,35,0.1)' },
    { label: 'Goals Met', value: '0', icon: Target, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Active Days', value: '0', icon: Activity, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  ];

  const cardStyle = { background: '#0a0a0a', border: '1px solid #1f2937' };

  return (
    <div className="max-w-[900px] mx-auto w-full px-4 lg:px-6 py-6 lg:py-8">
      <div className="mb-8">
        <h2 className="text-[24px] font-poppins font-bold text-white">
          My Progress
        </h2>
        <p className="text-[14px] font-inter mt-1 max-w-2xl" style={{ color: '#9ca3af' }}>
          Track your transformation journey. Consistency is the key to lasting change.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="rounded-[16px] p-4 flex flex-col items-center text-center transition-all duration-200 hover:-translate-y-1"
            style={cardStyle}
            onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${stat.color}`; e.currentTarget.style.boxShadow = `0 8px 32px ${stat.bg}`; }}
            onMouseLeave={e => { e.currentTarget.style.border = '1px solid #1f2937'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: stat.bg }}>
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <p className="text-[20px] font-poppins font-bold text-white">
              {stat.value}
            </p>
            <p className="text-[12px] font-inter font-medium mt-0.5 uppercase tracking-wide" style={{ color: '#9ca3af' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="rounded-[20px] p-6" style={cardStyle}>
          <h3 className="text-[16px] font-poppins font-semibold text-white mb-6">
            Platform Activity (Minutes)
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ background: '#0a0a0a', border: '1px solid #1f2937', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#f26522' }}
                />
                <Bar dataKey="minutes" fill="#f26522" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goal Progress Chart */}
        <div className="rounded-[20px] p-6" style={cardStyle}>
          <h3 className="text-[16px] font-poppins font-semibold text-white mb-6">
            90-Day Goal Trajectory
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={goalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ background: '#0a0a0a', border: '1px solid #1f2937', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#10B981' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completion" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#0a0a0a' }}
                  activeDot={{ r: 6, fill: '#10B981', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
