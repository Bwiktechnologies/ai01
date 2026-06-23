import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Key, Globe, Layout } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Toast, { ToastContainer } from '../../components/ui/Toast';

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast('Settings saved successfully!');
    }, 1500);
  };

  return (
    <div className="p-8 lg:p-12 max-w-4xl mx-auto w-full">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
        <div>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[var(--color-primary)] tracking-tight flex items-center gap-4">
            <SettingsIcon className="w-10 h-10 text-[var(--color-text-secondary)]" />
            System Settings.
          </h2>
          <p className="text-[16px] font-sans text-[var(--color-text-secondary)] mt-2">
            Manage global platform configurations and API integrations.
          </p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="btn-elegant shrink-0 flex items-center gap-2 px-6">
          {!isSaving && <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {/* API Keys */}
        <div className="bg-white border border-[var(--color-border)] rounded-2xl shadow-sm p-8 lg:p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
              <Key className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-[var(--color-primary)]">API Integrations</h3>
              <p className="text-[14px] font-sans text-[var(--color-text-secondary)]">Manage keys for third-party services.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <Input 
              label="OpenAI API Key" 
              type="password" 
              defaultValue="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx"
            />
            <Input 
              label="SendGrid API Key" 
              type="password" 
              defaultValue="SG.xxxxxxxxxxxxxxxxxxxxxxxx"
            />
          </div>
        </div>

        {/* Global Settings */}
        <div className="bg-white border border-[var(--color-border)] rounded-2xl shadow-sm p-8 lg:p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-[var(--color-primary)]">Global Preferences</h3>
              <p className="text-[14px] font-sans text-[var(--color-text-secondary)]">Platform-wide settings.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center gap-4 cursor-pointer p-4 rounded-xl hover:bg-[var(--color-bg)] border border-transparent hover:border-[var(--color-border)] transition-colors">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-[var(--color-primary)] focus:ring-[var(--color-primary)] rounded border-[var(--color-border)]" />
              <div>
                <span className="block text-[15px] font-sans font-bold text-[var(--color-primary)]">Allow Student Registration</span>
                <span className="block text-[13px] font-sans text-[var(--color-text-hint)] mt-0.5">If unchecked, only admins can add students manually.</span>
              </div>
            </label>
            <label className="flex items-center gap-4 cursor-pointer p-4 rounded-xl hover:bg-[var(--color-bg)] border border-transparent hover:border-[var(--color-border)] transition-colors">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-[var(--color-primary)] focus:ring-[var(--color-primary)] rounded border-[var(--color-border)]" />
              <div>
                <span className="block text-[15px] font-sans font-bold text-[var(--color-primary)]">Maintenance Mode</span>
                <span className="block text-[13px] font-sans text-[var(--color-text-hint)] mt-0.5">Show a maintenance screen to non-admin users.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white border border-[var(--color-border)] rounded-2xl shadow-sm p-8 lg:p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
              <Layout className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-[var(--color-primary)]">Branding</h3>
              <p className="text-[14px] font-sans text-[var(--color-text-secondary)]">Customize platform appearance.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-sans font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-widest">Primary Color</label>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#1A1A1A] border border-[var(--color-border)] shadow-sm shrink-0"></div>
                <Input defaultValue="#1A1A1A" className="flex-1" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-sans font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-widest">Secondary Color</label>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#FAF9F6] border border-[#E5E2DC] shadow-sm shrink-0"></div>
                <Input defaultValue="#FAF9F6" className="flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
