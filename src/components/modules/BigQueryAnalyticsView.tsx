import React, { useState } from 'react';
import {
  Database,
  Terminal,
  Play,
  Download,
  Share2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Layers,
  Table,
} from 'lucide-react';
import { StudentAcademicRecord } from '../../types';

interface BigQueryAnalyticsViewProps {
  students: StudentAcademicRecord[];
}

const PRESET_QUERIES = [
  {
    id: 'q1',
    name: 'At-Risk Predictive Model (<65% Mastery)',
    sql: `SELECT student_id, name, grade, attendance_rate, predicted_score,
       ARRAY_AGG(STRUCT(subject_name, score)) AS borderline_subjects
FROM \`baljyoti_dw.student_performance_2026\`
WHERE predicted_score < 70 OR attendance_rate < 85
GROUP BY 1, 2, 3, 4, 5
ORDER BY predicted_score ASC;`,
  },
  {
    id: 'q2',
    name: 'Classroom Submission vs. STEM Mastery Correlation',
    sql: `SELECT CORR(classroom_submission_rate, stem_composite_score) as correlation_coeff,
       AVG(stem_composite_score) as avg_stem_score,
       grade
FROM \`baljyoti_dw.academic_telemetry_stream\`
GROUP BY grade
ORDER BY grade ASC;`,
  },
  {
    id: 'q3',
    name: 'Inter-House Co-Curricular & Academic Composite',
    sql: `SELECT house_name,
       COUNT(DISTINCT student_id) as student_count,
       AVG(academic_gpa) as avg_academic_gpa,
       SUM(activity_points) as total_house_points
FROM \`baljyoti_dw.holistic_house_standings\`
GROUP BY house_name
ORDER BY total_house_points DESC;`,
  },
];

export const BigQueryAnalyticsView: React.FC<BigQueryAnalyticsViewProps> = ({ students }) => {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_QUERIES[0]);
  const [customSql, setCustomSql] = useState(PRESET_QUERIES[0].sql);
  const [queryRunning, setQueryRunning] = useState(false);
  const [queryExecutionTimeMs, setQueryExecutionTimeMs] = useState(84);
  const [bytesProcessed, setBytesProcessed] = useState('14.2 MB');

  const handleRunQuery = () => {
    setQueryRunning(true);
    setTimeout(() => {
      setQueryRunning(false);
      setQueryExecutionTimeMs(Math.floor(Math.random() * 40) + 60);
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Google BigQuery & Looker Engine
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Student Learning Analytics Data Lake
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Serverless enterprise analytical warehouse powering predictive risk intervention, cohort trajectories, and institutional reporting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting dataset snapshot to connected Google Sheet & Looker Studio dashboard...')}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Open in Looker Studio</span>
          </button>
        </div>
      </div>

      {/* BigQuery Console Simulator */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 text-slate-200 p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                BigQuery SQL Editor • Project: <code className="text-blue-400">baljyoti-school-os-prod</code>
              </span>
              <span className="text-[10px] text-slate-400">Dataset: baljyoti_dw</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {PRESET_QUERIES.map((q) => (
              <button
                key={q.id}
                onClick={() => {
                  setSelectedPreset(q);
                  setCustomSql(q.sql);
                }}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition cursor-pointer whitespace-nowrap ${
                  selectedPreset.id === q.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {q.name}
              </button>
            ))}
          </div>
        </div>

        {/* SQL Code Box */}
        <div className="relative">
          <textarea
            rows={5}
            value={customSql}
            onChange={(e) => setCustomSql(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-blue-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Run Bar */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono">
            <span>Bytes processed: <strong className="text-slate-200">{bytesProcessed}</strong></span>
            <span>•</span>
            <span>Elapsed: <strong className="text-emerald-400">{queryExecutionTimeMs}ms</strong></span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Valid SQL Syntax
            </span>
          </div>

          <button
            onClick={handleRunQuery}
            disabled={queryRunning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${queryRunning ? 'animate-spin' : ''}`} />
            <span>{queryRunning ? 'Executing SQL...' : 'Run Query'}</span>
          </button>
        </div>

        {/* Query Results Table */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span>Query Results (6 Records Returned)</span>
            <span className="font-mono text-slate-500 text-[10px]">Tier 1 Cache: Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 px-3">student_id</th>
                  <th className="py-2 px-3">student_name</th>
                  <th className="py-2 px-3">grade_section</th>
                  <th className="py-2 px-3">attendance_pct</th>
                  <th className="py-2 px-3">term_gpa</th>
                  <th className="py-2 px-3">predicted_gpa</th>
                  <th className="py-2 px-3">risk_classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-900/60">
                    <td className="py-2.5 px-3 text-blue-400">{s.id}</td>
                    <td className="py-2.5 px-3 font-sans font-bold text-white">{s.name}</td>
                    <td className="py-2.5 px-3">{s.grade}-{s.section}</td>
                    <td className="py-2.5 px-3">{s.attendancePercent}%</td>
                    <td className="py-2.5 px-3">{s.overallPercentage}%</td>
                    <td className="py-2.5 px-3 font-bold text-purple-400">{s.predictedScore}%</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          s.atRiskFlag
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {s.atRiskFlag ? 'HIGH_RISK_INTERVENTION' : 'ON_TRACK'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Analytical Insights Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">STEM Mastery Velocity</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">+11.4%</div>
          <p className="text-xs text-slate-600">
            Grade 10 Mathematics & Physics cohorts demonstrated accelerated comprehension following AI-differentiated practice sheets.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Attendance Sensitivity</span>
            <BarChart3 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">r = 0.88</div>
          <p className="text-xs text-slate-600">
            Strong positive correlation between &gt;92% school attendance and final Term 1 exam distinctions across all 4 houses.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Early Risk Detection</span>
            <AlertTriangle className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700">94.8% Acc.</div>
          <p className="text-xs text-slate-600">
            BigQuery ML algorithms identified 100% of borderline students 3 weeks ahead of mid-term examinations for timely remedial support.
          </p>
        </div>
      </div>
    </div>
  );
};
