import React, { useState, useEffect } from 'react';
import {
  Search,
  Users,
  GraduationCap,
  Trophy,
  Building2,
  Database,
  FileText,
  Sparkles,
  ArrowRight,
  Bus,
  DollarSign,
  X,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { UserRole, SystemUser } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
  onOpenCopilot: (prompt?: string) => void;
  currentUser?: SystemUser;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenCopilot,
  currentUser,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const COMMANDS = [
    {
      id: 'tab-admission',
      title: 'Go to Admission Module',
      category: 'Navigation',
      icon: <Users className="w-4 h-4 text-red-600" />,
      action: () => {
        onNavigateTab('admission');
        onClose();
      },
    },
    {
      id: 'tab-academic',
      title: 'Go to Academic & Pedagogy Module',
      category: 'Navigation',
      icon: <GraduationCap className="w-4 h-4 text-red-600" />,
      action: () => {
        onNavigateTab('academic');
        onClose();
      },
    },
    {
      id: 'tab-activity',
      title: 'Go to Activity & House Sports Module',
      category: 'Navigation',
      icon: <Trophy className="w-4 h-4 text-red-600" />,
      action: () => {
        onNavigateTab('activity');
        onClose();
      },
    },
    {
      id: 'tab-admin',
      title: 'Go to Campus Administration & Finance ERP',
      category: 'Navigation',
      icon: <Building2 className="w-4 h-4 text-red-600" />,
      action: () => {
        onNavigateTab('administration');
        onClose();
      },
    },
    {
      id: 'tab-settings',
      title: 'Open School Settings (Logo, Colors, Address & Website)',
      category: 'Settings & Branding',
      icon: <Settings className="w-4 h-4 text-red-600" />,
      action: () => {
        onNavigateTab('settings');
        onClose();
      },
    },
    ...(currentUser?.role === 'SUPER_ADMIN'
      ? [
          {
            id: 'tab-user-mgmt',
            title: 'Go to Super Admin User Management & RBAC',
            category: 'Governance',
            icon: <ShieldCheck className="w-4 h-4 text-red-600" />,
            action: () => {
              onNavigateTab('user_management');
              onClose();
            },
          },
        ]
      : []),
    {
      id: 'tab-bigquery',
      title: 'Open BigQuery Student Performance Data Lake',
      category: 'Analytics',
      icon: <Database className="w-4 h-4 text-red-600" />,
      action: () => {
        onNavigateTab('analytics');
        onClose();
      },
    },
    {
      id: 'tab-doc',
      title: 'View Chief Architect System Whitepaper',
      category: 'Documentation',
      icon: <FileText className="w-4 h-4 text-red-600" />,
      action: () => {
        onNavigateTab('blueprint');
        onClose();
      },
    },
    {
      id: 'ai-lesson',
      title: 'Gemini: Generate Grade 10 Science Lesson Plan',
      category: 'AI Copilot Action',
      icon: <Sparkles className="w-4 h-4 text-red-600" />,
      action: () => {
        onClose();
        onOpenCopilot('Generate an NEP 2020 aligned Lesson Plan for Grade 10 Science on Ray Optics with Bloom Taxonomy tasks.');
      },
    },
    {
      id: 'ai-fee',
      title: 'Gemini: Draft Fee Reminder Circular for Overdue Accounts',
      category: 'AI Copilot Action',
      icon: <DollarSign className="w-4 h-4 text-red-600" />,
      action: () => {
        onClose();
        onOpenCopilot('Draft a polite automated fee reminder notification with UPI payment links for overdue parents.');
      },
    },
  ];

  const filtered = COMMANDS.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, module, or ask Gemini Copilot... (Press ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 text-xs">
          {filtered.length > 0 ? (
            filtered.map((cmd) => (
              <div
                key={cmd.id}
                onClick={cmd.action}
                className="p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg group-hover:bg-white transition">
                    {cmd.icon}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{cmd.title}</div>
                    <div className="text-[10px] text-slate-500">{cmd.category}</div>
                  </div>
                </div>

                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition" />
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching commands. Ask Gemini directly in Copilot.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
          <span>Navigate: <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-mono">↓</kbd></span>
          <span>Open: <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-mono">Enter</kbd></span>
          <span>Baljyoti OS Command System</span>
        </div>
      </div>
    </div>
  );
};
