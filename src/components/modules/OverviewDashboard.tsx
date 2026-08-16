import React from 'react';
import {
  Users,
  GraduationCap,
  Trophy,
  Building2,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronRight,
  Bus,
  CheckCircle2,
  Database,
  Calendar,
} from 'lucide-react';
import {
  AdmissionLead,
  StudentAcademicRecord,
  SchoolActivityEvent,
  AdminFeeRecord,
  BusRouteTracker,
  UserRole,
  MainModule,
} from '../../types';
import { HOUSE_STANDINGS, GOOGLE_WORKSPACE_SERVICES, INITIAL_FEES, INITIAL_BUSES } from '../../data/mockSchoolData';

interface OverviewDashboardProps {
  currentRole: UserRole;
  admissions: AdmissionLead[];
  students: StudentAcademicRecord[];
  activities: SchoolActivityEvent[];
  fees?: AdminFeeRecord[];
  buses?: BusRouteTracker[];
  onNavigate?: (module: MainModule) => void;
  onNavigateTab?: (module: MainModule) => void;
  onOpenCopilot?: () => void;
  onOpenCopilotWithPrompt?: (prompt: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  currentRole,
  admissions,
  students,
  activities,
  fees = INITIAL_FEES,
  buses = INITIAL_BUSES,
  onNavigate,
  onNavigateTab,
  onOpenCopilot,
  onOpenCopilotWithPrompt,
}) => {
  const handleNav = (mod: MainModule) => {
    if (onNavigateTab) onNavigateTab(mod);
    else if (onNavigate) onNavigate(mod);
  };

  const handleCopilot = (prompt?: string) => {
    if (prompt && onOpenCopilotWithPrompt) {
      onOpenCopilotWithPrompt(prompt);
    } else if (onOpenCopilot) {
      onOpenCopilot();
    } else if (onOpenCopilotWithPrompt) {
      onOpenCopilotWithPrompt('');
    }
  };
  // Compute Key Metrics
  const totalStudents = 1840; // Total Baljyoti student body
  const avgAttendance = 94.6;
  const pendingAdmissions = admissions.filter((a) => a.stage !== 'Enrolled').length;
  const atRiskStudentsCount = students.filter((s) => s.atRiskFlag).length;

  const totalFeeCollected = fees.reduce((acc, f) => acc + f.amountPaid, 0);
  const totalFeeDue = fees.reduce((acc, f) => acc + f.amountDue, 0);
  const feeRealizationPct = Math.round((totalFeeCollected / totalFeeDue) * 100);

  const busesOnTime = buses.filter((b) => b.status === 'On Time').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Baljyoti School OS Cockpit
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
              Role: {currentRole}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Integrated operating system powered by Google Cloud & Workspace for Education.
            Orchestrating 3 Verticals (Admission, Academic, Activity) backed by Administration horizontal ERP.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Ask OS Copilot</span>
          </button>
          <button
            onClick={() => handleNav('architecture_blueprint')}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 transition cursor-pointer"
          >
            <span>Chief Architect Blueprint</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-red-600" />
          </button>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Enrolled Strength
            </span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{totalStudents}</div>
            <div className="flex items-center gap-1 text-xs text-red-700 font-medium mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18% Year-over-Year Growth</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Daily Attendance
            </span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{avgAttendance}%</div>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
              <span>Verified across 54 smart classrooms</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Fee Realization (Q2)
            </span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{feeRealizationPct}%</div>
            <div className="flex items-center gap-1 text-xs text-red-800 font-semibold mt-0.5">
              <span>₹1.44L / ₹1.80L Term Collection</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              AI Risk Interventions
            </span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{atRiskStudentsCount} Flagged</div>
            <div className="flex items-center gap-1 text-xs text-red-700 font-medium mt-0.5">
              <span>Remedial decks auto-pushed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Verticals & 1 Horizontal Pulse Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* VERTICAL 1: Admission Pulse */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-red-300 transition">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-600 text-white rounded-xl">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                    Vertical 1
                  </span>
                  <h2 className="text-sm font-bold text-slate-900">Admission Pipeline</h2>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-100">
                {pendingAdmissions} Active Leads
              </span>
            </div>

            {/* Stages Bar */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between font-medium text-slate-600">
                <span>Inquiry → Verification → Exam → Interview → Enrolled</span>
                <span className="font-bold text-slate-900">78% Conv.</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-red-300 w-[20%]" title="Inquiry" />
                <div className="h-full bg-red-400 w-[20%]" title="Verification" />
                <div className="h-full bg-red-500 w-[25%]" title="Exam" />
                <div className="h-full bg-red-600 w-[15%]" title="Interview" />
                <div className="h-full bg-red-700 w-[20%]" title="Enrolled" />
              </div>
            </div>

            {/* Next Lead in Queue */}
            <div className="mt-4 p-3 bg-red-50/50 rounded-xl border border-red-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">
                Top Qualified Candidate
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-bold text-slate-900">
                  {admissions[0]?.applicantName} ({admissions[0]?.gradeApplying})
                </span>
                <span className="text-[11px] font-bold text-red-700 bg-red-100 px-1.5 py-0.2 rounded">
                  Score: {admissions[0]?.entranceScore}%
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                {admissions[0]?.scholarshipTier}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleNav('admission')}
            className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition cursor-pointer"
          >
            <span>Open Admission Vertical</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* VERTICAL 2: Academic Pulse */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-red-300 transition">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-600 text-white rounded-xl">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                    Vertical 2
                  </span>
                  <h2 className="text-sm font-bold text-slate-900">Academic & Pedagogy</h2>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-100">
                Google Classroom Live
              </span>
            </div>

            {/* Pacing Overview */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>CBSE Term 1 Curriculum Pacing</span>
                <span className="font-bold text-red-800">92% On Pacing</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full w-[92%]" />
              </div>
            </div>

            {/* Diagnostic Snapshot */}
            <div className="mt-4 p-3 bg-red-50/50 rounded-xl border border-red-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-red-900 uppercase">
                  BigQuery AI Diagnostic Alert
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-200 text-red-900">
                  {atRiskStudentsCount} Students
                </span>
              </div>
              <p className="text-[11px] text-slate-700 mt-1">
                Borderline performance detected in Grade 10 Physics Kinematics & Linear Algebra.
                Remedial lesson plans ready for 1-click deployment.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleNav('academic')}
            className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition cursor-pointer"
          >
            <span>Open Academic Vertical</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* VERTICAL 3: Activity Pulse */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-red-300 transition">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-600 text-white rounded-xl">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                    Vertical 3
                  </span>
                  <h2 className="text-sm font-bold text-slate-900">Activity & Sports</h2>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-800 border border-red-100">
                4 Houses Active
              </span>
            </div>

            {/* House Leaderboard mini */}
            <div className="mt-4 space-y-1.5">
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                Inter-House Championship Points
              </div>
              <div className="grid grid-cols-2 gap-2">
                {HOUSE_STANDINGS.map((house) => (
                  <div
                    key={house.name}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
                      <span className="text-xs font-bold text-slate-800">{house.name}</span>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900">{house.points}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Major Event */}
            <div className="mt-3 p-2.5 bg-red-50/50 rounded-xl border border-red-100 text-xs">
              <span className="font-bold text-red-900">Next Major Meet: </span>
              <span className="text-slate-800">{activities[0]?.title}</span>
            </div>
          </div>

          <button
            onClick={() => handleNav('activity')}
            className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-red-800 bg-red-50 hover:bg-red-100 rounded-xl transition cursor-pointer"
          >
            <span>Open Activity Vertical</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* HORIZONTAL: Administration Pulse (Span 2 or full) */}
        <div className="md:col-span-2 lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-red-600 text-white rounded-xl">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                  Horizontal Module
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Campus Administration, ERP & Fleet GPS
                </h2>
              </div>
            </div>

            <button
              onClick={() => handleNav('administration')}
              className="flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-800 transition cursor-pointer"
            >
              <span>Manage Administration ERP</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Bus Telemetry */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Bus className="w-4 h-4 text-red-600" />
                  <span>Fleet Live GPS Telemetry</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                  {busesOnTime}/{buses.length} On Time
                </span>
              </div>
              <div className="mt-2 space-y-1.5 text-xs text-slate-600">
                {buses.map((bus) => (
                  <div key={bus.routeNumber} className="flex items-center justify-between py-1 border-b border-slate-200/60 last:border-none">
                    <span className="font-semibold text-slate-800">{bus.routeNumber}</span>
                    <span className="text-slate-500 truncate max-w-[140px]">{bus.currentLocation}</span>
                    <span className="font-mono text-[11px] text-red-700 font-bold">{bus.speedKmH} km/h</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Staff Attendance */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Users className="w-4 h-4 text-red-600" />
                  <span>Faculty & Staff Status</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                  100% Present
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-600 space-y-1">
                <p className="flex justify-between">
                  <span>Smart Classrooms Active:</span>
                  <span className="font-bold text-slate-900">54 / 54</span>
                </p>
                <p className="flex justify-between">
                  <span>Google Accounts Linked:</span>
                  <span className="font-bold text-red-700">100% Verified</span>
                </p>
                <p className="flex justify-between">
                  <span>Substitutions Required:</span>
                  <span className="font-bold text-slate-500">0 today</span>
                </p>
              </div>
            </div>

            {/* Compliance & Safety */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-red-600" />
                  <span>Institutional Compliance</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                  Valid 2026-27
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-600 space-y-1">
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                  <span>CBSE Affiliation Active</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                  <span>Fire & Campus Safety Certified</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                  <span>POCSO & Child Safety Committee</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Cloud & Workspace Architecture Heartbeat */}
      <div className="bg-white text-slate-900 rounded-2xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-50 text-red-600 rounded-xl border border-red-200">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Google Workspace & Cloud Ecosystem Real-Time Bridge
              </h2>
              <p className="text-xs text-slate-500">
                Single-tenant enterprise cloud infrastructure backing Baljyoti Public School
              </p>
            </div>
          </div>

          <button
            onClick={() => handleNav('bigquery_analytics')}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition cursor-pointer"
          >
            <span>Launch BigQuery Data Explorer</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          {GOOGLE_WORKSPACE_SERVICES.map((srv) => (
            <div
              key={srv.service}
              className="p-3 bg-red-50/40 rounded-xl border border-red-100 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="text-[10px] font-mono text-slate-500">{srv.latencyMs}ms</span>
              </div>
              <div className="mt-2">
                <div className="text-xs font-bold text-slate-900 line-clamp-1">{srv.service}</div>
                <div className="text-[10px] text-red-700 font-semibold">{srv.status}</div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">{srv.recordsSyncedToday} syncs/day</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
