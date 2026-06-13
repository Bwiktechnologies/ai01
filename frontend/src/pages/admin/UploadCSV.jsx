import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, FileSpreadsheet, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Papa from 'papaparse';
import { auth } from '../../firebase';

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        alert('Please upload a CSV file.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = "name,email,phone,workshop\nJane Doe,jane@example.com,+919876543210,Memory Workshop\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "student_upload_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadResult(null);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const user = auth.currentUser;
          if (!user) throw new Error("Not authenticated");
          const token = await user.getIdToken();

          const response = await fetch('http://localhost:5000/api/admin/bulk-upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ students: results.data })
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error || 'Failed bulk upload');
          
          setUploadResult({
            success: true,
            totalProcessed: results.data.length,
            created: data.successful,
            failed: data.failed,
            errors: data.errors || []
          });
          setFile(null);
        } catch (error) {
          console.error(error);
          alert('Bulk upload failed: ' + error.message);
        } finally {
          setIsUploading(false);
        }
      }
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-[24px] font-poppins font-bold text-[var(--color-text-primary)]">Bulk Upload Students</h2>
        <p className="text-[14px] font-inter text-text-secondary mt-1">
          Upload a CSV file from Sajan's workshops to create accounts in bulk. Welcome emails will be sent automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl shadow-card p-6">
            
            <div 
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors
                ${file ? 'border-[#10B981] bg-green-500/10' : 'border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-orange-500/10'}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              
              {file ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                    <FileSpreadsheet className="w-8 h-8 text-[#10B981]" />
                  </div>
                  <h3 className="text-[16px] font-poppins font-semibold text-[var(--color-text-primary)]">{file.name}</h3>
                  <p className="text-[13px] font-inter text-text-secondary mt-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  
                  <div className="flex gap-3 mt-6">
                    <Button variant="ghost" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                      <Trash2 className="w-4 h-4 mr-2" /> Remove
                    </Button>
                    <Button onClick={(e) => { e.stopPropagation(); handleUpload(); }} isLoading={isUploading}>
                      Upload & Process
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center mb-4">
                    <UploadIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-[16px] font-poppins font-semibold text-[var(--color-text-primary)]">Drag & Drop your CSV here</h3>
                  <p className="text-[13px] font-inter text-text-secondary mt-1 max-w-sm mx-auto">
                    or click to browse from your computer. Make sure it follows the required format.
                  </p>
                  <Button variant="secondary" className="mt-6 pointer-events-none">
                    Select File
                  </Button>
                </>
              )}
            </div>

            {uploadResult && (
              <div className="mt-8 border-t border-[var(--color-border)] pt-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-poppins font-bold text-[var(--color-text-primary)]">Upload Results</h3>
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[12px] font-bold">
                    Completed
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-[rgba(255,255,255,0.05)] rounded-xl p-4 text-center border border-[var(--color-border)]">
                    <div className="text-[24px] font-poppins font-bold text-[var(--color-text-primary)]">{uploadResult.totalProcessed}</div>
                    <div className="text-[11px] font-inter font-bold text-gray-400 uppercase">Processed</div>
                  </div>
                  <div className="bg-green-500/10 rounded-xl p-4 text-center border border-green-500/20">
                    <div className="text-[24px] font-poppins font-bold text-green-500">{uploadResult.created}</div>
                    <div className="text-[11px] font-inter font-bold text-green-500 uppercase">Created</div>
                  </div>
                  <div className="bg-red-500/10 rounded-xl p-4 text-center border border-red-500/20">
                    <div className="text-[24px] font-poppins font-bold text-red-500">{uploadResult.failed}</div>
                    <div className="text-[11px] font-inter font-bold text-red-500 uppercase">Failed</div>
                  </div>
                </div>

                {uploadResult.errors?.length > 0 && (
                  <div>
                    <h4 className="text-[14px] font-poppins font-semibold text-red-500 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Error Log
                    </h4>
                    <div className="bg-black border border-red-500/20 rounded-xl overflow-hidden text-[13px] font-inter">
                      {uploadResult.errors.map((err, i) => (
                        <div key={i} className="flex p-3 border-b border-[var(--color-border)] last:border-0 bg-red-500/10">
                          <span className="w-16 font-semibold text-red-400">Row {err.row || i+1}</span>
                          <span className="w-48 text-gray-300 truncate">{err.email}</span>
                          <span className="text-red-400">{err.error || err.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-6 shadow-card">
            <h3 className="text-[15px] font-poppins font-bold text-[var(--color-text-primary)] mb-4">Required Format</h3>
            <p className="text-[13px] font-inter text-text-secondary mb-4">
              Your CSV file must include a header row with exactly these column names:
            </p>
            
            <div className="bg-black border border-[var(--color-border)] rounded-lg p-3 text-[12px] font-mono text-[var(--color-text-primary)] mb-6 overflow-x-auto whitespace-nowrap">
              name, email, phone, workshop
            </div>

            <h4 className="text-[13px] font-poppins font-semibold text-[var(--color-text-primary)] mb-2">Column Details:</h4>
            <ul className="text-[13px] font-inter text-text-secondary space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <span><strong className="text-white">name</strong> (Required): Full name of the student.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <span><strong className="text-white">email</strong> (Required): Must be a valid, unique email address.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <span><strong className="text-white">phone</strong> (Optional): Including country code is recommended.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <span><strong className="text-white">workshop</strong> (Optional): Source of the student (e.g., 'Memory Workshop').</span>
              </li>
            </ul>
            
            <Button onClick={handleDownloadTemplate} variant="secondary" className="w-full mt-6 flex items-center justify-center gap-2">
              <FileSpreadsheet className="w-4 h-4" /> Download Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCSV;
