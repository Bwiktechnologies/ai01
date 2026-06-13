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
    <div className="p-8 max-w-4xl mx-auto w-full">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-[24px] font-poppins font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-gray-500" />
            System Settings
          </h2>
          <p className="text-[14px] font-inter text-text-secondary mt-1">
            Manage global platform configurations and API integrations.
          </p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving} className="shrink-0 flex items-center gap-2 px-6">
          {!isSaving && <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>

      <div className="flex flex-col gap-8">
        {/* API Keys */}
        <div className="glass-card rounded-2xl shadow-card p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
              <Key className="w-5 h-5 text-[var(--color-accent)]" />
            </div>
            <div>
              <h3 className="text-[16px] font-poppins font-semibold text-[var(--color-text-primary)]">API Integrations</h3>
              <p className="text-[13px] font-inter text-text-hint">Manage keys for third-party services.</p>
            </div>
          </div>
          
          <div className="space-y-5">
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
        <div className="glass-card rounded-2xl shadow-card p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-[16px] font-poppins font-semibold text-[var(--color-text-primary)]">Global Preferences</h3>
              <p className="text-[13px] font-inter text-text-hint">Platform-wide settings.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-[rgba(255,255,255,0.05)] border border-transparent hover:border-[var(--color-border)] transition-colors">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-[var(--color-accent)] focus:ring-[var(--color-accent)] rounded border-gray-600 bg-black" />
              <div>
                <span className="block text-[14px] font-poppins font-medium text-[var(--color-text-primary)]">Allow Student Registration</span>
                <span className="block text-[12px] font-inter text-text-hint">If unchecked, only admins can add students manually.</span>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-[rgba(255,255,255,0.05)] border border-transparent hover:border-[var(--color-border)] transition-colors">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-[var(--color-accent)] focus:ring-[var(--color-accent)] rounded border-gray-600 bg-black" />
              <div>
                <span className="block text-[14px] font-poppins font-medium text-[var(--color-text-primary)]">Maintenance Mode</span>
                <span className="block text-[12px] font-inter text-text-hint">Show a maintenance screen to non-admin users.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Branding */}
        <div className="glass-card rounded-2xl shadow-card p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
              <Layout className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h3 className="text-[16px] font-poppins font-semibold text-[var(--color-text-primary)]">Branding</h3>
              <p className="text-[13px] font-inter text-text-hint">Customize platform appearance.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-semibold text-text-secondary mb-1.5">Primary Color</label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FF6B35] border border-[var(--color-border)] shadow-sm"></div>
                <Input defaultValue="#FF6B35" className="flex-1" />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-text-secondary mb-1.5">Secondary Color</label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1A1A2E] border border-[var(--color-border)] shadow-sm"></div>
                <Input defaultValue="#1A1A2E" className="flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
