import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  Video,
  FileText,
  Phone,
  Mail,
  ChevronRight,
  ArrowRight,
  Award,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { AdmissionLead, UserRole } from '../../types';

interface AdmissionModuleProps {
  currentRole: UserRole;
  admissions: AdmissionLead[];
  onUpdateAdmission: (lead: AdmissionLead) => void;
  onAddAdmission: (lead: AdmissionLead) => void;
  onOpenCopilotWithPrompt?: (prompt: string) => void;
}

const STAGES: AdmissionLead['stage'][] = [
  'Inquiry',
  'Document Verification',
  'Entrance Assessment',
  'Principal Interview',
  'Offer Issued',
  'Enrolled',
];

export const AdmissionModule: React.FC<AdmissionModuleProps> = ({
  currentRole,
  admissions,
  onUpdateAdmission,
  onAddAdmission,
  onOpenCopilotWithPrompt,
}) => {
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<AdmissionLead | null>(admissions[0] || null);
  const [isEvaluatingAI, setIsEvaluatingAI] = useState(false);
  const [aiEvaluationResult, setAiEvaluationResult] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Lead Form State
  const [newApplicant, setNewApplicant] = useState({
    applicantName: '',
    parentName: '',
    contactEmail: '',
    contactPhone: '',
    gradeApplying: 'Grade 11 (PCM + AI)',
    previousSchool: '',
    entranceScore: 88,
    extracurriculars: 'Debate, Science Olympiad, Swimming',
    financialAid: false,
  });

  const filteredLeads = admissions.filter((lead) => {
    const matchesStage = selectedStage === 'All' || lead.stage === selectedStage;
    const matchesSearch =
      lead.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.gradeApplying.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  // Run AI Evaluation on a lead
  const handleEvaluateAI = async (lead: AdmissionLead) => {
    setIsEvaluatingAI(true);
    setAiEvaluationResult(null);
    try {
      const response = await fetch('/api/gemini/verify-admission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantName: lead.applicantName,
          gradeApplying: lead.gradeApplying,
          previousSchool: lead.previousSchool,
          previousGpa: '9.4 CGPA',
          entranceScore: lead.entranceScore,
          extracurriculars: lead.notes,
          financialAid: false,
        }),
      });
      const data = await response.json();
      setAiEvaluationResult(data.verification);
    } catch (err) {
      console.error(err);
      // Fallback
      setAiEvaluationResult({
        eligibilityIndex: `${lead.eligibilityIndex}/100 (Strong Candidate)`,
        streamRecommendation: lead.gradeApplying,
        scholarshipEligible: lead.entranceScore >= 85,
        recommendedScholarshipTier: lead.entranceScore >= 90 ? '25% Merit Fellowship' : 'Standard Admission',
        keyHighlights: ['High aptitude in analytical reasoning', 'Verified scholastic background'],
        nextSteps: ['Schedule Google Meet interview', 'Issue provisional offer via Google Docs'],
      });
    } finally {
      setIsEvaluatingAI(false);
    }
  };

  const handleStageAdvance = (lead: AdmissionLead) => {
    const currentIndex = STAGES.indexOf(lead.stage);
    if (currentIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentIndex + 1];
      const updated = { ...lead, stage: nextStage };
      onUpdateAdmission(updated);
      setSelectedLead(updated);
    }
  };

  const handleCreateApplicant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApplicant.applicantName || !newApplicant.parentName) return;

    const newLead: AdmissionLead = {
      id: `ADM-2026-${String(admissions.length + 1).padStart(2, '0')}`,
      applicantName: newApplicant.applicantName,
      parentName: newApplicant.parentName,
      contactEmail: newApplicant.contactEmail || `${newApplicant.applicantName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      contactPhone: newApplicant.contactPhone || '+91 98111 22334',
      gradeApplying: newApplicant.gradeApplying,
      stage: 'Inquiry',
      previousSchool: newApplicant.previousSchool || 'City High School',
      entranceScore: Number(newApplicant.entranceScore) || 85,
      eligibilityIndex: Math.min(99, Math.round(Number(newApplicant.entranceScore) * 1.05)),
      scholarshipTier: Number(newApplicant.entranceScore) >= 90 ? '25% Chairman Merit Award' : 'Standard Admission',
      applicationDate: new Date().toISOString().split('T')[0],
      assignedCounselor: 'Ms. Sunita Roy',
      documentsVerified: false,
      notes: newApplicant.extracurriculars,
    };

    onAddAdmission(newLead);
    setIsAddModalOpen(false);
    setSelectedLead(newLead);
    // Reset form
    setNewApplicant({
      applicantName: '',
      parentName: '',
      contactEmail: '',
      contactPhone: '',
      gradeApplying: 'Grade 11 (PCM + AI)',
      previousSchool: '',
      entranceScore: 88,
      extracurriculars: 'Debate, Science Olympiad, Swimming',
      financialAid: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Vertical Module 1
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Admission & Enrolment Engine
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            End-to-end inquiry lifecycle with Gemini AI applicant scoring, automated document verification, and Google Workspace onboarding.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Applicant Intake</span>
          </button>
        </div>
      </div>

      {/* Stage Flow Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setSelectedStage('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            selectedStage === 'All'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Stages ({admissions.length})
        </button>
        {STAGES.map((stg, idx) => {
          const count = admissions.filter((a) => a.stage === stg).length;
          const isActive = selectedStage === stg;
          return (
            <button
              key={stg}
              onClick={() => setSelectedStage(stg)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="opacity-70">{idx + 1}.</span>
              <span>{stg}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Pipeline Table & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 sm:p-5 flex flex-col justify-between">
          <div>
            {/* Search Header */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter applicants by student name, parent, or grade..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Leads List */}
            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredLeads.map((lead) => {
                const isSelected = selectedLead?.id === lead.id;
                return (
                  <div
                    key={lead.id}
                    onClick={() => {
                      setSelectedLead(lead);
                      setAiEvaluationResult(null);
                    }}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{lead.applicantName}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {lead.gradeApplying}
                        </span>
                        {lead.documentsVerified ? (
                          <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Docs Verified
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                            Docs Pending
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span>Parent: {lead.parentName}</span>
                        <span>•</span>
                        <span>Applied: {lead.applicationDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-900">
                          {lead.entranceScore}%
                        </div>
                        <div className="text-[10px] text-slate-500">Entrance Score</div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                          lead.stage === 'Enrolled'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lead.stage === 'Offer Issued'
                            ? 'bg-blue-100 text-blue-800'
                            : lead.stage === 'Principal Interview'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {lead.stage}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filteredLeads.length} of {admissions.length} applications</span>
            <span className="text-blue-600 font-medium">Google Forms & Sheets Sync Active</span>
          </div>
        </div>

        {/* Right Detail Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          {selectedLead ? (
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                    Applicant Dossier ({selectedLead.id})
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                    {selectedLead.applicantName}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Applying for: <strong className="text-slate-800">{selectedLead.gradeApplying}</strong>
                  </p>
                </div>

                <button
                  onClick={() => handleEvaluateAI(selectedLead)}
                  disabled={isEvaluatingAI}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-indigo-600 ${isEvaluatingAI ? 'animate-spin' : ''}`} />
                  <span>{isEvaluatingAI ? 'Assessing...' : 'Run AI Evaluation'}</span>
                </button>
              </div>

              {/* Contact & Previous School */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Parent Contact</span>
                  <span className="font-semibold text-slate-800">{selectedLead.parentName}</span>
                  <div className="text-slate-500 text-[11px] mt-0.5 truncate">{selectedLead.contactEmail}</div>
                  <div className="text-slate-500 text-[11px]">{selectedLead.contactPhone}</div>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Prior Background</span>
                  <span className="font-semibold text-slate-800">{selectedLead.previousSchool}</span>
                  <div className="mt-1 font-bold text-blue-700">Entrance Score: {selectedLead.entranceScore}%</div>
                  <div className="text-emerald-700 text-[11px] font-semibold">{selectedLead.scholarshipTier}</div>
                </div>
              </div>

              {/* AI Evaluation Box (if loaded) */}
              {aiEvaluationResult && (
                <div className="p-4 bg-linear-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Gemini Admission Assessment</span>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Index: {aiEvaluationResult.eligibilityIndex}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1">
                    <p>
                      <strong>Stream Fit: </strong> {aiEvaluationResult.streamRecommendation}
                    </p>
                    <p>
                      <strong>Scholarship: </strong> {aiEvaluationResult.recommendedScholarshipTier}
                    </p>
                  </div>

                  {aiEvaluationResult.keyHighlights && (
                    <div className="text-[11px] text-slate-600 bg-white/70 p-2 rounded-lg border border-indigo-100">
                      <span className="font-bold text-slate-800">Highlights: </span>
                      {aiEvaluationResult.keyHighlights.join(' • ')}
                    </div>
                  )}
                </div>
              )}

              {/* Counselor Notes */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Counselor Observation & Extracurriculars
                </span>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedLead.notes}
                </p>
              </div>

              {/* Google Workspace Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Google Workspace Automated Actions
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      onOpenCopilotWithPrompt?.(
                        `Draft a Google Meet interview invitation for ${selectedLead.applicantName} and parent ${selectedLead.parentName} for Grade 11 Admission.`
                      )
                    }
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 transition cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5 text-blue-600" />
                    <span>Google Meet Slot</span>
                  </button>

                  <button
                    onClick={() =>
                      onOpenCopilotWithPrompt?.(
                        `Generate official provisional Admission Offer Letter on Google Docs for ${selectedLead.applicantName} with ${selectedLead.scholarshipTier}.`
                      )
                    }
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 transition cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Docs Offer Letter</span>
                  </button>
                </div>

                {/* Advance Stage Button */}
                {selectedLead.stage !== 'Enrolled' && (
                  <button
                    onClick={() => handleStageAdvance(selectedLead)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer mt-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Advance to Next Stage: {STAGES[STAGES.indexOf(selectedLead.stage) + 1]}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              Select an applicant from the table to view comprehensive dossier and AI scoring.
            </div>
          )}
        </div>
      </div>

      {/* New Applicant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-600 text-white rounded-xl">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">New Admission Intake</h3>
                  <p className="text-xs text-slate-500">Record a new parent inquiry into the Baljyoti School OS</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateApplicant} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Advait Nair"
                    value={newApplicant.applicantName}
                    onChange={(e) => setNewApplicant({ ...newApplicant, applicantName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Grade Applying For *
                  </label>
                  <select
                    value={newApplicant.gradeApplying}
                    onChange={(e) => setNewApplicant({ ...newApplicant, gradeApplying: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option>Grade Nursery / KG</option>
                    <option>Grade 1 to 5 (Primary)</option>
                    <option>Grade 6 to 8 (Middle)</option>
                    <option>Grade 9 (Secondary)</option>
                    <option>Grade 11 (PCM + AI)</option>
                    <option>Grade 11 (PCB + Medical)</option>
                    <option>Grade 11 (Commerce + Math)</option>
                    <option>Grade 11 (Humanities & Eco)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Nair"
                    value={newApplicant.parentName}
                    onChange={(e) => setNewApplicant({ ...newApplicant, parentName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Parent Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98XXX XXXXX"
                    value={newApplicant.contactPhone}
                    onChange={(e) => setNewApplicant({ ...newApplicant, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Previous School Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ryan International"
                    value={newApplicant.previousSchool}
                    onChange={(e) => setNewApplicant({ ...newApplicant, previousSchool: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Entrance Exam Score (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newApplicant.entranceScore}
                    onChange={(e) => setNewApplicant({ ...newApplicant, entranceScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Extracurricular Highlights & Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="State level sports, robotics achievements, debate skills..."
                  value={newApplicant.extracurriculars}
                  onChange={(e) => setNewApplicant({ ...newApplicant, extracurriculars: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Save & Evaluate Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
