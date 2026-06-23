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
    <div className="w-full h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
        <div>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[var(--color-primary)] tracking-tight">All Students.</h2>
          <p className="text-[16px] font-sans text-[var(--color-text-secondary)] mt-2">
            Manage student access and view profiles.
          </p>
        </div>
        <button className="btn-elegant shrink-0" onClick={() => window.location.href='/admin/add-student'}>
          + Add New Student
        </button>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-8 border-b border-[var(--color-border)] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[var(--color-bg)]">
          <div className="w-full sm:w-[400px] relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-[var(--color-text-hint)]" />
            </div>
            <input 
              type="text"
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-primary)] placeholder-[var(--color-text-hint)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none font-sans text-sm"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 h-12 px-6 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-primary)] font-sans font-semibold text-sm hover:bg-[var(--color-bg)] hover:text-[var(--color-primary)] transition-all w-full sm:w-auto">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white border-b border-[var(--color-border)]">
                <th className="px-8 py-5 text-[11px] font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest">Student Info</th>
                <th className="px-8 py-5 text-[11px] font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest">Contact</th>
                <th className="px-8 py-5 text-[11px] font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest">Workshop</th>
                <th className="px-8 py-5 text-[11px] font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest">Date Added</th>
                <th className="px-8 py-5 text-[11px] font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[11px] font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-12 text-[var(--color-text-secondary)] font-sans">Loading students...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12 text-[var(--color-text-secondary)] font-sans">No students found.</td></tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors bg-white">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-primary)] flex items-center justify-center font-serif font-bold text-lg shrink-0">
                          {student.name ? student.name.substring(0,2).toUpperCase() : 'ST'}
                        </div>
                        <span className="text-[15px] font-sans font-bold text-[var(--color-primary)]">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-sans text-[var(--color-text-secondary)]">{student.email}</span>
                        <span className="text-[12px] font-sans text-[var(--color-text-hint)] mt-1">{student.phone}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-[14px] font-sans text-[var(--color-text-secondary)]">{student.workshop || '-'}</td>
                    <td className="px-8 py-6 text-[14px] font-sans text-[var(--color-text-secondary)]">
                      {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-sans font-bold tracking-wide uppercase ${
                        student.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-600 border border-slate-200'
                      }`}>
                        {student.status || 'active'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 text-[var(--color-text-hint)]">
                        <button className="p-2 hover:text-[var(--color-primary)] hover:bg-[var(--color-bg)] rounded-full transition-colors" title="Resend Welcome Email">
                          <Mail className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:text-[var(--color-primary)] hover:bg-[var(--color-bg)] rounded-full transition-colors" title="Edit Student">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(student.id)}
                          className="p-2 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" 
                          title="Delete Student"
                        >
                          <Trash2 className="w-5 h-5" />
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
        <div className="p-6 border-t border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg)]">
          <span className="text-[13px] font-sans font-semibold text-[var(--color-text-secondary)] tracking-wide">Showing {filteredStudents.length} students</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-sans font-semibold text-[var(--color-text-hint)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>Previous</button>
            <button className="px-4 py-2 text-sm font-sans font-semibold text-[var(--color-text-hint)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={filteredStudents.length < 10}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllStudents;
