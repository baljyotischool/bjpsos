import React from 'react';
import {
  FileText,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Layers,
  Database,
  ShieldCheck,
  Zap,
  Sparkles,
  Server,
  Building2,
  GraduationCap,
  Trophy,
  Users,
  Cpu,
  ArrowUpRight,
} from 'lucide-react';

export const ArchitectureDocView: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header (no-print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              Chief Architect Whitepaper
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Baljyoti School OS: Technical Blueprint & Architecture
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Authoritative system specification authored from the perspective of a Google Workspace & Cloud Chief Architect.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Whitepaper Document Body */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 text-slate-800 space-y-10 leading-relaxed font-sans">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-widest">
              <span>Google Cloud & Workspace for Education Reference Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
              Baljyoti School OS: Enterprise Architecture Specification
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              AI-Enabled Operating System Guiding Multi-Role Campus Workflows across 3 Verticals & 1 Horizontal ERP
            </p>
          </div>

          <div className="text-left md:text-right text-xs text-slate-500 font-mono space-y-0.5">
            <div><strong>Document ID:</strong> BPS-ARCH-2026-V4</div>
            <div><strong>Classification:</strong> Institutional Master Blueprint</div>
            <div><strong>Author:</strong> Chief Education Architect (Google Cloud)</div>
            <div><strong>Target Entity:</strong> Baljyoti Public School</div>
            <div><strong>Revision Date:</strong> August 15, 2026</div>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            1. Executive Summary & Strategic Vision
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong>Baljyoti Public School</strong> requires an agile, unified, and intelligence-driven Operating System (School OS) to orchestrate all campus administrative, pedagogical, and extracurricular functions. Rather than disjointed legacy software, Baljyoti School OS is engineered natively on the <strong>Google Cloud and Google Workspace for Education</strong> ecosystem.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 text-xs">
              <strong className="text-blue-950 block font-bold mb-1">Unified Google Ecosystem</strong>
              Seamless single-sign-on (SSO), Google Classroom two-way sync, Google Meet virtual admissions, and Drive/Docs institutional record management.
            </div>
            <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-200 text-xs">
              <strong className="text-purple-950 block font-bold mb-1">Predictive Gemini AI Engine</strong>
              Live "Next Best Action" decision guidance, Bloom's Taxonomy lesson plan generation, and intelligent admission lead scoring.
            </div>
            <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs">
              <strong className="text-emerald-950 block font-bold mb-1">Real-Time Firestore & BigQuery</strong>
              Sub-second collaboration across administrative desks backed by a serverless BigQuery data lake for learning diagnostics.
            </div>
          </div>
        </section>

        {/* 3 Verticals & 1 Horizontal Module Architecture */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            2. The 3 Verticals + 1 Horizontal Core Topology
          </h2>
          <p className="text-xs sm:text-sm text-slate-700">
            The school OS decouples domain responsibilities into three distinct functional verticals supported continuously by one horizontal administrative enterprise layer:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Vertical 1 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-blue-800 text-sm">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Vertical 1: Admission & Enrolment Management</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Automated digital lead intake via website Google Forms with instant CRM sync.</li>
                <li>Gemini-powered document verification and entrance diagnostic eligibility scoring.</li>
                <li>1-Click Google Meet Principal interviews and automated Google Docs offer letters.</li>
                <li>Digital onboarding wizard transitioning admitted leads into active student records.</li>
              </ul>
            </div>

            {/* Vertical 2 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-purple-800 text-sm">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <span>Vertical 2: Academic, Pedagogy & Gradebook</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Curriculum pacing aligned with NEP 2020 and CBSE/ICSE benchmark syllabi.</li>
                <li>Gemini Lesson Planner generating Bloom's Taxonomy phases and differentiated tasks.</li>
                <li>SIS gradebook with direct two-way Google Classroom assignments and submissions sync.</li>
                <li>Automated predictive risk modeling flagging borderline students for targeted remedial pods.</li>
              </ul>
            </div>

            {/* Vertical 3 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800 text-sm">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>Vertical 3: Activity, Sports & House System</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Four-House Championship Engine (Agni, Trishul, Akash, Prithvi) with live points tracking.</li>
                <li>Inter-school sports meet, Robotics Hackathon, and Symphonic Gala logistics manager.</li>
                <li>Future skills and student talent tagging registry for national competitions.</li>
                <li>Automated parent circular synthesizer dispatching via Google Workspace email/SMS.</li>
              </ul>
            </div>

            {/* Horizontal ERP */}
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>Horizontal Module: Campus Administration ERP</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-emerald-950">
                <li>Quarterly fee collection realization engine with 1-click UPI and payment gateway reminders.</li>
                <li>Live GPS IoT bus fleet telemetry with real-time parent geofence notifications.</li>
                <li>Faculty and staff attendance tracking with Google Workspace SSO account linkage.</li>
                <li>Statutory compliance vault for CBSE affiliation, fire safety, and POCSO certifications.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Next Best Action Decision Engine */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            3. "Next-Best-Action" AI Guidance Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-700">
            Rather than requiring users to manually search menus, the AI School OS actively evaluates live state across Firestore and BigQuery to prescribe role-tailored execution steps:
          </p>

          <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs space-y-2">
            <div className="text-blue-400 font-bold">// Next-Best-Action Decision Rule Matrix</div>
            <div className="text-slate-400">
              Role: <span className="text-amber-300">Academic Lead / Teacher</span> ➔ Trigger: <span className="text-emerald-300">BigQuery ML detects student score &lt; 65% in STEM</span> ➔ Action: <span className="text-white">Auto-generate 15-min remedial practice deck & push to Google Classroom</span>
            </div>
            <div className="text-slate-400">
              Role: <span className="text-amber-300">Admissions Officer</span> ➔ Trigger: <span className="text-emerald-300">Entrance exam score &gt; 90% logged</span> ➔ Action: <span className="text-white">Auto-schedule Principal Google Meet interview & issue provisional merit dossier</span>
            </div>
            <div className="text-slate-400">
              Role: <span className="text-amber-300">Admin & Finance</span> ➔ Trigger: <span className="text-emerald-300">Term 2 fee deadline T-3 days</span> ➔ Action: <span className="text-white">Dispatch batch WhatsApp/SMS payment links with UPI QR code</span>
            </div>
          </div>
        </section>

        {/* Google Cloud Infrastructure Blueprint */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            4. Google Cloud & Google Workspace System Architecture
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 font-bold text-slate-700 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Component Layer</th>
                  <th className="p-3">Google Technology</th>
                  <th className="p-3">Role in Baljyoti Public School OS</th>
                  <th className="p-3">Performance SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3 font-bold text-slate-900">Application Hosting</td>
                  <td className="p-3 font-mono text-blue-700">Google Cloud Run</td>
                  <td className="p-3">Containerized full-stack Express + React microservices with auto-scaling to zero.</td>
                  <td className="p-3 font-semibold text-emerald-700">99.99% Uptime</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Real-Time Database</td>
                  <td className="p-3 font-mono text-amber-700">Firebase Firestore</td>
                  <td className="p-3">Sub-second reactive sync for bus GPS telemetry, admission pipeline changes, and role feeds.</td>
                  <td className="p-3 font-semibold text-emerald-700">&lt;50ms latency</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Analytical Data Lake</td>
                  <td className="p-3 font-mono text-blue-700">Google BigQuery</td>
                  <td className="p-3">Petabyte-scale educational warehouse correlating attendance, exam masteries, and predictive risk.</td>
                  <td className="p-3 font-semibold text-emerald-700">Sub-second SQL</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Generative AI Core</td>
                  <td className="p-3 font-mono text-purple-700">Gemini 3.7 Flash API</td>
                  <td className="p-3">Lesson plan synthesis, applicant qualification scoring, copilot guidance, and circular drafting.</td>
                  <td className="p-3 font-semibold text-emerald-700">Real-time Stream</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Collaboration & SIS</td>
                  <td className="p-3 font-mono text-emerald-700">Google Workspace SDK</td>
                  <td className="p-3">Classroom coursework sync, Drive document vaults, Meet interview rooms, and Gmail notices.</td>
                  <td className="p-3 font-semibold text-emerald-700">Native SSO</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* BigQuery & Firestore Data Schema */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            5. Institutional Data Schemas (BigQuery & Firestore)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Firestore Schema */}
            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-2">
              <div className="text-amber-400 font-bold">// Firestore Collections Schema</div>
              <pre className="text-[11px] text-emerald-300 leading-tight overflow-x-auto">
{`// 1. Admission Leads
/admissions/{leadId}
  - applicantName: string
  - gradeApplying: string
  - stage: "Inquiry" | "Verification" | "Exam" | "Interview" | "Offer" | "Enrolled"
  - eligibilityIndex: number
  - entranceScore: number

// 2. Academic Records
/students/{studentId}
  - rollNo: string
  - subjects: Array<{name, score, masteryStatus}>
  - atRiskFlag: boolean
  - googleClassroomSyncId: string

// 3. Activity & Houses
/house_standings/{houseId}
  - name: "Agni" | "Trishul" | "Akash" | "Prithvi"
  - points: number`}
              </pre>
            </div>

            {/* BigQuery Schema */}
            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-2">
              <div className="text-blue-400 font-bold">// BigQuery Analytics Table Schema</div>
              <pre className="text-[11px] text-blue-300 leading-tight overflow-x-auto">
{`CREATE TABLE \`baljyoti_dw.academic_performance\` (
  student_id STRING NOT NULL,
  grade_level INT64,
  term_quarter STRING,
  attendance_pct FLOAT64,
  stem_mastery_index FLOAT64,
  classroom_submission_rate FLOAT64,
  predicted_board_score FLOAT64,
  remedial_intervention_flag BOOL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY DATE(timestamp)
CLUSTER BY grade_level, student_id;`}
              </pre>
            </div>
          </div>
        </section>

        {/* Security & Governance */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            6. Role-Based Access Control (RBAC) & Student Data Privacy
          </h2>
          <p className="text-xs sm:text-sm text-slate-700">
            Baljyoti School OS implements zero-trust data governance compliant with India's Digital Personal Data Protection (DPDP) Act, CBSE guidelines, and global FERPA/COPPA educational data isolation standards:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block">Principal</span>
              <span className="text-slate-500 text-[11px]">Full campus governance, financial approvals & board analytics.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block">Academic Leads & Teachers</span>
              <span className="text-slate-500 text-[11px]">Gradebooks, lesson generators & classroom remedial interventions.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block">Admissions & Admin</span>
              <span className="text-slate-500 text-[11px]">Inquiry pipelines, fee realization ERP & bus fleet telemetry.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block">Parents & Students</span>
              <span className="text-slate-500 text-[11px]">Strictly partitioned read access to personal child progress & fees.</span>
            </div>
          </div>
        </section>

        {/* Signoff footer */}
        <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            <span>Verified for Deployment on <strong>Google Cloud Platform & Google Workspace</strong></span>
          </div>
          <div className="font-bold text-slate-900">
            Baljyoti Public School • Operational Architecture Approved
          </div>
        </div>
      </div>
    </div>
  );
};
