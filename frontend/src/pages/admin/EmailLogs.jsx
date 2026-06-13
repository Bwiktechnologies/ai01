import React, { useState } from 'react';
import { Search, Filter, Mail, CheckCircle2, XCircle } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

import { auth } from '../../firebase';

const EmailLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchLogs = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();

        const response = await fetch('http://localhost:5000/api/admin/email-logs', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setLogs(data);
        }
      } catch (error) {
        console.error('Error fetching email logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-[24px] font-poppins font-bold text-[var(--color-text-primary)]">Email Delivery Logs</h2>
        <p className="text-[14px] font-inter text-text-secondary mt-1">
          Monitor SendGrid email delivery statuses and troubleshoot issues.
        </p>
      </div>

      <div className="glass-card rounded-2xl shadow-card overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-[var(--color-border)] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[rgba(0,0,0,0.2)]">
          <div className="w-full sm:w-[350px]">
            <Input 
              icon={Search} 
              placeholder="Search by email or subject..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="ghost" className="flex items-center gap-2 !py-2.5 h-[46px] w-full sm:w-auto">
              <Filter className="w-4 h-4" /> Filter Status
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[var(--color-section-alt)] border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-[11px] font-inter font-bold text-[#9CA3AF] uppercase tracking-wide">Timestamp</th>
                <th className="px-5 py-3 text-[11px] font-inter font-bold text-[#9CA3AF] uppercase tracking-wide">Recipient</th>
                <th className="px-5 py-3 text-[11px] font-inter font-bold text-[#9CA3AF] uppercase tracking-wide">Subject</th>
                <th className="px-5 py-3 text-[11px] font-inter font-bold text-[#9CA3AF] uppercase tracking-wide">Type</th>
                <th className="px-5 py-3 text-[11px] font-inter font-bold text-[#9CA3AF] uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500 font-inter">Loading logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500 font-inter">No logs found.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-[var(--color-border)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="px-5 py-4 text-[13px] font-inter text-text-secondary whitespace-nowrap">
                      {log.sentAt ? new Date(log.sentAt).toLocaleString() : '-'}
                    </td>
                    <td className="px-5 py-4 text-[14px] font-inter font-semibold text-[var(--color-text-primary)]">{log.to}</td>
                    <td className="px-5 py-4 text-[13px] font-inter text-text-secondary truncate max-w-[200px]">{log.subject || 'Welcome to AI Sajan Shah'}</td>
                    <td className="px-5 py-4">
                      <span className="text-[12px] font-inter text-gray-400 bg-gray-800 px-2 py-1 rounded">
                        {log.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className={`flex items-center gap-1.5 text-[13px] font-inter font-semibold ${
                        log.status === 'success' || log.status === 'Delivered' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {(log.status === 'success' || log.status === 'Delivered') ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {log.status === 'success' ? 'Delivered' : log.status}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmailLogs;
