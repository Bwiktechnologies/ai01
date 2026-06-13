import React, { useState } from 'react';
import { User, Bell, Shield, Globe, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Toast, { ToastContainer } from '../../components/ui/Toast';

const Profile = () => {
  const { userProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    language: userProfile?.onboardingData?.language || 'hinglish',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast('Profile updated successfully!');
    }, 1000);
  };

  const getInitials = (name) => {
    if (!name) return 'SS';
    const parts = name.split(' ');
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  const cardStyle = { background: '#0a0a0a', border: '1px solid #1f2937' };

  return (
    <div className="max-w-[900px] mx-auto w-full px-4 lg:px-6 py-6 lg:py-8">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="mb-8">
        <h2 className="text-[24px] font-poppins font-bold text-white">
          My Profile
        </h2>
        <p className="text-[14px] font-inter mt-1" style={{ color: '#9ca3af' }}>
          Manage your personal information and preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Col */}
        <div className="w-full md:w-[300px] shrink-0 flex flex-col gap-6">
          <div className="rounded-[20px] p-6 flex flex-col items-center text-center" style={cardStyle}>
            <div className="w-24 h-24 rounded-full animated-gradient flex items-center justify-center mb-4 relative group cursor-pointer"
              style={{ boxShadow: 'var(--shadow-orange)' }}>
              <span className="text-white font-poppins font-bold text-[32px]">
                {getInitials(formData.name)}
              </span>
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-[12px] font-medium font-inter">Change Photo</span>
              </div>
            </div>
            <h3 className="text-[18px] font-poppins font-bold text-white">
              {formData.name || 'Student'}
            </h3>
            <p className="text-[13px] font-inter mt-1" style={{ color: '#9ca3af' }}>
              {formData.email}
            </p>
            <div className="mt-4 inline-block px-3 py-1 rounded-full text-[12px] font-inter font-semibold"
              style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}>
              Active Member
            </div>
          </div>
        </div>

        {/* Right Col */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="rounded-[20px] p-6" style={cardStyle}>
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5" style={{ color: '#f26522' }} />
              <h3 className="text-[16px] font-poppins font-semibold text-white">
                Personal Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
              <div className="opacity-60 pointer-events-none">
                <Input label="Email Address" name="email" type="email" value={formData.email} disabled />
              </div>
              <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="rounded-[20px] p-6" style={cardStyle}>
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5" style={{ color: '#f26522' }} />
              <h3 className="text-[16px] font-poppins font-semibold text-white">
                Preferences
              </h3>
            </div>
            
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: '#9ca3af' }}>
                  AI Communication Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full border-[1.5px] rounded-[10px] py-3 px-4 text-[15px] transition-all duration-150 outline-none"
                  style={{ background: '#000', borderColor: '#1f2937', color: '#fff' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#f26522'; e.currentTarget.style.boxShadow = 'var(--shadow-glow-accent)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#1f2937'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <option value="hinglish" style={{ background: '#0a0a0a' }}>Hinglish (Hindi + English)</option>
                  <option value="english" style={{ background: '#0a0a0a' }}>English Only</option>
                  <option value="hindi" style={{ background: '#0a0a0a' }}>Hindi Only</option>
                  <option value="gujarati" style={{ background: '#0a0a0a' }}>Gujarati</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="px-8 py-3 rounded-xl font-inter font-bold text-white flex items-center gap-2 transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: '#f26522', boxShadow: 'var(--shadow-orange)' }}
            >
              {!isSaving && <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
