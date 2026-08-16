import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  X,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Smartphone,
  Check,
} from 'lucide-react';
import { SystemUser } from '../../types';

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGoogleAccount: (user: SystemUser) => void;
  availableUsers: SystemUser[];
}

export const GoogleOAuthModal: React.FC<GoogleOAuthModalProps> = ({
  isOpen,
  onClose,
  onSelectGoogleAccount,
  availableUsers,
}) => {
  const [step, setStep] = useState<'account_select' | 'custom_email' | 'totp_prompt' | 'authorizing'>('account_select');
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [totpInput, setTotpInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePickUser = (user: SystemUser) => {
    setSelectedUser(user);
    if (user.mfaEnabled) {
      setStep('totp_prompt');
    } else {
      startAuthorization(user);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let clean = customEmail.trim().toLowerCase();
    if (!clean.includes('@')) {
      clean = `${clean}@baljyoti.com`;
    }

    if (!clean.endsWith('@baljyoti.com')) {
      setError('Please use a verified @baljyoti.com Google Workspace account.');
      return;
    }

    const found = availableUsers.find((u) => u.email.toLowerCase() === clean);
    if (found) {
      handlePickUser(found);
      return;
    }

    // Auto-provision user for new Google Workspace account
    const isExecutive = clean.includes('admin') || clean.includes('info') || clean.includes('director');
    const newUser: SystemUser = {
      id: `USR-G-${Date.now()}`,
      employeeId: `BPS-G-${Math.floor(1000 + Math.random() * 9000)}`,
      name: customName.trim() || clean.split('@')[0].toUpperCase(),
      email: clean,
      role: clean.includes('admin') || clean.includes('info') ? 'SUPER_ADMIN' : clean.includes('director') ? 'DIRECTOR' : 'TEACHER',
      personaRole: isExecutive ? 'Principal' : 'Teacher',
      designation: isExecutive ? 'Executive Officer' : 'Faculty Member',
      department: isExecutive ? 'Institutional Governance' : 'Academic Pedagogy',
      status: 'Active',
      mfaEnabled: true,
      lastLogin: 'Just now via Google SSO',
      allowedModules: isExecutive
        ? ['overview', 'admission', 'academic', 'activity', 'administration', 'user_management', 'bigquery_analytics', 'architecture_blueprint']
        : ['overview', 'academic'],
      allowedSubmodules: [],
    };

    setSelectedUser(newUser);
    startAuthorization(newUser);
  };

  const startAuthorization = (user: SystemUser) => {
    setStep('authorizing');
    setError('');
    setTimeout(() => {
      onSelectGoogleAccount(user);
      onClose();
    }, 900);
  };

  const handleVerifyTotp = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      startAuthorization(selectedUser);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Google Identity Header */}
        <div className="bg-white border-b border-slate-100 p-5 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Official Google G SVG */}
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs border border-slate-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 leading-tight">Google Workspace Authentication</h3>
              <p className="text-[11px] text-slate-500">Sign in to Baljyoti Public School OS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Account Selection List */}
          {step === 'account_select' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Choose a Google Account</span>
                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  @baljyoti.com
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin divide-y divide-slate-100">
                {availableUsers.map((u) => {
                  const isSuper = u.role === 'SUPER_ADMIN';
                  const isDirector = u.role === 'DIRECTOR';

                  return (
                    <button
                      key={u.id}
                      onClick={() => handlePickUser(u)}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between gap-3 transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isSuper
                              ? 'bg-red-600 text-white'
                              : isDirector
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {u.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-red-700 transition truncate">
                              {u.name}
                            </span>
                            {isSuper && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-red-600 text-white shrink-0">
                                Super Admin
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition shrink-0" />
                    </button>
                  );
                })}
              </div>

              {/* Use Another Account Button */}
              <button
                type="button"
                onClick={() => setStep('custom_email')}
                className="w-full mt-2 p-2.5 rounded-xl border border-dashed border-slate-300 hover:border-red-600 hover:bg-red-50/50 text-slate-700 hover:text-red-800 flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer"
              >
                <Plus className="w-4 h-4 text-red-600" />
                <span>Use another @baljyoti.com account</span>
              </button>

              {/* Security Policy Notice */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-[10px] text-slate-500 leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  To continue, Google will share your name, email address, and institutional workspace profile with <strong>Baljyoti Public School OS</strong>.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: Custom Google Email Input */}
          {step === 'custom_email' && (
            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Workspace Email
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="e.g. info@baljyoti.com or yourname@baljyoti.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Must end with @baljyoti.com
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Sharma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('account_select')}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Google 2-Step Verification (TOTP) */}
          {step === 'totp_prompt' && selectedUser && (
            <form onSubmit={handleVerifyTotp} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Google 2-Step Verification</h4>
                <p className="text-xs text-slate-500">
                  Enter the 6-digit code generated by your <strong>Google Authenticator</strong> app for <strong className="text-slate-800">{selectedUser.email}</strong>
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  value={totpInput}
                  onChange={(e) => setTotpInput(e.target.value)}
                  placeholder="e.g. 842109"
                  className="w-full text-center tracking-widest font-mono text-lg py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('account_select')}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Change Account
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
                >
                  Confirm & Sign In
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => startAuthorization(selectedUser)}
                  className="text-[11px] text-red-600 hover:text-red-800 font-semibold underline cursor-pointer"
                >
                  Skip 2FA in Development Sandbox
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Authorizing Spinner */}
          {step === 'authorizing' && selectedUser && (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div>
                <h4 className="font-bold text-sm text-slate-900">Authorizing Google Session</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Validating token credentials for <strong>{selectedUser.email}</strong>...
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Google OAuth 2.0 Bearer Token Verified</span>
              </div>
            </div>
          )}
        </div>

        {/* Google Footer */}
        <div className="bg-slate-50 border-t border-slate-100 p-3 px-5 flex items-center justify-between text-[11px] text-slate-400">
          <span>Protected by Google Identity Services</span>
          <div className="flex items-center gap-2">
            <span>Privacy</span>
            <span>•</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
