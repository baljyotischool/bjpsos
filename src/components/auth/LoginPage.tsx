import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  KeyRound,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Building2,
  Users,
  Trophy,
  DollarSign,
  Smartphone,
  Info,
  ChevronRight,
  ExternalLink,
  Zap,
  Copy,
  Check,
  Shield,
  Layers,
  FileSpreadsheet,
  Bus,
  Award,
  BookOpen,
  UserCheck,
  Calendar,
  Compass,
  ArrowUpRight,
  Database,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { SystemUser } from '../../types';
import { GoogleOAuthModal } from './GoogleOAuthModal';

interface LoginPageProps {
  onLoginSuccess: (user: SystemUser) => void;
  availableUsers: SystemUser[];
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, availableUsers }) => {
  const [email, setEmail] = useState('superadmin@baljyoti.com');
  const [password, setPassword] = useState('BPS#Admin2026!');
  const [totpCode, setTotpCode] = useState('582914');
  const [activeTab, setActiveTab] = useState<'erp_portals' | 'credentials' | 'google_sso' | 'workflow_guide'>('erp_portals');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2026-2027 (Term 1)');
  const [selectedCampus, setSelectedCampus] = useState('Main Campus (Sector 4)');

  // Selected quick demo profile
  const [selectedUser, setSelectedUser] = useState<SystemUser>(
    availableUsers.find((u) => u.email === 'superadmin@baljyoti.com') || availableUsers[0]
  );

  const handleSelectAndFillUser = (user: SystemUser) => {
    setSelectedUser(user);
    setEmail(user.email);
    setPassword(user.demoPassword || 'BPS#Admin2026!');
    setTotpCode('582914');
    setActiveTab('credentials');
    setSuccessMessage(`Loaded credentials for ${user.name} (${user.role}). Click Sign In to enter ERP.`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleQuickLaunch = (user: SystemUser) => {
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(user);
    }, 350);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      let cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail.includes('@')) {
        cleanEmail = `${cleanEmail}@baljyoti.com`;
      }

      if (!cleanEmail.endsWith('@baljyoti.com')) {
        setErrorMessage('Access restricted to verified institutional @baljyoti.com Google Workspace accounts.');
        return;
      }

      const foundUser = availableUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (foundUser) {
        if (foundUser.status === 'Suspended') {
          setErrorMessage('This account has been suspended by the Super Administrator. Contact IT helpdesk.');
          return;
        }
        onLoginSuccess(foundUser);
      } else {
        // Dynamic fallback creation for typed demo accounts
        const isSuper = cleanEmail.includes('admin') || cleanEmail.includes('info');
        const newUser: SystemUser = {
          id: `USR-${Date.now()}`,
          employeeId: `BPS-NEW-${Math.floor(100 + Math.random() * 900)}`,
          name: cleanEmail.split('@')[0].toUpperCase(),
          email: cleanEmail,
          role: isSuper ? 'SUPER_ADMIN' : cleanEmail.includes('director') ? 'DIRECTOR' : 'TEACHER',
          personaRole: isSuper || cleanEmail.includes('director') ? 'Principal' : 'Teacher',
          designation: isSuper ? 'Executive Administrator' : 'Faculty Member',
          department: isSuper ? 'Institutional Governance' : 'Academic Pedagogy',
          status: 'Active',
          mfaEnabled: true,
          demoPassword: password || 'BPS#Demo2026!',
          lastLogin: 'Just now',
          allowedModules: isSuper
            ? ['overview', 'admission', 'academic', 'activity', 'administration', 'user_management', 'settings', 'bigquery_analytics', 'architecture_blueprint']
            : ['overview', 'academic'],
          allowedSubmodules: [],
        };
        onLoginSuccess(newUser);
      }
    }, 450);
  };

  // Group users into distinct ERP departmental portals
  const erpPortals = [
    {
      id: 'executive',
      title: 'Executive Governance & Admin ERP',
      subtitle: 'Board of Directors, Principal & Super Administrators',
      user: availableUsers.find((u) => u.role === 'SUPER_ADMIN') || availableUsers[0],
      icon: Building2,
      badge: 'Full ERP Control',
      badgeColor: 'bg-red-600 text-white',
      modules: ['Admission', 'Academic', 'Activity', 'Finance & Admin', 'RBAC & Settings', 'BigQuery Lake'],
      color: 'border-red-200 bg-gradient-to-br from-red-50/50 to-white hover:border-red-500',
    },
    {
      id: 'admissions',
      title: 'Admissions & Registrars CRM',
      subtitle: 'Inquiry Pipeline, Entrance Diagnostics & Token Grants',
      user: availableUsers.find((u) => u.email === 'admissions@baljyoti.com') || availableUsers[3],
      icon: Users,
      badge: 'Admissions Desk',
      badgeColor: 'bg-blue-600 text-white',
      modules: ['Inquiry CRM', 'Aptitude Diagnostic', 'Dossier Verification', 'Fee Tokens'],
      color: 'border-blue-200 bg-gradient-to-br from-blue-50/50 to-white hover:border-blue-500',
    },
    {
      id: 'academic',
      title: 'Academic, Pedagogy & Grading ERP',
      subtitle: 'CBSE Gradebooks, NEP 2020 AI Lesson Plans & Remedial Pods',
      user: availableUsers.find((u) => u.email === 'academic@baljyoti.com') || availableUsers[4],
      icon: BookOpen,
      badge: 'Academic Dean',
      badgeColor: 'bg-emerald-700 text-white',
      modules: ['CBSE Gradebook', 'AI Lesson Plans', 'Remedial Learning', 'Classroom Sync'],
      color: 'border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white hover:border-emerald-500',
    },
    {
      id: 'faculty',
      title: 'Faculty & Class Teacher Portal',
      subtitle: 'Daily RFID Attendance, Assessment Scoring & Student Mentorship',
      user: availableUsers.find((u) => u.email === 'teacher@baljyoti.com') || availableUsers[5],
      icon: UserCheck,
      badge: 'Faculty Member',
      badgeColor: 'bg-teal-700 text-white',
      modules: ['Class Attendance', 'Weekly Lesson Delivery', 'Grade Entry', 'Mentorship'],
      color: 'border-teal-200 bg-gradient-to-br from-teal-50/50 to-white hover:border-teal-500',
    },
    {
      id: 'activity',
      title: 'House System & Co-Curricular ERP',
      subtitle: '4 Houses Championship, Athletics Meet, Hackathons & Consents',
      user: availableUsers.find((u) => u.email === 'activity@baljyoti.com') || availableUsers[6],
      icon: Trophy,
      badge: 'Activity Incharge',
      badgeColor: 'bg-amber-600 text-white',
      modules: ['4 Houses Points', 'Sports Day Roster', 'STEM Hackathons', 'Digital Consents'],
      color: 'border-amber-200 bg-gradient-to-br from-amber-50/50 to-white hover:border-amber-500',
    },
    {
      id: 'administration',
      title: 'Finance, HR & Fleet Operations',
      subtitle: 'Q1-Q4 Fee Billing, Staff Roster, Live Bus GPS & Safety Audit',
      user: availableUsers.find((u) => u.email === 'finance@baljyoti.com') || availableUsers[7],
      icon: DollarSign,
      badge: 'Finance & Admin Officer',
      badgeColor: 'bg-indigo-700 text-white',
      modules: ['Fee Billing Ledger', 'Staff Payroll Roster', 'Bus Fleet GPS', 'Safety Audits'],
      color: 'border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-white hover:border-indigo-500',
    },
    {
      id: 'parent',
      title: 'Parent & Student Guardian Portal',
      subtitle: 'Student Progress Report, Online Fee Receipts & Bus Tracking',
      user: availableUsers.find((u) => u.email === 'parent@baljyoti.com') || availableUsers[8] || availableUsers[0],
      icon: Smartphone,
      badge: 'Parent Portal',
      badgeColor: 'bg-purple-700 text-white',
      modules: ['Student Performance', 'Fee Receipts', 'Attendance Alerts', 'Bus Route Map'],
      color: 'border-purple-200 bg-gradient-to-br from-purple-50/50 to-white hover:border-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between antialiased font-sans text-slate-800">
      {/* Top Notification Bar */}
      <div className="bg-red-700 text-white text-xs font-semibold py-2 px-4 text-center tracking-wide flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 mx-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>Baljyoti Public School • Enterprise School Operating System (ERP) Gateway</span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[11px] text-red-100">
          <span>Session: 2026-2027</span>
          <span>•</span>
          <span>CBSE Code: 80001</span>
        </div>
      </div>

      {/* Main ERP Gateway Wrapper */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col justify-center">
        
        {/* Top ERP Context Header */}
        <div className="mb-6 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md font-black text-2xl shrink-0">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight">Baljyoti Public School</h1>
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-xs uppercase tracking-wider">
                  Integrated School OS
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Cloud ERP Live
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Centralized ERP Architecture uniting Admissions, Academic Pedagogy, Co-Curriculars, Finance & Google Workspace
              </p>
            </div>
          </div>

          {/* Academic Session Selector */}
          <div className="flex items-center gap-3 w-full lg:w-auto self-end lg:self-center">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-600" />
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Academic Session</span>
                <span className="font-bold text-slate-800">{selectedAcademicYear}</span>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Campus</span>
                <span className="font-bold text-slate-800">{selectedCampus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Central ERP Card Layout */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Institutional Architecture & Security Details */}
          <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-red-950 to-red-900 p-6 sm:p-7 text-white flex flex-col justify-between">
            <div className="space-y-5">
              
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-300">
                  Institutional Architecture
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Unified School ERP Flow
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Authentication immediately configures the application screen and access permissions strictly tailored to your department.
                </p>
              </div>

              {/* ERP Module Flow Stepper */}
              <div className="space-y-2.5 bg-black/25 rounded-2xl p-4 border border-white/10 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-white font-semibold block">Role Authentication</strong>
                    <span className="text-slate-300 text-[11px]">Choose your departmental portal or use Google SSO.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-white font-semibold block">Dynamic Role Dashboard</strong>
                    <span className="text-slate-300 text-[11px]">Screens render only authorized modules with granular RBAC.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-white font-semibold block">Interactive Sub-Workspaces</strong>
                    <span className="text-slate-300 text-[11px]">Admission CRM, CBSE Gradebooks, 4 Houses, Fee Ledgers.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <strong className="text-white font-semibold block">AI Copilot & BigQuery Lake</strong>
                    <span className="text-slate-300 text-[11px]">Real-time analytics and NEP 2020 pedagogical intelligence.</span>
                  </div>
                </div>
              </div>

              {/* Compliance Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[11px] text-slate-200">CBSE Affiliation</span>
                </div>
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[11px] text-slate-200">NEP 2020 Ready</span>
                </div>
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[11px] text-slate-200">2FA MFA Protected</span>
                </div>
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[11px] text-slate-200">Cloud Firestore</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-[11px] text-slate-300 flex items-center justify-between">
              <span>BPS Affiliation: 2130000</span>
              <span>School Code: 80001</span>
            </div>
          </div>

          {/* Right Column: Portal Selector, Credentials Form & SSO */}
          <div className="lg:col-span-8 p-5 sm:p-8 flex flex-col justify-between bg-white">
            <div>
              {/* Header Title & Nav Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">Institutional Authentication Gateway</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select your departmental ERP portal below for instant access, or sign in manually.
                  </p>
                </div>

                {/* Switcher Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab('erp_portals')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'erp_portals'
                        ? 'bg-white text-red-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>ERP Portals (Instant)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('credentials')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'credentials'
                        ? 'bg-white text-red-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Email & Pass</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('google_sso')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'google_sso'
                        ? 'bg-white text-red-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.7 1 4 3.5 2.2 7.1l3.7 2.8C6.7 7.3 9.1 5 12 5z"/>
                      <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9c-.3 1.4-1 2.5-2.2 3.3l3.6 2.8c2.1-1.9 3.2-4.7 3.2-8.1z"/>
                      <path fill="#FBBC05" d="M5.9 14.1c-.2-.7-.4-1.4-.4-2.1s.2-1.4.4-2.1L2.2 7.1C1.4 8.6 1 10.2 1 12s.4 3.4 1.2 4.9l3.7-2.8z"/>
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 7.9-3l-3.6-2.8c-1.1.7-2.4 1.1-4.3 1.1-2.9 0-5.3-1.9-6.2-4.5L2.2 16.9C4 20.5 7.7 23 12 23z"/>
                    </svg>
                    <span>Google SSO</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('workflow_guide')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'workflow_guide'
                        ? 'bg-white text-red-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>ERP Tour</span>
                  </button>
                </div>
              </div>

              {/* Alert Feedback Messages */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* TAB 1: ERP DEPARTMENTAL PORTAL CARDS (INSTANT 1-TAP LOGIN) */}
              {activeTab === 'erp_portals' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">
                      Select an ERP Department to launch into its live workspace:
                    </span>
                    <span className="text-[11px] font-bold text-red-600">7 Departmental Gateways</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                    {erpPortals.map((portal) => {
                      const Icon = portal.icon;
                      const user = portal.user;
                      if (!user) return null;

                      return (
                        <div
                          key={portal.id}
                          className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${portal.color} shadow-2xs`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-white shadow-2xs border border-slate-200 text-slate-800">
                                  <Icon className="w-4 h-4 text-red-600" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-xs text-slate-900 leading-tight">
                                    {portal.title}
                                  </h4>
                                </div>
                              </div>
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${portal.badgeColor}`}>
                                {portal.badge}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                              {portal.subtitle}
                            </p>

                            {/* Credentials Pill */}
                            <div className="bg-white/80 border border-slate-200 rounded-xl p-2 mb-2 text-[10px] space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500 font-semibold">User:</span>
                                <span className="font-bold text-slate-800 truncate max-w-[170px]">{user.name}</span>
                              </div>
                              <div className="flex items-center justify-between font-mono">
                                <span className="text-slate-500">ID:</span>
                                <span className="text-slate-800 font-bold">{user.email}</span>
                              </div>
                            </div>

                            {/* Modules Included Tags */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {portal.modules.map((m, idx) => (
                                <span
                                  key={idx}
                                  className="text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded font-medium"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => handleSelectAndFillUser(user)}
                              className="flex-1 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer text-center"
                            >
                              Fill Form
                            </button>

                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() => handleQuickLaunch(user)}
                              className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                            >
                              <span>Launch</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: MANUAL EMAIL & PASSWORD LOGIN */}
              {activeTab === 'credentials' && (
                <form onSubmit={handleManualLogin} className="space-y-4 max-w-xl mx-auto py-2">
                  <div className="p-3 bg-red-50/70 border border-red-200 rounded-2xl flex items-center justify-between text-xs">
                    <span className="text-red-900 font-semibold">
                      Currently Selected Persona: <strong>{selectedUser.name}</strong> ({selectedUser.role})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('superadmin@baljyoti.com');
                        setPassword('BPS#Admin2026!');
                        setTotpCode('582914');
                      }}
                      className="text-red-700 font-bold text-[11px] underline hover:text-red-900 cursor-pointer"
                    >
                      Reset Super Admin
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Institutional Google Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. superadmin@baljyoti.com or director@baljyoti.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Institutional Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Google 2FA TOTP Code</span>
                        <span className="text-[10px] text-red-600 font-semibold">6-Digits</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <KeyRound className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          value={totpCode}
                          onChange={(e) => setTotpCode(e.target.value)}
                          placeholder="582914"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono tracking-wider focus:bg-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Verifying Credentials & Initializing ERP...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Authenticate & Launch School ERP</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 3: GOOGLE SSO ONE-TAP */}
              {activeTab === 'google_sso' && (
                <div className="space-y-4 max-w-xl mx-auto py-3">
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.7 1 4 3.5 2.2 7.1l3.7 2.8C6.7 7.3 9.1 5 12 5z"/>
                        <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9c-.3 1.4-1 2.5-2.2 3.3l3.6 2.8c2.1-1.9 3.2-4.7 3.2-8.1z"/>
                        <path fill="#FBBC05" d="M5.9 14.1c-.2-.7-.4-1.4-.4-2.1s.2-1.4.4-2.1L2.2 7.1C1.4 8.6 1 10.2 1 12s.4 3.4 1.2 4.9l3.7-2.8z"/>
                        <path fill="#34A853" d="M12 23c3.2 0 6-1.1 7.9-3l-3.6-2.8c-1.1.7-2.4 1.1-4.3 1.1-2.9 0-5.3-1.9-6.2-4.5L2.2 16.9C4 20.5 7.7 23 12 23z"/>
                      </svg>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Google Workspace Single Sign-On</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                        Sign in instantly with your verified institutional <strong className="text-red-600">@baljyoti.com</strong> account to synchronize Google Classroom, Drive dossiers, and Gmail notifications.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsGoogleModalOpen(true)}
                      className="w-full max-w-md mx-auto p-3 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition cursor-pointer shadow-xs flex items-center justify-center gap-3 text-xs font-bold text-slate-800"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.7 1 4 3.5 2.2 7.1l3.7 2.8C6.7 7.3 9.1 5 12 5z"/>
                        <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9c-.3 1.4-1 2.5-2.2 3.3l3.6 2.8c2.1-1.9 3.2-4.7 3.2-8.1z"/>
                        <path fill="#FBBC05" d="M5.9 14.1c-.2-.7-.4-1.4-.4-2.1s.2-1.4.4-2.1L2.2 7.1C1.4 8.6 1 10.2 1 12s.4 3.4 1.2 4.9l3.7-2.8z"/>
                        <path fill="#34A853" d="M12 23c3.2 0 6-1.1 7.9-3l-3.6-2.8c-1.1.7-2.4 1.1-4.3 1.1-2.9 0-5.3-1.9-6.2-4.5L2.2 16.9C4 20.5 7.7 23 12 23z"/>
                      </svg>
                      <span>Choose @baljyoti.com Google Account</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: ERP WORKFLOW GUIDE */}
              {activeTab === 'workflow_guide' && (
                <div className="space-y-4 py-2">
                  <div className="text-xs text-slate-600 mb-2">
                    Here is how data and actions flow across the 4 interconnected ERP modules:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-xs text-blue-900">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>1. Admission ERP Lifecycle</span>
                      </div>
                      <p className="text-[11px] text-blue-800 leading-relaxed">
                        Inquiries from web/walk-ins ➔ Entrance Diagnostics & Interview ➔ Document Verification Dossier ➔ Merit Scholarship Grant ➔ Fee Token Receipt.
                      </p>
                    </div>

                    <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-xs text-emerald-900">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        <span>2. Academic & Pedagogy ERP</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        Class RFID Biometrics ➔ AI Lesson Plan Generation (NEP 2020) ➔ CBSE Term Gradebooks ➔ Automatic Remedial Pod Tagging ➔ Google Classroom Sync.
                      </p>
                    </div>

                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                        <Trophy className="w-4 h-4 text-amber-600" />
                        <span>3. Co-Curricular & House ERP</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        4 Houses Championship Points (Agni, Vayu, Jal, Prithvi) ➔ Athletics Meet Roster ➔ STEM & Robotics Hackathons ➔ Digital Parent Consent Slips.
                      </p>
                    </div>

                    <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-xs text-indigo-900">
                        <DollarSign className="w-4 h-4 text-indigo-600" />
                        <span>4. Finance, HR & Fleet ERP</span>
                      </div>
                      <p className="text-[11px] text-indigo-800 leading-relaxed">
                        Q1-Q4 Fee Invoicing & UPI Gateways ➔ Faculty HR & Biometric Roster ➔ Live Bus Fleet GPS Tracking ➔ CBSE Safety Audit Compliance.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab('erp_portals')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs inline-flex items-center gap-2"
                    >
                      <span>Choose Department Portal to Start</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer Info */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
              <span>© {new Date().getFullYear()} Baljyoti Public School • School OS ERP</span>
              <div className="flex items-center gap-3">
                <span className="hover:text-slate-600 cursor-pointer">ERP User Manual</span>
                <span>•</span>
                <span className="hover:text-slate-600 cursor-pointer">Security Protocol</span>
                <span>•</span>
                <span className="hover:text-slate-600 cursor-pointer">Helpdesk Hotline</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Google OAuth Modal */}
      <GoogleOAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectGoogleAccount={(user) => {
          setIsGoogleModalOpen(false);
          handleQuickLaunch(user);
        }}
        availableUsers={availableUsers}
      />
    </div>
  );
};
