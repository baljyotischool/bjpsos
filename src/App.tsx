import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Building2,
  Check,
  LogOut,
  User,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  RefreshCw,
  KeyRound
} from 'lucide-react';
import { UserProfile, GoogleAuthAccount } from './types';

const PRECONFIGURED_ACCOUNTS: GoogleAuthAccount[] = [
  {
    name: 'Administrative Director',
    email: 'info@baljyoti.com',
    role: 'Super Admin',
    department: 'Institutional Governance & Operations',
    avatarColor: 'bg-red-600',
  },
  {
    name: 'Super Administrator',
    email: 'superadmin@baljyoti.com',
    role: 'Super Admin',
    department: 'Central IT & School Governance',
    avatarColor: 'bg-red-600',
  },
  {
    name: 'Dr. Sunita Sharma',
    email: 'principal@baljyoti.com',
    role: 'Principal',
    department: 'Academic Leadership & Pedagogy',
    avatarColor: 'bg-amber-600',
  },
  {
    name: 'Rajesh Kumar Verma',
    email: 'admissions@baljyoti.com',
    role: 'Admissions Officer',
    department: 'Admissions & Student Intake',
    avatarColor: 'bg-blue-600',
  },
  {
    name: 'Ananya Deshmukh',
    email: 'faculty@baljyoti.com',
    role: 'Faculty',
    department: 'Senior Secondary Science Wing',
    avatarColor: 'bg-emerald-600',
  },
  {
    name: 'Vikramaditya Mehta',
    email: 'accounts@baljyoti.com',
    role: 'Accountant',
    department: 'Finance & Fee Management',
    avatarColor: 'bg-indigo-600',
  },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'google' | 'password'>('google');

  const handleDomainValidationAndLogin = (email: string, name?: string, role?: UserProfile['role'], department?: string) => {
    setErrorMessage('');
    const cleanEmail = email.trim().toLowerCase();

    // Strict domain check for @baljyoti.com
    if (!cleanEmail.endsWith('@baljyoti.com')) {
      setErrorMessage('Access Denied: Only institutional Google accounts ending with @baljyoti.com are authorized to sign in.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const preconfigured = PRECONFIGURED_ACCOUNTS.find((acc) => acc.email.toLowerCase() === cleanEmail);

      const userProfile: UserProfile = {
        id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        name: name || preconfigured?.name || cleanEmail.split('@')[0].toUpperCase(),
        email: cleanEmail,
        role: role || preconfigured?.role || 'Faculty',
        department: department || preconfigured?.department || 'School Operations',
        verifiedDomain: true,
        lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      setCurrentUser(userProfile);
      setIsGoogleModalOpen(false);
    }, 600);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      setErrorMessage('Please enter your institutional @baljyoti.com Google email.');
      return;
    }
    handleDomainValidationAndLogin(emailInput);
  };

  const handleQuickGoogleAccountSelect = (account: GoogleAuthAccount) => {
    handleDomainValidationAndLogin(account.email, account.name, account.role, account.department);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setEmailInput('');
    setPasswordInput('');
    setErrorMessage('');
  };

  // IF USER IS AUTHENTICATED: SHOW CLEAN DASHBOARD
  if (currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-xs">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-base text-slate-900 leading-tight">Baljyoti Public School</h1>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Institutional Workspace</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-[11px] text-red-600 font-semibold">@baljyoti.com</span>
                </div>
              </div>
            </div>

            {/* User Profile info & Logout */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900">{currentUser.name}</span>
                <span className="text-[11px] text-slate-500 font-mono">{currentUser.email}</span>
              </div>

              <div className="w-9 h-9 rounded-full bg-red-100 border border-red-200 text-red-700 font-bold flex items-center justify-center text-sm shadow-2xs">
                {currentUser.name.charAt(0)}
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 border border-slate-200 hover:border-red-200 text-slate-700 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5"
                title="Sign out of Baljyoti School OS"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Domain Verified: {currentUser.email}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                Welcome back, {currentUser.name}
              </h2>
              <p className="text-xs text-slate-500">
                Designated as <strong className="text-slate-700">{currentUser.role}</strong> in the <strong className="text-slate-700">{currentUser.department}</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-right">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Authenticated Session</span>
                <span className="text-xs font-bold text-slate-800">{currentUser.lastLogin}</span>
              </div>
            </div>
          </div>

          {/* Module Access Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Institutional Modules</h3>
                <p className="text-xs text-slate-500">Authorized for {currentUser.email}</p>
              </div>
              <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                Google Workspace SSO Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-red-400 transition space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Admissions CRM</h4>
                  <p className="text-xs text-slate-500 mt-1">Student registration, verification dossier, and token admission tracking.</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Authorized</span>
                  <span className="text-slate-400 text-[11px]">Module 1</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-blue-400 transition space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Academic & Pedagogy</h4>
                  <p className="text-xs text-slate-500 mt-1">CBSE curriculum, AI lesson planning, RFID attendance, and gradebooks.</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Authorized</span>
                  <span className="text-slate-400 text-[11px]">Module 2</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-amber-400 transition space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Activity & Houses</h4>
                  <p className="text-xs text-slate-500 mt-1">4 Houses Championship, athletics, robotics hackathons, and consents.</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Authorized</span>
                  <span className="text-slate-400 text-[11px]">Module 3</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-indigo-400 transition space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Administration & ERP</h4>
                  <p className="text-xs text-slate-500 mt-1">Q1-Q4 Fee invoicing, staff biometric payroll, and live bus fleet GPS.</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Authorized</span>
                  <span className="text-slate-400 text-[11px]">Module 4</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // LOGIN PAGE (FIRST VIEW)
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between antialiased font-sans text-slate-800">
      {/* Top Banner */}
      <div className="bg-red-700 text-white text-xs font-semibold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-2xs">
        <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
        <span>Baljyoti Public School • Institutional Google Authentication Gateway (@baljyoti.com)</span>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Hero & School Information Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-red-600 via-red-600 to-red-700 p-6 sm:p-8 text-white flex flex-col justify-between">
            <div className="space-y-6">
              {/* Crest */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center shadow-lg font-black text-xl">
                  <GraduationCap className="w-7 h-7 text-red-600" />
                </div>
                <div>
                  <h1 className="font-bold text-xl leading-tight">Baljyoti Public School</h1>
                  <span className="text-xs text-red-100 font-medium tracking-wide">Institutional Operating System</span>
                </div>
              </div>

              {/* Notice */}
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 space-y-2 text-xs leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-white uppercase text-[11px] tracking-wider">
                  <Shield className="w-4 h-4 text-amber-300" />
                  <span>Domain-Restricted Access</span>
                </div>
                <p className="text-red-50">
                  Authentication is strictly guarded for official Google Workspace accounts ending with:
                </p>
                <div className="p-2.5 bg-black/20 rounded-xl font-mono text-center text-sm font-bold text-amber-300 tracking-wider">
                  @baljyoti.com
                </div>
              </div>

              {/* Feature Badges */}
              <div className="space-y-2 text-xs text-red-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Google Workspace Identity & SSO</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Automatic Role-Based Permissions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Google Classroom & Drive Sync</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-red-500/40 text-[11px] text-red-100 flex items-center justify-between">
              <span>CBSE Affiliation: 2130000</span>
              <span>School Code: 80001</span>
            </div>
          </div>

          {/* Right Login Options */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white">
            <div>
              {/* Header Title */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Sign in with Google</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Use your verified <span className="font-semibold text-red-600">@baljyoti.com</span> institutional account
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Primary Google One-Tap Sign In */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(true)}
                  className="w-full p-3.5 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 rounded-2xl transition cursor-pointer shadow-xs flex items-center justify-center gap-3 text-xs sm:text-sm font-bold text-slate-800"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.7 1 4 3.5 2.2 7.1l3.7 2.8C6.7 7.3 9.1 5 12 5z"/>
                    <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9c-.3 1.4-1 2.5-2.2 3.3l3.6 2.8c2.1-1.9 3.2-4.7 3.2-8.1z"/>
                    <path fill="#FBBC05" d="M5.9 14.1c-.2-.7-.4-1.4-.4-2.1s.2-1.4.4-2.1L2.2 7.1C1.4 8.6 1 10.2 1 12s.4 3.4 1.2 4.9l3.7-2.8z"/>
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 7.9-3l-3.6-2.8c-1.1.7-2.4 1.1-4.3 1.1-2.9 0-5.3-1.9-6.2-4.5L2.2 16.9C4 20.5 7.7 23 12 23z"/>
                  </svg>
                  <span>Sign in with Google Workspace (@baljyoti.com)</span>
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-semibold uppercase">Or Enter Email Address</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Direct Email Form with domain enforcement */}
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Institutional Google Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => {
                          setEmailInput(e.target.value);
                          if (errorMessage) setErrorMessage('');
                        }}
                        placeholder="e.g. info@baljyoti.com or faculty@baljyoti.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Verifying @baljyoti.com Domain...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue to Institutional Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Pre-configured Demo Accounts for Instant Test */}
                <div className="pt-2">
                  <span className="block text-[11px] font-bold text-slate-500 mb-2">
                    Quick Connect Available @baljyoti.com Accounts:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PRECONFIGURED_ACCOUNTS.slice(0, 4).map((acc) => (
                      <button
                        key={acc.email}
                        type="button"
                        onClick={() => handleQuickGoogleAccountSelect(acc)}
                        className="p-2 bg-slate-50 hover:bg-red-50 hover:border-red-200 border border-slate-200 rounded-xl text-left transition cursor-pointer flex items-center gap-2"
                      >
                        <div className={`w-6 h-6 rounded-full ${acc.avatarColor} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                          {acc.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[11px] font-bold text-slate-800 truncate">{acc.name}</span>
                          <span className="block text-[10px] font-mono text-slate-500 truncate">{acc.email}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
              <span>© {new Date().getFullYear()} Baljyoti Public School</span>
              <div className="flex items-center gap-3">
                <span>Google Workspace Single Sign-On</span>
                <span>•</span>
                <span>Security Policy</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Google Account Picker Modal */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.7 1 4 3.5 2.2 7.1l3.7 2.8C6.7 7.3 9.1 5 12 5z"/>
                  <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9c-.3 1.4-1 2.5-2.2 3.3l3.6 2.8c2.1-1.9 3.2-4.7 3.2-8.1z"/>
                  <path fill="#FBBC05" d="M5.9 14.1c-.2-.7-.4-1.4-.4-2.1s.2-1.4.4-2.1L2.2 7.1C1.4 8.6 1 10.2 1 12s.4 3.4 1.2 4.9l3.7-2.8z"/>
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 7.9-3l-3.6-2.8c-1.1.7-2.4 1.1-4.3 1.1-2.9 0-5.3-1.9-6.2-4.5L2.2 16.9C4 20.5 7.7 23 12 23z"/>
                </svg>
                <span className="font-bold text-xs text-slate-800">Choose a @baljyoti.com Google Account</span>
              </div>
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3 space-y-1.5 max-h-80 overflow-y-auto">
              {PRECONFIGURED_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickGoogleAccountSelect(acc)}
                  className="w-full p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition cursor-pointer flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${acc.avatarColor} text-white font-bold text-xs flex items-center justify-center`}>
                      {acc.name.charAt(0)}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-900">{acc.name}</span>
                      <span className="block text-[11px] font-mono text-slate-500">{acc.email}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {acc.role}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-500">
                To add another account, ensure it belongs to the <strong className="text-slate-700">@baljyoti.com</strong> domain.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
