import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  BookOpen,
  Bell,
  ChevronDown,
  Layers,
  FileCode2,
  CheckCircle2,
  Cpu,
  GraduationCap,
  LogOut,
  ShieldCheck,
  UserCheck,
  Smartphone,
  KeyRound,
} from 'lucide-react';
import { UserRole, SystemUser, SchoolSettings } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenCopilot: () => void;
  onOpenDoc?: () => void;
  onOpenSearch?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenSettings?: () => void;
  schoolSettings?: SchoolSettings;
  pendingActionsCount?: number;
  currentUser?: SystemUser;
  allUsers?: SystemUser[];
  onSwitchUser?: (user: SystemUser) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenCopilot,
  onOpenDoc,
  onOpenSearch,
  onOpenCommandPalette,
  onOpenSettings,
  schoolSettings,
  pendingActionsCount = 4,
  currentUser,
  allUsers = [],
  onSwitchUser,
  onLogout,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
          ' | ' +
          now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isDirector = currentUser?.role === 'DIRECTOR';

  const schoolName = schoolSettings?.schoolName || 'Baljyoti Public School';
  const logoUrl = schoolSettings?.logoUrl;
  const logoShape = schoolSettings?.logoShape || 'rounded';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-3 sm:px-6 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: School Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div
            className={`relative flex items-center justify-center w-10 h-10 bg-red-600 text-white font-bold text-lg shadow-sm overflow-hidden ${
              logoShape === 'circle'
                ? 'rounded-full'
                : logoShape === 'rounded'
                ? 'rounded-xl'
                : 'rounded-none'
            }`}
          >
            {logoUrl ? (
              <img src={logoUrl} alt={schoolName} className="w-full h-full object-contain p-0.5" />
            ) : (
              <GraduationCap className="w-6 h-6 text-white" />
            )}
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-700 border-2 border-white"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 leading-tight">
                {schoolName}
              </span>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                School OS
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-[11px] font-medium text-red-800 bg-red-50 px-1.5 py-0.2 rounded border border-red-100">
                <CheckCircle2 className="w-3 h-3 text-red-600" />
                Google Workspace & Cloud Sync
              </span>
              <span className="hidden xl:inline text-slate-400">|</span>
              <span className="hidden xl:inline text-slate-500">{timeStr}</span>
            </div>
          </div>
        </div>

        {/* Center: Search & Command Palette */}
        <div className="hidden lg:flex flex-1 max-w-md mx-2">
          <button
            onClick={onOpenCommandPalette || onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-slate-500 bg-slate-100 hover:bg-slate-150 border border-slate-200 rounded-full transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search students, admissions, fee records, lessons...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 bg-white border border-slate-300 rounded shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mobile search trigger */}
          <button
            onClick={onOpenCommandPalette || onOpenSearch}
            aria-label="Search"
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Chief Architect Blueprint Document Button */}
          <button
            onClick={onOpenDoc}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition cursor-pointer"
            title="Open Chief Architect Whitepaper & System Specification"
          >
            <FileCode2 className="w-4 h-4 text-red-600" />
            <span className="hidden sm:inline">Architect Blueprint</span>
          </button>

          {/* AI Copilot Button */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-2xs transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span className="hidden xs:inline">Ask AI Copilot</span>
          </button>

          {/* Authenticated User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 transition cursor-pointer"
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-[11px] ${
                  isSuperAdmin
                    ? 'bg-red-600 text-white'
                    : isDirector
                    ? 'bg-red-100 text-red-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {currentUser ? currentUser.name.charAt(0) : currentRole.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="block font-bold text-xs text-slate-900 leading-tight">
                    {currentUser?.name || currentRole}
                  </span>
                  {isSuperAdmin && (
                    <span className="px-1 py-0.2 rounded text-[9px] font-black uppercase bg-red-600 text-white">
                      Super Admin
                    </span>
                  )}
                  {isDirector && (
                    <span className="px-1 py-0.2 rounded text-[9px] font-bold uppercase bg-red-100 text-red-800">
                      Director
                    </span>
                  )}
                </div>
                <span className="block text-[10px] text-slate-500 leading-none mt-0.5">
                  {currentUser?.email || '@baljyoti.com'}
                </span>
              </div>
              {pendingActionsCount > 0 && (
                <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-600 rounded-full">
                  {pendingActionsCount}
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                {/* User Info Header */}
                <div className="px-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Google SSO Session</span>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      2FA Verified
                    </span>
                  </div>
                  <div className="font-bold text-sm text-slate-900 mt-1">{currentUser?.name}</div>
                  <div className="text-xs text-slate-500">{currentUser?.email}</div>
                  <div className="text-[11px] text-slate-600 mt-1 font-medium">
                    {currentUser?.designation} • {currentUser?.department}
                  </div>
                  <div className="mt-2 p-2 bg-slate-50 rounded-lg text-[10px] text-slate-600 border border-slate-100">
                    <strong className="text-slate-800">Module Access:</strong>{' '}
                    {isSuperAdmin
                      ? 'Universal Access (All 4 Modules + User Management)'
                      : isDirector
                      ? 'All 4 Modules (No User Mgmt)'
                      : currentUser?.allowedModules.filter((m) => m !== 'overview').join(', ') || 'Overview Only'}
                  </div>
                </div>

                {/* Switch Persona / User Selector */}
                {allUsers.length > 0 && (
                  <div className="px-3 pt-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1">
                      Quick Switch Test Persona
                    </p>
                    <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                      {allUsers.map((user) => {
                        const isSelected = currentUser?.id === user.id;
                        return (
                          <button
                            key={user.id}
                            onClick={() => {
                              if (onSwitchUser) onSwitchUser(user);
                              onRoleChange(user.personaRole);
                              setUserMenuOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition cursor-pointer ${
                              isSelected
                                ? 'bg-red-50 text-red-800 font-bold border border-red-200'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  user.role === 'SUPER_ADMIN'
                                    ? 'bg-red-600'
                                    : user.role === 'DIRECTOR'
                                    ? 'bg-red-400'
                                    : 'bg-slate-400'
                                }`}
                              />
                              <span className="truncate">{user.name}</span>
                            </div>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold shrink-0">
                              {user.role}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quick Navigation Links */}
                {onOpenSettings && (
                  <div className="px-3 pt-2 mt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenSettings();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer mb-1.5"
                    >
                      <span>School Settings & Branding</span>
                    </button>
                  </div>
                )}

                {/* Sign Out Button */}
                {onLogout && (
                  <div className={`px-3 ${!onOpenSettings ? 'pt-2 mt-2 border-t border-slate-100' : ''}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span>Sign Out / Lock Session</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
