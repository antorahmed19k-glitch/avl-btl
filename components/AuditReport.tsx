
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Project, User, UserRole } from '../types';
import { GoogleGenAI } from '@google/genai';

interface AuditReportProps {
  project: Project;
  currentUser: User;
  onBack: () => void;
  onEdit?: () => void;
}

const AuditReport: React.FC<AuditReportProps> = ({ project, currentUser, onBack, onEdit }) => {
  const [insight, setInsight] = useState<string>('Analysing project financial health and compliance metrics...');
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const isAdmin = currentUser.role === UserRole.ADMIN;

  const projectStatus = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(project.endDate);
    return endDate < today ? 'Completed' : 'Active';
  }, [project.endDate]);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `As a senior financial auditor for Akij Venture Ltd, provide a professional, structured, and analytical audit summary for this record.
        
        PROJECT CONTEXT:
        Name: ${project.name}
        Current Status: ${projectStatus}
        Timeline: ${project.startDate} to ${project.endDate}
        Settlement Status: ${project.isSettled ? 'FULLY SETTLED (Balance Zeroed)' : 'Pending Settlement'}
        
        FINANCIAL LEDGER:
        Total Budget: ৳${project.budgetAmount}
        Advance Disbursed: ৳${project.advanceAmount}
        Actual Expense: ৳${project.expenseAmount}
        Closing Balance: ৳${project.balanceAmount}
        
        COMPLIANCE METRICS:
        Bill Submission: ${project.billSubmissionDate || 'Pending'}
        SOP/ROI Submission: ${project.sopRoiEmailSubmissionDate || 'Pending'}
        
        REPORT REQUIREMENTS:
        1. Summarise financial performance and budget utilisation efficiency.
        2. Evaluate compliance with corporate submission deadlines.
        3. Highlight any risks associated with the current balance.
        4. Specifically comment on the settlement status (Balance being zero if complete/settled).
        
        Use formal British English and professional auditing terminology.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });
        
        setInsight(response.text || 'Manual verification of financial records required.');
      } catch (err) {
        console.error(err);
        setInsight('AI Automated Summary Service is temporarily unavailable. Please refer to raw ledger data for audit conclusions.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [project, projectStatus]);

  const handlePrintRequest = () => {
    if (!isAdmin) {
      alert("Unauthorized Access: Only Administrative users can print official audit documentation.");
      return;
    }

    if (loading) {
      alert("Please wait for the AI analysis to complete before printing the report.");
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmAndPrint = () => {
    setShowConfirmDialog(false);
    setIsExporting(true);
    
    const originalTitle = document.title;
    const safeProjectName = project.name.replace(/[^a-z0-9]/gi, '_').substring(0, 30);
    const dateStamp = new Date().toISOString().split('T')[0];
    document.title = `AuditReport_${safeProjectName}_${dateStamp}`;
    
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
      setIsExporting(false);
    }, 500);
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-GB', { 
      style: 'currency', 
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'NOT RECORDED';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const reportGenDate = new Date().toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white rounded-3xl shadow-2xl max-w-5xl mx-auto overflow-hidden border border-slate-200 animate-fadeIn print:shadow-none print:border-0 print:rounded-none print:max-w-none print:w-full print:m-0">
      {/* Header */}
      <div className="bg-slate-900 p-8 text-white flex justify-between items-start print:bg-white print:text-slate-900 print:border-b-4 print:border-slate-900 print:px-12 print:pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center print:bg-slate-900 shadow-lg shadow-emerald-500/20 print:shadow-none">
              <i className="fas fa-file-invoice text-2xl print:text-white"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">Official Audit Report</h1>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em] mt-1 print:text-slate-500">Akij Venture Ltd • Corporate Ledger Pro</p>
            </div>
          </div>
        </div>
        <div className="text-right hidden print:block">
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Digital Authentication ID</p>
           <p className="text-xs font-mono font-bold text-slate-900">{project.id.toUpperCase()}</p>
        </div>
        <button 
          onClick={onBack}
          className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all print:hidden"
          title="Back to Project List"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="p-8 md:p-12 space-y-12 print:px-12 print:pt-10">
        <section className="space-y-6 print-no-break">
          <div className="border-b-2 border-slate-100 pb-3 flex justify-between items-end print:border-slate-900">
            <div>
              <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-1">Section 01</h3>
              <h2 className="text-xl font-bold text-slate-900 uppercase">Executive Summary & Metadata</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Project Identification</p>
              <p className="text-base font-bold text-slate-900">{project.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Report Generation Timestamp</p>
              <p className="text-slate-800 font-semibold">{reportGenDate}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Audit Category</p>
              <div className="flex gap-2 items-center">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${projectStatus === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'} print:border print:border-slate-200`}>
                  {projectStatus}
                </span>
                {project.isSettled && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-emerald-600 text-white">Settled</span>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Commencement Date</p>
              <p className="text-slate-800 font-semibold">{formatDate(project.startDate)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Projected/Actual End Date</p>
              <p className="text-slate-800 font-semibold">{formatDate(project.endDate)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bill Submission Deadline</p>
              <p className="text-slate-800 font-semibold">{formatDate(project.billSubmissionDate)}</p>
            </div>
          </div>
        </section>

        <section className="space-y-6 print-no-break">
          <div className="border-b-2 border-slate-100 pb-3 print:border-slate-900">
            <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-1">Section 02</h3>
            <h2 className="text-xl font-bold text-slate-900 uppercase">Financial Ledger Breakdown (BDT)</h2>
          </div>
          <div className="overflow-hidden border border-slate-200 rounded-2xl print:border-slate-900 print:rounded-none">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 print:bg-slate-100">
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 print:border-slate-900">Classification</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 print:border-slate-900 text-right">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 text-sm font-semibold text-slate-700 border-b border-slate-100 print:border-slate-900">Total Project Budget Allocation</td>
                  <td className="p-4 text-sm font-bold text-slate-900 border-b border-slate-100 print:border-slate-900 text-right">{formatCurrency(project.budgetAmount)}</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm font-semibold text-slate-700 border-b border-slate-100 print:border-slate-900">Advance Funds Disbursed</td>
                  <td className="p-4 text-sm font-bold text-blue-700 border-b border-slate-100 print:border-slate-900 text-right">{formatCurrency(project.advanceAmount)}</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm font-semibold text-slate-700 border-b border-slate-100 print:border-slate-900">Actual Net Expenditure Verified</td>
                  <td className="p-4 text-sm font-bold text-red-600 border-b border-slate-100 print:border-slate-900 text-right">{formatCurrency(project.expenseAmount)}</td>
                </tr>
                <tr className="bg-emerald-50/50 print:bg-white">
                  <td className="p-4 text-sm font-black text-emerald-800 uppercase tracking-wide flex items-center gap-2">
                    Final Ledger Balance
                    {project.isSettled && <span className="text-[8px] font-black text-white bg-emerald-600 px-1.5 py-0.5 rounded-sm uppercase">Settled</span>}
                  </td>
                  <td className="p-4 text-lg font-black text-emerald-600 text-right">{formatCurrency(project.balanceAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-6 print-no-break">
          <div className="border-b-2 border-slate-100 pb-3 print:border-slate-900">
            <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-1">Section 03</h3>
            <h2 className="text-xl font-bold text-slate-900 uppercase">AI Auditor Insight & Assessment</h2>
          </div>
          <div className="relative p-8 bg-slate-50 rounded-2xl border-l-4 border-emerald-500 text-slate-800 leading-relaxed shadow-inner print:bg-white print:border-slate-900 print:p-0 print:shadow-none print:border-l-0">
            {loading ? (
              <div className="flex items-center gap-3 p-4">
                <div className="animate-spin h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Generating Insight Summary...</p>
              </div>
            ) : (
              <div className="text-sm font-medium whitespace-pre-wrap prose prose-slate max-w-none print:prose-xs">
                {insight}
              </div>
            )}
          </div>
        </section>

        {/* Documentation Annex Section */}
        {(project.billTopSheetImage || project.budgetCopyAttachment) && (
          <section className="space-y-6 print:break-before-page">
            <div className="border-b-2 border-slate-100 pb-3 print:border-slate-900">
              <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-1">Annex A</h3>
              <h2 className="text-xl font-bold text-slate-900 uppercase">Supporting Documentation</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.billTopSheetImage && (
                <div className="space-y-4">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Document: Verified Bill Top Sheet</p>
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-slate-50 p-2 print:border-slate-900 print:rounded-none">
                    {project.billTopSheetImage.type.startsWith('image/') ? (
                      <img src={project.billTopSheetImage.data} alt="Bill Top Sheet" className="w-full h-auto" />
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-xs italic">
                        Document format ({project.billTopSheetImage.type}) available in digital archive.
                      </div>
                    )}
                  </div>
                </div>
              )}
              {project.budgetCopyAttachment && (
                <div className="space-y-4">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Document: Original Budget Copy</p>
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-slate-50 p-2 print:border-slate-900 print:rounded-none">
                    {project.budgetCopyAttachment.type.startsWith('image/') ? (
                      <img src={project.budgetCopyAttachment.data} alt="Budget Copy" className="w-full h-auto" />
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-xs italic">
                        Document format ({project.budgetCopyAttachment.type}) available in digital archive.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Signature Block - Only for print */}
        <div className="hidden print:block pt-32">
          <div className="grid grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="h-[1px] bg-slate-900"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Senior Auditor</p>
            </div>
            <div className="space-y-4">
              <div className="h-[1px] bg-slate-900"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Head of Department</p>
            </div>
            <div className="space-y-4">
              <div className="h-[1px] bg-slate-900"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Finance Controller</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-slate-100 print:hidden">
          {isAdmin && (
            <button 
              onClick={handlePrintRequest}
              disabled={isExporting || loading}
              className={`flex-1 bg-slate-950 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-4 ${isExporting || loading ? 'opacity-70 cursor-wait' : 'active:scale-[0.98]'}`}
            >
              {isExporting ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                  <span className="uppercase tracking-widest text-sm">Processing...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-print text-emerald-400 text-xl"></i>
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-widest font-black text-emerald-400 leading-none mb-1">Physical/Digital Copy</p>
                    <p className="text-base">Print Audit Report</p>
                  </div>
                </>
              )}
            </button>
          )}
          {isAdmin && onEdit && (
            <button 
              onClick={onEdit}
              className="flex-1 bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-4 active:scale-[0.98]"
            >
              <i className="fas fa-edit text-xl"></i>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest font-black text-emerald-100 leading-none mb-1">Modification</p>
                <p className="text-base">Update Record</p>
              </div>
            </button>
          )}
          <button 
            onClick={onBack}
            className="px-8 py-5 border-2 border-slate-200 font-bold text-slate-600 rounded-2xl hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            Back
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn print:hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-scaleIn">
            <div className="p-8 text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-white shadow-lg">
                <i className="fas fa-print text-3xl"></i>
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Confirm Print Request</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                You are about to generate a physical or digital copy for:<br/>
                <span className="font-black text-slate-950 block mt-2 text-base px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">{project.name}</span>
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">A4 Paper Format • High Fidelity Output</p>
            </div>
            <div className="flex border-t border-slate-100">
              <button 
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-6 py-5 text-sm font-bold text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAndPrint}
                className="flex-1 px-6 py-5 text-sm font-black text-white uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditReport;
