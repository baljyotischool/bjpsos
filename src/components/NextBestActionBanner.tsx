import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { NextActionItem, UserRole } from '../types';

interface NextBestActionBannerProps {
  currentRole: UserRole;
  actions: NextActionItem[];
  onExecuteAction: (action: NextActionItem) => void;
  onRefreshActions?: () => void;
  isRefreshing?: boolean;
  onOpenCopilot?: (prompt: string) => void;
}

export const NextBestActionBanner: React.FC<NextBestActionBannerProps> = ({
  currentRole,
  actions,
  onExecuteAction,
  onRefreshActions,
  isRefreshing = false,
  onOpenCopilot,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Critical' | 'High'>('All');
  const [internalRefreshing, setInternalRefreshing] = useState(false);

  const handleRefresh = () => {
    if (onRefreshActions) {
      onRefreshActions();
    } else {
      setInternalRefreshing(true);
      setTimeout(() => setInternalRefreshing(false), 600);
    }
  };

  const refreshing = isRefreshing || internalRefreshing;

  // Filter actions for this role (or Principal who sees all)
  const roleActions = actions.filter((act) => {
    if (currentRole === 'Principal') return true;
    return act.targetRole.includes(currentRole);
  });

  const filteredActions = roleActions.filter((act) => {
    if (selectedFilter === 'All') return true;
    return act.priority === selectedFilter;
  });

  return (
    <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm mb-6 border-2 border-red-100 relative overflow-hidden">
      {/* Top red accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                AI Next-Best-Action Intelligence Guide
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                Active: {currentRole}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Live priority actions synthesized from Firestore workflows, BigQuery analytics, and Google Workspace signals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Priority filter */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            {(['All', 'Critical', 'High'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                  selectedFilter === filter
                    ? 'bg-red-600 text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 rounded-lg border border-slate-200 transition cursor-pointer disabled:opacity-50"
            title="Re-run Gemini AI prioritization across all 4 modules"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-red-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden xs:inline">AI Refresh</span>
          </button>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
        {filteredActions.length === 0 ? (
          <div className="col-span-full py-8 text-center bg-red-50/50 rounded-xl border border-red-100">
            <CheckCircle2 className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-900">All Priority Actions Cleared!</p>
            <p className="text-xs text-slate-500 mt-1">
              No critical action items pending for {currentRole}. All module workflows in sync.
            </p>
          </div>
        ) : (
          filteredActions.map((action) => {
            const isCritical = action.priority === 'Critical';
            const isCompleted = action.status === 'Completed';

            return (
              <div
                key={action.id}
                className={`relative flex flex-col justify-between p-4 rounded-xl transition duration-200 border ${
                  isCompleted
                    ? 'bg-slate-50 border-slate-200 opacity-70'
                    : isCritical
                    ? 'bg-red-50/50 border-red-300 hover:border-red-500 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-red-300 hover:shadow-2xs'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                      {action.module}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isCritical
                          ? 'bg-red-600 text-white'
                          : action.priority === 'High'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {isCritical && <AlertTriangle className="w-3 h-3" />}
                      {action.priority}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {action.title}
                  </h3>

                  {/* Quantified Impact */}
                  <div className="mt-2.5 p-2.5 bg-red-50/80 rounded-lg border border-red-100 text-[11px] text-slate-700">
                    <span className="font-bold text-red-900">Targeted Impact: </span>
                    {action.impact}
                  </div>

                  {/* Google Ecosystem Tool Pill */}
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-600">
                    <span className="text-slate-500">Integrated Tool:</span>
                    <span className="font-semibold text-red-800 bg-red-50 px-2 py-0.5 rounded text-[10px] border border-red-200">
                      {action.googleTool}
                    </span>
                  </div>
                </div>

                {/* Footer Execution Button */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {isCompleted ? (
                    <span className="flex items-center gap-1.5 text-xs text-red-700 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-red-600" /> Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => onExecuteAction(action)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs transition cursor-pointer active:scale-98"
                    >
                      <Zap className="w-3.5 h-3.5 text-white" />
                      <span>1-Click Execute Action</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
