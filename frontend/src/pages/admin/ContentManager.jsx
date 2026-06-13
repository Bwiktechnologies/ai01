import React, { useState, useEffect } from 'react';
import { Gamepad2, Search, Trophy, Medal, Star } from 'lucide-react';
import { auth } from '../../firebase';
import Input from '../../components/ui/Input';

const BrainGymScores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        
        const response = await fetch('http://localhost:5000/api/admin/students', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Filter out users without XP, or just show them with 0. 
          // Let's sort by XP descending.
          const sortedData = data.sort((a, b) => (b.xp || 0) - (a.xp || 0));
          setStudents(sortedData);
        }
      } catch (error) {
        console.error('Error fetching student scores:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-[24px] font-poppins font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-[#FF6B35]" />
            Brain Gym Leaderboard
          </h2>
          <p className="text-[14px] font-inter text-text-secondary mt-1">
            Track student progress, XP, and levels from playing Brain Gym exercises.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl shadow-card overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-[var(--color-border)] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[rgba(0,0,0,0.2)]">
          <div className="w-full sm:w-[350px]">
            <Input 
              icon={Search} 
              placeholder="Search by student name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[var(--color-section-alt)] border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-[11px] font-inter font-bold text-[#9CA3AF] uppercase tracking-wide w-20 text-center">Rank</th>
                <th className="px-5 py-3 text-[11px] font-inter font-bold text-[#9CA3AF] uppercase tracking-wide">Student Info</th>
                <th className="px-5 py-3 text-[11px] font-inter font-bold text-[#9CA3AF] uppercase tracking-wide text-center">Level</th>
                <th className="px-5 py-3 text-[11px] font-inter font-bold text-[#9CA3AF] uppercase tracking-wide text-right">Total XP</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-8 text-gray-500 font-inter">Loading scores...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-8 text-gray-500 font-inter">No students found.</td></tr>
              ) : (
                filteredStudents.map((student, index) => {
                  let RankIcon = null;
                  let rankColor = "text-text-secondary";
                  if (index === 0) {
                    RankIcon = Trophy;
                    rankColor = "text-yellow-400";
                  } else if (index === 1) {
                    RankIcon = Medal;
                    rankColor = "text-gray-300";
                  } else if (index === 2) {
                    RankIcon = Medal;
                    rankColor = "text-amber-600";
                  }

                  return (
                    <tr key={student.id} className="border-b border-[var(--color-border)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="px-5 py-4 text-center">
                        <div className="flex justify-center items-center h-full">
                          {RankIcon ? (
                            <RankIcon className={`w-6 h-6 ${rankColor}`} />
                          ) : (
                            <span className="text-[14px] font-poppins font-bold text-gray-500">#{index + 1}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-sm shrink-0">
                            {student.name ? student.name.substring(0,2).toUpperCase() : 'ST'}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-inter font-semibold text-[var(--color-text-primary)]">{student.name}</span>
                            <span className="text-[12px] font-inter text-text-secondary">{student.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <Star className="w-3.5 h-3.5" />
                          <span className="text-[13px] font-bold font-poppins">Level {student.level || 1}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-[16px] font-poppins font-bold text-[#10B981]">
                          {(student.xp || 0).toLocaleString()} XP
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BrainGymScores;
