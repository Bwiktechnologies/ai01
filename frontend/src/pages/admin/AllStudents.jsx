import React, { useState, useEffect } from 'react';
import { Search, Filter, Mail, Edit, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { auth } from '../../firebase';

const AllStudents = () => {
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
          setStudents(data);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);

  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to completely delete this student? This action cannot be undone.")) return;

    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const response = await fetch(`http://localhost:5000/api/admin/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setStudents(prev => prev.filter(s => s.id !== studentId));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete student');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting the student.');
    }
  };

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-[24px] font-poppins font-bold text-[var(--color-text-primary)]">All Students</h2>
          <p className="text-[14px] font-inter text-text-secondary mt-1">
            Manage student access and view profiles.
          </p>
        </div>
        <Button className="shrink-0" onClick={() => window.location.href='/admin/add-student'}>
          + Add New Student
        </Button>
      </div>

      <div className="glass-card rounded-2xl shadow-card overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-[var(--color-border)] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[rgba(0,0,0,0.2)]">
          <div className="w-full sm:w-[350px]">
            <Input 
              icon={Search} 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="ghost" className="flex items-center gap-2 !py-2.5 h-[46px] w-full sm:w-auto">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[var(--color-section-alt)] border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-[11px] font-inter font-bold text-[#9CA3AF] uppercase tracking-wide">Student Info</th>
                <th className="px-5 py-3 text-[11px] font-inter font-bold text-[#9CA3AF] uppercase tracking-wide">Contact</th>
                <th className="px-5 py-3 text-[11px] font-inter font-bold text-[#9CA3AF] uppercase tracking-wide">Workshop</th>
                <th className="px-5 py-3 text-[11px] font-inter font-bold text-[#9CA3AF] uppercase tracking-wide">Date Added</th>
                <th className="px-5 py-3 text-[11px] font-inter font-bold text-[#9CA3AF] uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 text-[11px] font-inter font-bold text-[#9CA3AF] uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500 font-inter">Loading students...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500 font-inter">No students found.</td></tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-[var(--color-border)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {student.name ? student.name.substring(0,2).toUpperCase() : 'ST'}
                        </div>
                        <span className="text-[14px] font-inter font-semibold text-[var(--color-text-primary)]">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-inter text-text-secondary">{student.email}</span>
                        <span className="text-[12px] font-inter text-[#9CA3AF]">{student.phone}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[13px] font-inter text-text-secondary">{student.workshop || '-'}</td>
                    <td className="px-5 py-4 text-[13px] font-inter text-text-secondary">
                      {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[12px] font-inter font-semibold ${
                        student.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {student.status || 'active'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2 text-gray-400">
                        <button className="p-1.5 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors" title="Resend Welcome Email">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:text-orange-500 hover:bg-orange-50 rounded transition-colors" title="Edit Student">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(student.id)}
                          className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded transition-colors" 
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-5 border-t border-[var(--color-border)] flex items-center justify-between">
          <span className="text-[13px] text-text-secondary">Showing {filteredStudents.length} students</span>
          <div className="flex gap-2">
            <Button variant="ghost" className="!py-1.5 !px-3 text-[13px]" disabled>Previous</Button>
            <Button variant="ghost" className="!py-1.5 !px-4 text-[13px]" disabled={filteredStudents.length < 10}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllStudents;
