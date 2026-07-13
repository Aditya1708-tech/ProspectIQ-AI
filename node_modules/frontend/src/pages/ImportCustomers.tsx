import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, AlertCircle, CheckCircle2, XCircle, Info, Loader2 } from 'lucide-react';
import { Layout } from '../components/layout/Layout.js';
import type { ImportSummary } from 'shared';

export const ImportCustomers: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [useCustomMapping, setUseCustomMapping] = useState(false);
  const [mappingJson, setMappingJson] = useState('{\n  "Full Name": "name",\n  "Mobile Number": "phone",\n  "E-mail": "email",\n  "Job Profile": "occupation"\n}');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<ImportSummary | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      setSummary(null);
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to import.');
      return;
    }

    setLoading(true);
    setError(null);
    setSummary(null);

    const formData = new FormData();
    formData.append('file', file);

    if (useCustomMapping) {
      try {
        // Validate JSON
        const parsed = JSON.parse(mappingJson);
        formData.append('columnMapping', JSON.stringify(parsed));
      } catch (err) {
        setError('Invalid Custom Column Mapping JSON. Please fix it and submit again.');
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('prospectiq_access_token');
      const response = await fetch('http://localhost:5000/api/v1/customers/import', {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error?.message || 'Import failed');
      }

      if (result.success && result.data) {
        setSummary(result.data);
      }
    } catch (err: any) {
      setError(err.message || 'Import failed. Please verify files formatting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DCE3EA]">
          <button
            onClick={() => navigate('/customers')}
            className="flex items-center space-x-1.5 text-xs font-semibold text-[#5B6572] hover:text-[#00836C] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Directory</span>
          </button>
          <h1 className="text-sm font-bold uppercase tracking-wider text-[#1B1F23]">Customer Data Ingestion</h1>
        </div>

      <div className="space-y-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* UPLOAD FORM PANEL */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Upload Banking File</h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Ingest customer directories from CSV sheet tables or structured JSON arrays. Files are parsed, validated, and mapped directly in memory.
                </p>
              </div>

              <form onSubmit={handleImportSubmit} className="space-y-6">
                {/* File input */}
                <div className="relative border-2 border-dashed border-white/10 hover:border-teal-500/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all bg-slate-950/40">
                  <input
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={loading}
                  />
                  <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/20 mb-3">
                    <Upload className="h-6 w-6 text-teal-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300 block mb-1">
                    {file ? file.name : 'Choose a file or drag it here'}
                  </span>
                  <span className="text-[10px] text-slate-500">Supports .CSV and .JSON up to 5MB</span>
                </div>

                {/* Column mapping toggle */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                      Flexible Mapping Layer
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400">Custom Columns Mapping</span>
                      <input
                        type="checkbox"
                        checked={useCustomMapping}
                        onChange={(e) => setUseCustomMapping(e.target.checked)}
                        className="rounded border-white/10 bg-slate-950 text-teal-500 focus:ring-teal-500/60"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {useCustomMapping ? (
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 block">Mapping JSON (maps external column keys to internal db fields):</span>
                      <textarea
                        rows={6}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs font-mono text-teal-300 focus:outline-none focus:border-teal-500/60 leading-relaxed"
                        value={mappingJson}
                        onChange={(e) => setMappingJson(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  ) : (
                    <div className="flex items-start space-x-2 bg-slate-950/40 border border-white/5 rounded-xl p-3.5 text-xs text-slate-400">
                      <Info className="h-4 w-4 text-teal-400 flex-shrink-0 mt-0.5" />
                      <span>
                        Auto-normalization active. Column headers like <strong>"Customer Name"</strong> or <strong>"Full Name"</strong> will be automatically mapped to internal keys.
                      </span>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-3.5 bg-red-950/30 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 active:scale-[0.98] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-teal-500/10"
                  disabled={loading || !file}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing File...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      <span>Process Data Ingestion</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* DOCUMENTATION PANEL */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Format Guide</h3>
              <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
                <div>
                  <span className="text-white font-bold block mb-1">Required Headers:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-500 text-[11px]">
                    <li><strong className="text-slate-300">name</strong> (Customer Full Name)</li>
                    <li><strong className="text-slate-300">occupation</strong> (Job/Industry)</li>
                  </ul>
                </div>
                <div>
                  <span className="text-white font-bold block mb-1">Optional Headers:</span>
                  <p className="text-[11px] text-slate-500">
                    email, phone, segment (RETAIL/MSME), riskCategory (LOW/MEDIUM/HIGH), status, branchCode, accountNumber, balance.
                  </p>
                </div>
                <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3 text-[11px]">
                  <span className="font-bold text-slate-300 block mb-1">CSV Template Example:</span>
                  <pre className="font-mono text-[9px] text-slate-500 overflow-x-auto whitespace-pre">
                    name,occupation,segment,balance{'\n'}
                    Vijay Dev,Consultant,RETAIL,45000{'\n'}
                    Rohan Sen,Builder,MSME,98000
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INGESTION RESULTS DASHBOARD */}
        {summary && (
          <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Ingestion Log Summary</h3>
              <p className="text-xs text-slate-400 mt-1">Data pipeline parsing completed. Below is the ingestion statistics report.</p>
            </div>

            {/* Counters Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Total Parsed</span>
                <span className="text-xl font-bold text-white mt-1 block">{summary.total}</span>
              </div>
              <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Imported</span>
                  <span className="text-xl font-bold text-emerald-400 mt-1 block">{summary.imported}</span>
                </div>
                <CheckCircle2 className="h-6 w-6 text-emerald-500/60" />
              </div>
              <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Skipped</span>
                <span className="text-xl font-bold text-slate-400 mt-1 block">{summary.skipped}</span>
              </div>
              <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Failed</span>
                  <span className="text-xl font-bold text-red-500 mt-1 block">{summary.failed}</span>
                </div>
                <XCircle className="h-6 w-6 text-red-500/60" />
              </div>
            </div>

            {/* Error log table */}
            {summary.errors.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wide block">Validation Error Logs</span>
                <div className="bg-slate-950/40 border border-white/5 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto max-h-60">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/5 bg-slate-900/60 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                          <th className="py-2.5 px-4 text-center">Row</th>
                          <th className="py-2.5 px-4">Column</th>
                          <th className="py-2.5 px-4">Validation Message</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300">
                        {summary.errors.map((err, idx) => (
                          <tr key={idx} className="hover:bg-red-500/2 transition-colors">
                            <td className="py-2.5 px-4 font-mono text-center text-slate-500">{err.row}</td>
                            <td className="py-2.5 px-4 font-semibold text-slate-400">{err.column || 'General'}</td>
                            <td className="py-2.5 px-4 text-red-400">{err.error}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </Layout>
  );
};
