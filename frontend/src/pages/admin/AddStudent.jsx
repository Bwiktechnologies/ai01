import React, { useState } from 'react';
import { UserPlus, Mail, Phone, Lock, Save } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Toast, { ToastContainer } from '../../components/ui/Toast';
import { auth } from '../../firebase';

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    workshop: 'Memory Workshop',
    password: '',
    sendEmail: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      
      const response = await fetch('http://localhost:5000/api/admin/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to add student');
      }
      
      addToast('Student added successfully! Welcome email sent.', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        workshop: 'Memory Workshop',
        password: '',
        sendEmail: true
      });
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password: pass }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="mb-8">
        <h2 className="text-[24px] font-poppins font-bold text-[var(--color-text-primary)]">Add New Student</h2>
        <p className="text-[14px] font-inter text-text-secondary mt-1">
          Create a new account manually. They will receive an email with their credentials.
        </p>
      </div>

      <div className="glass-card rounded-2xl shadow-card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="name"
              placeholder="e.g. Rahul Kumar"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="e.g. rahul@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Phone Number"
              name="phone"
              placeholder="e.g. +91 9876543210"
              value={formData.phone}
              onChange={handleChange}
            />

            <div>
              <label className="block text-[13px] font-semibold text-text-secondary mb-1.5">
                Workshop / Origin
              </label>
              <select
                name="workshop"
                value={formData.workshop}
                onChange={handleChange}
                className="w-full bg-black border-[1.5px] border-[#1f2937] rounded-[10px] py-3 px-4 text-[15px] text-white focus:outline-none focus:border-[var(--color-accent)] focus:ring-[3px] focus:ring-[var(--color-accent)]/12"
              >
                <option value="Memory Workshop">Memory Workshop</option>
                <option value="Goal Setting Mastery">Goal Setting Mastery</option>
                <option value="Public Speaking">Public Speaking</option>
                <option value="Student Excellence">Student Excellence</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="border-t border-[var(--color-border)] pt-6 mt-2">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-[15px] font-poppins font-semibold text-[var(--color-text-primary)]">Authentication</h3>
                <p className="text-[12px] font-inter text-text-hint mt-0.5">Set an initial password for the student.</p>
              </div>
              <button 
                type="button" 
                onClick={generatePassword}
                className="text-[13px] font-inter font-medium text-[var(--color-accent)] hover:underline"
              >
                Generate Random
              </button>
            </div>
            
            <div className="max-w-md">
              <Input
                name="password"
                type="text"
                placeholder="Initial password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex items-start gap-3 mt-2">
            <input 
              type="checkbox" 
              name="sendEmail"
              id="sendEmail"
              checked={formData.sendEmail}
              onChange={handleChange}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)]" 
            />
            <div>
              <label htmlFor="sendEmail" className="text-[14px] font-poppins font-semibold text-orange-400 cursor-pointer">
                Send Welcome Email
              </label>
              <p className="text-[13px] font-inter text-orange-400/80 mt-1">
                This will automatically send an email via SendGrid to the student containing their login credentials and a link to the portal.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button variant="ghost" type="button" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="px-8">
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
