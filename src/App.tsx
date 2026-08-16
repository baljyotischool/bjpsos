import React, { useState, useEffect } from 'react';
import {
  UserRole,
  ModuleTab,
  AdmissionLead,
  StudentAcademicRecord,
  SchoolActivityEvent,
  NextBestActionItem,
  SystemUser,
  SchoolSettings,
} from './types';
import {
  INITIAL_ADMISSIONS,
  INITIAL_STUDENTS,
  INITIAL_ACTIVITIES,
  INITIAL_NEXT_ACTIONS,
} from './data/mockSchoolData';
import { INITIAL_SYSTEM_USERS } from './data/mockUserData';
import { DEFAULT_SCHOOL_SETTINGS } from './data/mockSettingsData';
import { LoginPage } from './components/auth/LoginPage';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { NextBestActionBanner } from './components/NextBestActionBanner';
import { OverviewDashboard } from './components/modules/OverviewDashboard';
import { AdmissionModule } from './components/modules/AdmissionModule';
import { AcademicModule } from './components/modules/AcademicModule';
import { ActivityModule } from './components/modules/ActivityModule';
import { AdministrationModule } from './components/modules/AdministrationModule';
import { UserManagementModule } from './components/modules/UserManagementModule';
import { SettingsModule } from './components/modules/SettingsModule';
import { BigQueryAnalyticsView } from './components/modules/BigQueryAnalyticsView';
import { ArchitectureDocView } from './components/modules/ArchitectureDocView';
import { CopilotModal } from './components/modals/CopilotModal';
import { ActionExecutionModal } from './components/modals/ActionExecutionModal';
import { CommandPalette } from './components/modals/CommandPalette';
import { Sparkles, ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

export default function App() {
  // System Users List State (Persisted locally in component state)
  const [users, setUsers] = useState<SystemUser[]>(INITIAL_SYSTEM_USERS);

  // School Settings State (Persisted in localStorage)
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() => {
    try {
      const saved = localStorage.getItem('bps_school_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved school settings', e);
    }
    return DEFAULT_SCHOOL_SETTINGS;
  });

  const handleUpdateSettings = (newSettings: SchoolSettings) => {
    setSchoolSettings(newSettings);
    try {
      localStorage.setItem('bps_school_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.warn('Failed to save school settings to localStorage', e);
    }
    setFirestoreSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  // Authenticated Current User State (Starts as null so users see the ERP Login Screen & Gateway)
  const [currentUser, setCurrentUser] = useState<SystemUser | null>(() => {
    const savedUserId = localStorage.getItem('bps_logged_in_user_id');
    if (savedUserId) {
      const found = INITIAL_SYSTEM_USERS.find((u) => u.id === savedUserId);
      if (found) return found;
    }
    // Default to null to display the complete Institutional ERP Login Gateway
    return null;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(
    currentUser ? currentUser.personaRole : 'Principal'
  );
  const [activeTab, setActiveTab] = useState<ModuleTab>('overview');

  // Application Data States (Firestore & BigQuery local sync state)
  const [admissions, setAdmissions] = useState<AdmissionLead[]>(INITIAL_ADMISSIONS);
  const [students, setStudents] = useState<StudentAcademicRecord[]>(INITIAL_STUDENTS);
  const [activities, setActivities] = useState<SchoolActivityEvent[]>(INITIAL_ACTIVITIES);
  const [actions, setActions] = useState<NextBestActionItem[]>(INITIAL_NEXT_ACTIONS);

  // Modals
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotInitialPrompt, setCopilotInitialPrompt] = useState<string>('');
  const [actionToExecute, setActionToExecute] = useState<NextBestActionItem | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [firestoreSyncTime, setFirestoreSyncTime] = useState<string>('Live Reactive');

  // Listen for Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update localStorage when currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bps_logged_in_user_id', currentUser.id);
      setCurrentRole(currentUser.personaRole);
    } else {
      localStorage.removeItem('bps_logged_in_user_id');
    }
  }, [currentUser]);

  // Login handler
  const handleLoginSuccess = (user: SystemUser) => {
    setCurrentUser(user);
    setCurrentRole(user.personaRole);
    // If current tab is not allowed, switch to overview
    if (!user.allowedModules.includes(activeTab) && activeTab !== 'overview') {
      setActiveTab('overview');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bps_logged_in_user_id');
  };

  // Switch user handler
  const handleSwitchUser = (user: SystemUser) => {
    setCurrentUser(user);
    setCurrentRole(user.personaRole);
    if (activeTab === 'user_management' && user.role !== 'SUPER_ADMIN') {
      setActiveTab('overview');
    }
  };

  // User Management State Handlers
  const handleUpdateUser = (updatedUser: SystemUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    setFirestoreSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  const handleAddUser = (newUser: SystemUser) => {
    setUsers((prev) => [newUser, ...prev]);
    setFirestoreSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setFirestoreSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  // Handler for Updating Admission Lead
  const handleUpdateAdmission = (updatedLead: AdmissionLead) => {
    setAdmissions((prev) => prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
    setFirestoreSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  // Handler for Adding New Admission Lead
  const handleAddAdmission = (newLead: AdmissionLead) => {
    setAdmissions((prev) => [newLead, ...prev]);
    setFirestoreSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  // Handler for Updating Student Academic Record
  const handleUpdateStudent = (updatedStudent: StudentAcademicRecord) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    setFirestoreSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  // Handler for Adding Activity
  const handleAddActivity = (newActivity: SchoolActivityEvent) => {
    setActivities((prev) => [newActivity, ...prev]);
    setFirestoreSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  // Open Copilot with a pre-filled prompt
  const handleOpenCopilotWithPrompt = (prompt: string) => {
    setCopilotInitialPrompt(prompt);
    setIsCopilotOpen(true);
  };

  // Handle Action Completion from NextBestAction modal
  const handleActionComplete = (actionId: string) => {
    setActions((prev) =>
      prev.map((act) => (act.id === actionId ? { ...act, priority: 'Low', status: 'Completed' } : act))
    );
    setFirestoreSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  // If user is not authenticated, show the Login Page
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} availableUsers={users} />;
  }

  // RBAC Permission Check for current active tab
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';
  const isDirector = currentUser.role === 'DIRECTOR';

  const isTabPermitted = (tab: ModuleTab): boolean => {
    if (tab === 'overview') return true;
    if (tab === 'user_management') return isSuperAdmin;
    if (tab === 'settings') {
      return (
        isSuperAdmin ||
        isDirector ||
        currentUser.allowedModules.includes('settings') ||
        currentUser.allowedModules.includes('administration')
      );
    }
    if (isSuperAdmin || isDirector) return true;
    if (tab === 'analytics' || tab === 'bigquery_analytics') {
      return currentUser.allowedModules.includes('bigquery_analytics') || currentUser.allowedModules.includes('analytics');
    }
    if (tab === 'blueprint' || tab === 'architecture_blueprint') {
      return true;
    }
    return currentUser.allowedModules.includes(tab);
  };

  const hasAccessToActiveTab = isTabPermitted(activeTab);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800 antialiased font-sans">
      {/* 1. Global Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenCopilot={() => {
          setCopilotInitialPrompt('');
          setIsCopilotOpen(true);
        }}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenSettings={() => setActiveTab('settings')}
        schoolSettings={schoolSettings}
        currentUser={currentUser}
        allUsers={users}
        onSwitchUser={handleSwitchUser}
        onLogout={handleLogout}
      />

      {/* 2. Navigation Tabs (Filtered by RBAC) */}
      <Navigation
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        admissionsCount={admissions.filter((a) => a.stage === 'Inquiry' || a.stage === 'Document Verification').length}
        academicRiskCount={students.filter((s) => s.atRiskFlag).length}
        activitiesCount={activities.length}
      />

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-5">
        {/* Screen-by-Screen App Status & Role Breadcrumb Bar */}
        <div className="bg-white rounded-2xl p-3.5 px-4 sm:px-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider">
              Screen 2
            </span>
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <span className="hover:text-slate-800 cursor-pointer" onClick={() => setActiveTab('overview')}>
                Baljyoti School OS
              </span>
              <span>/</span>
              <span className="font-bold text-red-600 capitalize">
                {activeTab.replace('_', ' ')} Module
              </span>
            </div>

            <span className="hidden md:inline-block text-slate-300">•</span>

            {/* Role indicator badge */}
            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg text-red-800 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              <span>Role: <strong>{currentUser.role}</strong> ({currentUser.personaRole})</span>
            </div>
          </div>

          {/* Quick Persona Switch & Sign Out to Screen 1 */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Logged in: <strong className="text-slate-800">{currentUser.name.split(' ')[0]}</strong>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg text-xs border border-red-200 transition cursor-pointer flex items-center gap-1.5"
              title="Return to Screen 1 Authentication & choose another Demo Role"
            >
              <span>Switch Role / Sign Out</span>
            </button>
          </div>
        </div>

        {/* Next Best Action Intelligence Strip (Shown on non-blueprint tabs) */}
        {activeTab !== 'blueprint' && activeTab !== 'user_management' && (
          <NextBestActionBanner
            currentRole={currentRole}
            actions={actions}
            onExecuteAction={(action) => setActionToExecute(action)}
            onOpenCopilot={handleOpenCopilotWithPrompt}
          />
        )}

        {/* Access Denied Guard if unauthorized */}
        {!hasAccessToActiveTab && (
          <div className="bg-white rounded-2xl p-8 border border-red-200 shadow-sm text-center max-w-xl mx-auto my-12 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Access Restricted by Security Policy</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your account <strong>{currentUser.email}</strong> ({currentUser.role}) does not have permission to access the <strong>{activeTab}</strong> module. Contact the Super Administrator to request permission access.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to OS Overview</span>
            </button>
          </div>
        )}

        {/* Dynamic View Swapper */}
        {hasAccessToActiveTab && (
          <>
            {activeTab === 'overview' && (
              <OverviewDashboard
                currentRole={currentRole}
                admissions={admissions}
                students={students}
                activities={activities}
                onNavigateTab={setActiveTab}
                onOpenCopilotWithPrompt={handleOpenCopilotWithPrompt}
              />
            )}

            {activeTab === 'admission' && (
              <AdmissionModule
                currentRole={currentRole}
                admissions={admissions}
                onUpdateAdmission={handleUpdateAdmission}
                onAddAdmission={handleAddAdmission}
                onOpenCopilotWithPrompt={handleOpenCopilotWithPrompt}
              />
            )}

            {activeTab === 'academic' && (
              <AcademicModule
                currentRole={currentRole}
                students={students}
                onUpdateStudent={handleUpdateStudent}
                onOpenCopilotWithPrompt={handleOpenCopilotWithPrompt}
              />
            )}

            {activeTab === 'activity' && (
              <ActivityModule
                currentRole={currentRole}
                activities={activities}
                onAddActivity={handleAddActivity}
                onOpenCopilotWithPrompt={handleOpenCopilotWithPrompt}
              />
            )}

            {activeTab === 'administration' && (
              <AdministrationModule
                currentRole={currentRole}
                currentUser={currentUser}
                users={users}
                onUpdateUser={handleUpdateUser}
                onAddUser={handleAddUser}
                onDeleteUser={handleDeleteUser}
                onOpenCopilotWithPrompt={handleOpenCopilotWithPrompt}
              />
            )}

            {activeTab === 'user_management' && (
              <AdministrationModule
                currentRole={currentRole}
                currentUser={currentUser}
                users={users}
                onUpdateUser={handleUpdateUser}
                onAddUser={handleAddUser}
                onDeleteUser={handleDeleteUser}
                onOpenCopilotWithPrompt={handleOpenCopilotWithPrompt}
                initialSubTab="user_management"
              />
            )}

            {activeTab === 'settings' && (
              <SettingsModule
                settings={schoolSettings}
                onSaveSettings={handleUpdateSettings}
                currentRole={currentUser.role}
                onOpenCopilot={handleOpenCopilotWithPrompt}
              />
            )}

            {(activeTab === 'analytics' || activeTab === 'bigquery_analytics') && (
              <BigQueryAnalyticsView students={students} />
            )}

            {(activeTab === 'blueprint' || activeTab === 'architecture_blueprint') && (
              <ArchitectureDocView />
            )}
          </>
        )}
      </main>

      {/* 4. Footer */}
      <footer className="no-print border-t border-slate-200 bg-white py-4 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Baljyoti Public School OS</span>
            <span>•</span>
            <span>Google Workspace for Education & Gemini 3.7 Enterprise SSO</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-red-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              Firestore Sync: {firestoreSyncTime}
            </span>
            <button
              onClick={() => setActiveTab('blueprint')}
              className="text-red-600 hover:text-red-800 font-bold underline cursor-pointer"
            >
              Chief Architect Whitepaper
            </button>
          </div>
        </div>
      </footer>

      {/* 5. Floating Gemini Assistant Trigger Button */}
      <div className="no-print fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setCopilotInitialPrompt('');
            setIsCopilotOpen(true);
          }}
          className="flex items-center gap-2.5 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-xs shadow-xl hover:shadow-2xl transition duration-200 cursor-pointer border border-white/20 group"
        >
          <div className="p-1 bg-white/20 rounded-full group-hover:rotate-12 transition">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span>Ask Gemini Copilot</span>
          <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-mono">
            {currentRole.split(' ')[0]}
          </span>
        </button>
      </div>

      {/* 6. Modals & Drawers */}
      <CopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        currentRole={currentRole}
        initialPrompt={copilotInitialPrompt}
      />

      <ActionExecutionModal
        action={actionToExecute}
        currentRole={currentRole}
        onClose={() => setActionToExecute(null)}
        onActionComplete={handleActionComplete}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={setActiveTab}
        onOpenCopilot={handleOpenCopilotWithPrompt}
        currentUser={currentUser}
      />
    </div>
  );
}
