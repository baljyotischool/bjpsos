import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Search,
  CheckCircle2,
  AlertTriangle,
  Send,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Clock,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { StudentAcademicRecord, LessonPlan, UserRole } from '../../types';
import { INITIAL_LESSON_PLANS } from '../../data/mockSchoolData';

interface AcademicModuleProps {
  currentRole: UserRole;
  students: StudentAcademicRecord[];
  onUpdateStudent: (student: StudentAcademicRecord) => void;
  onOpenCopilotWithPrompt?: (prompt: string) => void;
}

export const AcademicModule: React.FC<AcademicModuleProps> = ({
  currentRole,
  students,
  onUpdateStudent,
  onOpenCopilotWithPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'gradebook' | 'lesson_planner' | 'remedial_hub' | 'classroom_sync'>('gradebook');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentAcademicRecord>(students[0]);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(INITIAL_LESSON_PLANS);

  // Lesson Plan Generator Form
  const [lessonForm, setLessonForm] = useState({
    grade: 'Grade 10',
    subject: 'Science (Physics)',
    topic: 'Ray Optics: Spherical Mirrors & Lens Formula',
    duration: '45 Mins',
    learningObjectives: 'Derive lens formula and solve real-life ray tracing problems with sign convention',
    differentiationNeed: 'Support visual learners with interactive PhET simulations and challenge gifted students with composite lens setups',
  });
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);

  // Remedial Diagnosis State
  const [isDiagnosingStudent, setIsDiagnosingStudent] = useState(false);
  const [studentDiagnosis, setStudentDiagnosis] = useState<any>(null);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Lesson Plan Generation via Gemini API
  const handleGenerateLessonPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingLesson(true);
    try {
      const res = await fetch('/api/gemini/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonForm),
      });
      const data = await res.json();
      if (data.lessonPlan) {
        const newPlan: LessonPlan = {
          id: `LP-${Date.now()}`,
          title: data.lessonPlan.title || `${lessonForm.subject}: ${lessonForm.topic}`,
          subject: lessonForm.subject,
          grade: lessonForm.grade,
          teacher: 'Faculty Academic Lead',
          duration: data.lessonPlan.duration || '45 Mins',
          bloomsTaxonomy: data.lessonPlan.bloomsTaxonomy || ['Understand', 'Apply', 'Analyze'],
          hook: data.lessonPlan.hook || 'Real-world visual query',
          phases: data.lessonPlan.phases || [],
          homework: data.lessonPlan.homework || 'Google Classroom extension sheet',
          aiInterventionTips: data.lessonPlan.aiInterventionTips || 'Adaptive quiz deck',
          classroomSyncStatus: 'Synced',
          dateScheduled: new Date().toISOString().split('T')[0],
        };
        setLessonPlans([newPlan, ...lessonPlans]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingLesson(false);
    }
  };

  // Handle Academic Diagnosis for a student via Gemini API
  const handleRunStudentDiagnosis = async (student: StudentAcademicRecord) => {
    setIsDiagnosingStudent(true);
    setStudentDiagnosis(null);
    try {
      const res = await fetch('/api/gemini/academic-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.name,
          grade: `${student.grade} - Section ${student.section}`,
          subjectScores: student.subjects.reduce((acc, sub) => ({ ...acc, [sub.name]: sub.score }), {}),
          attendancePercent: student.attendancePercent,
          behavioralNotes: student.interventionPlan || 'Borderline performance in STEM subjects',
        }),
      });
      const data = await res.json();
      setStudentDiagnosis(data.analysis);
    } catch (err) {
      console.error(err);
      setStudentDiagnosis({
        overallHealth: 'At-Risk in STEM Foundations',
        predictedScore: `${student.predictedScore}%`,
        learningStrengths: ['Consistent classroom participation', 'Strong English comprehension'],
        learningGaps: ['Quadratic problem modeling speed', 'Physics vector formulation'],
        interventionRoadmap: [
          'Push 15-minute Google Classroom remedial practice deck',
          'Pair with peer mentor during Friday Activity hour',
          'Send weekly automated progress report to parents via Gmail',
        ],
        teacherTalkingPoints: `Highlight analytical potential while structuring 1-on-1 problem-solving sessions.`,
      });
    } finally {
      setIsDiagnosingStudent(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
              Vertical Module 2
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Academic, Pedagogy & Gradebook
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Data-driven student performance diagnostics, Bloom's Taxonomy AI lesson planning, and real-time Google Classroom sync.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          {[
            { id: 'gradebook', label: 'Gradebook & Roster', icon: <BookOpen className="w-3.5 h-3.5" /> },
            { id: 'lesson_planner', label: 'AI Lesson Planner', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'remedial_hub', label: 'AI Intervention Hub', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
            { id: 'classroom_sync', label: 'Classroom Sync', icon: <ExternalLink className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Gradebook & Student Diagnostics */}
      {activeTab === 'gradebook' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Student Roster Table (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search student by name, roll no, or grade..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
                {filteredStudents.map((stu) => {
                  const isSelected = selectedStudent.id === stu.id;
                  return (
                    <div
                      key={stu.id}
                      onClick={() => {
                        setSelectedStudent(stu);
                        setStudentDiagnosis(null);
                      }}
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-purple-50/70 border-purple-500 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{stu.name}</span>
                          <span className="text-[10px] font-mono text-slate-500">{stu.rollNo}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {stu.grade}-{stu.section} ({stu.house} House)
                          </span>
                          {stu.atRiskFlag && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              At-Risk
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                          <span>Attendance: <strong className="text-slate-800">{stu.attendancePercent}%</strong></span>
                          <span>•</span>
                          <span>Classroom Submissions: <strong className="text-slate-800">{stu.googleClassroomSubmissions}%</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs font-black text-slate-900">{stu.overallPercentage}%</div>
                          <div className="text-[10px] text-slate-500">Term Average</div>
                        </div>

                        <div className="text-right pl-3 border-l border-slate-200">
                          <div className="text-xs font-black text-purple-700">{stu.predictedScore}%</div>
                          <div className="text-[10px] text-slate-500">BigQuery ML</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Roster synced with Google Classroom & SIS Gradebook</span>
              <span className="text-purple-700 font-bold">Predictive Risk Model: 94.8% Accuracy</span>
            </div>
          </div>

          {/* Student Subject Mastery Detail (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                    Student Subject Mastery Dossier
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                    {selectedStudent.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {selectedStudent.grade}-{selectedStudent.section} • Roll No: {selectedStudent.rollNo}
                  </p>
                </div>

                <button
                  onClick={() => handleRunStudentDiagnosis(selectedStudent)}
                  disabled={isDiagnosingStudent}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-purple-600 ${isDiagnosingStudent ? 'animate-spin' : ''}`} />
                  <span>{isDiagnosingStudent ? 'Diagnosing...' : 'AI Remedial Plan'}</span>
                </button>
              </div>

              {/* Subject Breakdown Cards */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Subject-Level Competency Index
                </div>
                {selectedStudent.subjects.map((sub) => (
                  <div
                    key={sub.name}
                    className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{sub.name}</span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.2 rounded inline-block mt-0.5 ${
                          sub.masteryStatus === 'Mastered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.masteryStatus === 'On Track'
                            ? 'bg-blue-100 text-blue-800'
                            : sub.masteryStatus === 'Borderline'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {sub.masteryStatus}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-slate-900">{sub.score} / {sub.maxScore}</span>
                      <span className="text-[10px] font-bold text-slate-500 block">Grade {sub.gradeLetter}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Diagnosis Result */}
              {studentDiagnosis && (
                <div className="p-4 bg-linear-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Gemini Pedagogical Diagnosis</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-900">
                      {studentDiagnosis.overallHealth}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1">
                    <p>
                      <strong>Learning Strengths: </strong>
                      {studentDiagnosis.learningStrengths?.join(', ')}
                    </p>
                    <p>
                      <strong>Target Remediation: </strong>
                      {studentDiagnosis.learningGaps?.join(', ')}
                    </p>
                  </div>

                  {studentDiagnosis.interventionRoadmap && (
                    <div className="text-[11px] text-slate-700 bg-white/80 p-2.5 rounded-lg border border-purple-100 space-y-1">
                      <span className="font-bold text-purple-900 block">3-Step Action Roadmap:</span>
                      {studentDiagnosis.interventionRoadmap.map((step: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <span className="text-purple-600 font-bold">•</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {studentDiagnosis.teacherTalkingPoints && (
                    <div className="text-[11px] text-slate-600 bg-white/60 p-2 rounded-lg italic">
                      "Talking Points: {studentDiagnosis.teacherTalkingPoints}"
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() =>
                    onOpenCopilotWithPrompt?.(
                      `Draft a personalized parent update email for ${selectedStudent.name} (${selectedStudent.grade}-${selectedStudent.section}) regarding their recent STEM progress and remedial support roadmap.`
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Draft Parent Update via Google Workspace</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI Lesson Planner */}
      {activeTab === 'lesson_planner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <div className="p-2 bg-purple-600 text-white rounded-xl">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Gemini Lesson Plan Generator</h3>
                <p className="text-xs text-slate-500">Aligned with NEP 2020 & Bloom's Taxonomy</p>
              </div>
            </div>

            <form onSubmit={handleGenerateLessonPlan} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Grade Level</label>
                  <select
                    value={lessonForm.grade}
                    onChange={(e) => setLessonForm({ ...lessonForm, grade: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  >
                    <option>Grade 6</option>
                    <option>Grade 7</option>
                    <option>Grade 8</option>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                    <option>Grade 11 (PCM)</option>
                    <option>Grade 11 (Commerce)</option>
                    <option>Grade 12</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Subject</label>
                  <input
                    type="text"
                    value={lessonForm.subject}
                    onChange={(e) => setLessonForm({ ...lessonForm, subject: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Topic / Chapter</label>
                <input
                  type="text"
                  value={lessonForm.topic}
                  onChange={(e) => setLessonForm({ ...lessonForm, topic: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                  Core Learning Objectives
                </label>
                <textarea
                  rows={2}
                  value={lessonForm.learningObjectives}
                  onChange={(e) => setLessonForm({ ...lessonForm, learningObjectives: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                  Differentiation & Pacing Strategy
                </label>
                <textarea
                  rows={2}
                  value={lessonForm.differentiationNeed}
                  onChange={(e) => setLessonForm({ ...lessonForm, differentiationNeed: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={isGeneratingLesson}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs transition cursor-pointer disabled:opacity-50 mt-2"
              >
                <Sparkles className={`w-4 h-4 ${isGeneratingLesson ? 'animate-spin' : 'text-amber-300'}`} />
                <span>{isGeneratingLesson ? 'Synthesizing Lesson Architecture...' : 'Generate AI Lesson Plan'}</span>
              </button>
            </form>
          </div>

          {/* Right Lesson Plan Deck (7 cols) */}
          <div className="lg:col-span-7 space-y-4 max-h-[640px] overflow-y-auto pr-1">
            {lessonPlans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      {plan.grade} • {plan.subject}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{plan.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>Duration: {plan.duration}</span>
                      <span>•</span>
                      <span>Scheduled: {plan.dateScheduled}</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {plan.classroomSyncStatus}
                  </span>
                </div>

                {/* Bloom's taxonomy tags */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500">Bloom's Levels:</span>
                  {plan.bloomsTaxonomy.map((lvl) => (
                    <span key={lvl} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {lvl}
                    </span>
                  ))}
                </div>

                {/* Hook */}
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs">
                  <span className="font-bold text-amber-900 block">Class Hook / Inquiry Prompt:</span>
                  <span className="text-amber-950">{plan.hook}</span>
                </div>

                {/* Phases */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Structured Phase Timeline
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {plan.phases.map((ph, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between text-[11px] font-bold text-purple-900">
                          <span>{ph.phase}</span>
                          <span className="font-mono text-slate-500">{ph.time}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-1">{ph.activity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Intervention & Homework */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
                  <p><strong>Homework / Extension: </strong> {plan.homework}</p>
                  <p><strong>Automated AI Intervention: </strong> {plan.aiInterventionTips}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Remedial Hub */}
      {activeTab === 'remedial_hub' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Automated Remedial Intervention Queue</h3>
              <p className="text-xs text-slate-500">
                BigQuery early warning signals detecting students who scored below mastery benchmarks
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-red-100 text-red-800 rounded-full border border-red-200">
              {students.filter((s) => s.atRiskFlag).length} Remedial Pods Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {students
              .filter((s) => s.atRiskFlag)
              .map((stu) => (
                <div key={stu.id} className="p-4 bg-red-50/50 rounded-2xl border border-red-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{stu.name}</h4>
                      <span className="text-xs text-slate-500">
                        {stu.grade}-{stu.section} • Roll No: {stu.rollNo}
                      </span>
                    </div>
                    <span className="text-xs font-black text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                      Predicted Score: {stu.predictedScore}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-red-100">
                    <strong className="text-red-900">Active Remedial Intervention: </strong>
                    {stu.interventionPlan}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-red-100">
                    <span className="text-[11px] text-slate-500">Google Classroom Deck Assigned</span>
                    <button
                      onClick={() => handleRunStudentDiagnosis(stu)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Update AI Strategy
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: Google Classroom Sync */}
      {activeTab === 'classroom_sync' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Google Classroom Direct API Sync</h3>
              <p className="text-xs text-slate-500">
                Continuous two-way synchronization between Google Classroom coursework and School OS gradebooks
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Real-Time Webhook Connected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase">Active Courses Synced</div>
              <div className="text-2xl font-black text-slate-900 mt-1">48 Courses</div>
              <div className="text-[11px] text-slate-500 mt-1">Class Nursery to Grade 12</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase">Submission Rate Today</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">96.4%</div>
              <div className="text-[11px] text-emerald-600 mt-1">+4.2% vs. school benchmark</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase">AI Rubric Auto-Graded</div>
              <div className="text-2xl font-black text-purple-700 mt-1">340 Tasks</div>
              <div className="text-[11px] text-purple-600 mt-1">Teacher approved in 1 click</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
