import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  KeyRound,
  Edit,
  Trash2,
  Smartphone,
  Layers,
  Users,
  Building2,
  GraduationCap,
  Trophy,
  DollarSign,
  Lock,
  Unlock,
  AlertTriangle,
  RefreshCw,
  Plus,
  X,
  Save,
  Check,
} from 'lucide-react';
import { SystemUser, MainModule, UserAccountRole, SubmoduleDefinition } from '../../types';
import { SUBMODULE_DEFINITIONS } from '../../data/mockUserData';

interface UserManagementModuleProps {
  users: SystemUser[];
  currentSuperAdmin: SystemUser;
  onUpdateUser: (updatedUser: SystemUser) => void;
  onAddUser: (newUser: SystemUser) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserManagementModule: React.FC<UserManagementModuleProps> = ({
  users,
  currentSuperAdmin,
  onUpdateUser,
  onAddUser,
  onDeleteUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Modals
  const [editingPermissionsUser, setEditingPermissionsUser] = useState<SystemUser | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [resetMfaSuccessUser, setResetMfaSuccessUser] = useState<string | null>(null);

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserEmpId, setNewUserEmpId] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserAccountRole>('TEACHER');
  const [newUserDesignation, setNewUserDesignation] = useState('');
  const [newUserDepartment, setNewUserDepartment] = useState('Academic Pedagogy');
  const [newUserPhone, setNewUserPhone] = useState('+91 98111 ');

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate Summary Statistics
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'Active').length;
  const superAdminCount = users.filter((u) => u.role === 'SUPER_ADMIN').length;
  const mfaEnabledCount = users.filter((u) => u.mfaEnabled).length;

  // Toggle user status (Active <-> Suspended)
  const handleToggleStatus = (user: SystemUser) => {
    if (user.role === 'SUPER_ADMIN' && user.id === currentSuperAdmin.id) {
      alert('You cannot suspend your own active Super Administrator session.');
      return;
    }
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    onUpdateUser({ ...user, status: newStatus });
  };

  // Reset MFA
  const handleResetMFA = (user: SystemUser) => {
    onUpdateUser({ ...user, mfaEnabled: true });
    setResetMfaSuccessUser(user.id);
    setTimeout(() => setResetMfaSuccessUser(null), 3000);
  };

  // Submit New User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    let cleanEmail = newUserEmail.trim().toLowerCase();
    if (!cleanEmail.includes('@')) {
      cleanEmail = `${cleanEmail}@baljyoti.com`;
    }

    // Default modules based on role
    let allowedMods: MainModule[] = ['overview'];
    let allowedSubs: string[] = [];

    if (newUserRole === 'SUPER_ADMIN') {
      allowedMods = ['overview', 'admission', 'academic', 'activity', 'administration', 'user_management', 'bigquery_analytics', 'architecture_blueprint'];
      allowedSubs = SUBMODULE_DEFINITIONS.map((s) => s.id);
    } else if (newUserRole === 'DIRECTOR') {
      allowedMods = ['overview', 'admission', 'academic', 'activity', 'administration', 'bigquery_analytics', 'architecture_blueprint'];
      allowedSubs = SUBMODULE_DEFINITIONS.filter((s) => s.parentModule !== 'user_management').map((s) => s.id);
    } else if (newUserRole === 'ADMISSIONS_OFFICER') {
      allowedMods = ['overview', 'admission'];
      allowedSubs = SUBMODULE_DEFINITIONS.filter((s) => s.parentModule === 'admission').map((s) => s.id);
    } else if (newUserRole === 'ACADEMIC_LEAD') {
      allowedMods = ['overview', 'academic', 'bigquery_analytics'];
      allowedSubs = SUBMODULE_DEFINITIONS.filter((s) => s.parentModule === 'academic' || s.parentModule === 'bigquery_analytics').map((s) => s.id);
    } else if (newUserRole === 'TEACHER') {
      allowedMods = ['overview', 'academic'];
      allowedSubs = ['sub-aca-gradebook', 'sub-aca-lessons', 'sub-aca-classroom', 'sub-aca-attendance'];
    } else if (newUserRole === 'ACTIVITY_COORDINATOR') {
      allowedMods = ['overview', 'activity'];
      allowedSubs = SUBMODULE_DEFINITIONS.filter((s) => s.parentModule === 'activity').map((s) => s.id);
    } else if (newUserRole === 'FINANCE_OFFICER') {
      allowedMods = ['overview', 'administration'];
      allowedSubs = SUBMODULE_DEFINITIONS.filter((s) => s.parentModule === 'administration').map((s) => s.id);
    }

    const newUser: SystemUser = {
      id: `USR-${Date.now()}`,
      employeeId: newUserEmpId || `BPS-EMP-${Math.floor(100 + Math.random() * 900)}`,
      name: newUserName,
      email: cleanEmail,
      role: newUserRole,
      personaRole: newUserRole === 'SUPER_ADMIN' || newUserRole === 'DIRECTOR' ? 'Principal' : newUserRole === 'ADMISSIONS_OFFICER' ? 'Admissions Officer' : newUserRole === 'ACTIVITY_COORDINATOR' ? 'Activity Coordinator' : newUserRole === 'FINANCE_OFFICER' ? 'Admin & Finance Officer' : 'Teacher',
      designation: newUserDesignation || 'Faculty Member',
      department: newUserDepartment,
      phone: newUserPhone,
      status: 'Active',
      mfaEnabled: true,
      lastLogin: 'Never (Newly Created)',
      allowedModules: allowedMods,
      allowedSubmodules: allowedSubs,
    };

    onAddUser(newUser);
    setIsAddUserOpen(false);
    // Reset inputs
    setNewUserName('');
    setNewUserEmail('');
    setNewUserEmpId('');
    setNewUserDesignation('');
  };

  // Group submodules by parent module
  const admissionSubs = SUBMODULE_DEFINITIONS.filter((s) => s.parentModule === 'admission');
  const academicSubs = SUBMODULE_DEFINITIONS.filter((s) => s.parentModule === 'academic');
  const activitySubs = SUBMODULE_DEFINITIONS.filter((s) => s.parentModule === 'activity');
  const adminSubs = SUBMODULE_DEFINITIONS.filter((s) => s.parentModule === 'administration');

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner / Governance Alert */}
      <div className="bg-red-600 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white text-red-600 flex items-center justify-center font-bold shadow-md shrink-0">
            <ShieldCheck className="w-7 h-7 text-red-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white text-red-700 tracking-wider">
                SUPER ADMIN RESTRICTED
              </span>
              <span className="text-xs text-red-100">Institutional Governance & Security</span>
            </div>
            <h2 className="text-xl font-black mt-1">User & Module Access Control Center</h2>
            <p className="text-xs text-red-100 max-w-2xl mt-0.5">
              Configure @baljyoti.com accounts, enforce Google Authenticator MFA, and grant granular permissions across the 4 key school verticals and submodules.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddUserOpen(true)}
          className="px-4 py-2.5 bg-white hover:bg-slate-50 text-red-700 font-bold rounded-xl text-xs shadow-md transition cursor-pointer flex items-center gap-2 shrink-0"
        >
          <UserPlus className="w-4 h-4 text-red-600" />
          <span>Provision New User</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total System Users</span>
            <Users className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalUsers}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Verified @baljyoti.com accounts</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Accounts</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{activeUsers}</div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">100% operational status</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Super Administrators</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{superAdminCount}</div>
          <span className="text-[11px] text-red-700 font-medium mt-1 block">Full User Mgmt privileges</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Google MFA 2FA</span>
            <Smartphone className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{mfaEnabledCount} / {totalUsers}</div>
          <span className="text-[11px] text-blue-700 font-medium mt-1 block">Authenticator TOTP enforced</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          <div className="w-full sm:w-80 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, employee ID..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-red-600"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="DIRECTOR">Director</option>
              <option value="ADMISSIONS_OFFICER">Admissions Officer</option>
              <option value="ACADEMIC_LEAD">Academic Lead</option>
              <option value="TEACHER">Teacher</option>
              <option value="ACTIVITY_COORDINATOR">Activity Coordinator</option>
              <option value="FINANCE_OFFICER">Finance Officer</option>
              <option value="PARENT_STUDENT">Parent / Student</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-red-600"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">User Profile</th>
                <th className="py-3 px-4">Role & Designation</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Security & 2FA</th>
                <th className="py-3 px-4">Permitted Modules</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const isSuper = user.role === 'SUPER_ADMIN';
                const isDirector = user.role === 'DIRECTOR';
                const isCurrent = user.id === currentSuperAdmin.id;

                return (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition">
                    {/* User Profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSuper
                              ? 'bg-red-600 text-white'
                              : isDirector
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {isCurrent && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 block">{user.email}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{user.employeeId}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role & Designation */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isSuper
                              ? 'bg-red-600 text-white'
                              : isDirector
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {user.role}
                        </span>
                        <div className="text-[11px] font-medium text-slate-700">{user.designation}</div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4">
                      <span className="text-slate-700">{user.department}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Last login: {user.lastLogin}</span>
                    </td>

                    {/* Security & 2FA */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {user.mfaEnabled ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Google 2FA Enforced</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>MFA Optional</span>
                          </span>
                        )}
                      </div>
                      {resetMfaSuccessUser === user.id && (
                        <span className="text-[10px] font-bold text-red-600 mt-1 block animate-bounce">
                          2FA Secret Reset!
                        </span>
                      )}
                    </td>

                    {/* Permitted Modules */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {user.allowedModules.includes('user_management') ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                            All Modules + User Mgmt
                          </span>
                        ) : (
                          user.allowedModules.map((mod) => (
                            <span
                              key={mod}
                              className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {mod}
                            </span>
                          ))
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {user.allowedSubmodules.length} active submodules configured
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          user.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.status === 'Active' ? 'bg-emerald-600' : 'bg-red-600'
                          }`}
                        />
                        <span>{user.status}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Permissions */}
                        <button
                          type="button"
                          onClick={() => setEditingPermissionsUser(user)}
                          title="Configure Module & Submodule Permissions"
                          className="p-1.5 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>

                        {/* Reset 2FA */}
                        <button
                          type="button"
                          onClick={() => handleResetMFA(user)}
                          title="Reset Google Authenticator Key"
                          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                        >
                          <Smartphone className="w-4 h-4" />
                        </button>

                        {/* Toggle Status (Active / Suspended) */}
                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(user)}
                            title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              user.status === 'Active'
                                ? 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
                                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            {user.status === 'Active' ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <Unlock className="w-4 h-4" />
                            )}
                          </button>
                        )}

                        {/* Delete User */}
                        {!isCurrent && !isSuper && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove user "${user.name}" (${user.email})?`)) {
                                onDeleteUser(user.id);
                              }
                            }}
                            title="Delete User"
                            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Granular Permissions Matrix */}
      {editingPermissionsUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            {/* Modal Header */}
            <div className="bg-red-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <KeyRound className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Configure Module & Submodule Permissions</h3>
                  <p className="text-xs text-red-100 mt-0.5">
                    User: <strong>{editingPermissionsUser.name}</strong> ({editingPermissionsUser.email}) • Role: {editingPermissionsUser.role}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingPermissionsUser(null)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Permission Tree */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Role info warning */}
              {editingPermissionsUser.role === 'SUPER_ADMIN' ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Super Admin accounts automatically maintain universal access to all modules including User Management.</span>
                </div>
              ) : editingPermissionsUser.role === 'DIRECTOR' ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Director / Admin has access to all operational modules, but User Management is strictly restricted to Super Admin.</span>
                </div>
              ) : null}

              {/* 1. Admission Module & Submodules */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-red-600" />
                    <span className="font-bold text-xs text-slate-900">1. Admission Vertical</span>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPermissionsUser.allowedModules.includes('admission')}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        let newMods = [...editingPermissionsUser.allowedModules];
                        if (checked && !newMods.includes('admission')) newMods.push('admission');
                        if (!checked) newMods = newMods.filter((m) => m !== 'admission');
                        setEditingPermissionsUser({ ...editingPermissionsUser, allowedModules: newMods });
                      }}
                      className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <span>Enable Module</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {admissionSubs.map((sub) => {
                    const isSubChecked = editingPermissionsUser.allowedSubmodules.includes(sub.id);
                    return (
                      <label
                        key={sub.id}
                        className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 cursor-pointer transition ${
                          isSubChecked ? 'bg-red-50/60 border-red-200 text-slate-900' : 'bg-white border-slate-200 text-slate-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSubChecked}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            let newSubs = [...editingPermissionsUser.allowedSubmodules];
                            if (checked && !newSubs.includes(sub.id)) newSubs.push(sub.id);
                            if (!checked) newSubs = newSubs.filter((s) => s !== sub.id);
                            setEditingPermissionsUser({ ...editingPermissionsUser, allowedSubmodules: newSubs });
                          }}
                          className="mt-0.5 rounded text-red-600 focus:ring-red-500"
                        />
                        <div>
                          <span className="font-bold block text-[11px] leading-tight">{sub.name}</span>
                          <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{sub.description}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 2. Academic Module & Submodules */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-red-600" />
                    <span className="font-bold text-xs text-slate-900">2. Academic & Pedagogy Vertical</span>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPermissionsUser.allowedModules.includes('academic')}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        let newMods = [...editingPermissionsUser.allowedModules];
                        if (checked && !newMods.includes('academic')) newMods.push('academic');
                        if (!checked) newMods = newMods.filter((m) => m !== 'academic');
                        setEditingPermissionsUser({ ...editingPermissionsUser, allowedModules: newMods });
                      }}
                      className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <span>Enable Module</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {academicSubs.map((sub) => {
                    const isSubChecked = editingPermissionsUser.allowedSubmodules.includes(sub.id);
                    return (
                      <label
                        key={sub.id}
                        className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 cursor-pointer transition ${
                          isSubChecked ? 'bg-red-50/60 border-red-200 text-slate-900' : 'bg-white border-slate-200 text-slate-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSubChecked}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            let newSubs = [...editingPermissionsUser.allowedSubmodules];
                            if (checked && !newSubs.includes(sub.id)) newSubs.push(sub.id);
                            if (!checked) newSubs = newSubs.filter((s) => s !== sub.id);
                            setEditingPermissionsUser({ ...editingPermissionsUser, allowedSubmodules: newSubs });
                          }}
                          className="mt-0.5 rounded text-red-600 focus:ring-red-500"
                        />
                        <div>
                          <span className="font-bold block text-[11px] leading-tight">{sub.name}</span>
                          <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{sub.description}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3. Activity Module & Submodules */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-red-600" />
                    <span className="font-bold text-xs text-slate-900">3. Activity & House Sports Vertical</span>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPermissionsUser.allowedModules.includes('activity')}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        let newMods = [...editingPermissionsUser.allowedModules];
                        if (checked && !newMods.includes('activity')) newMods.push('activity');
                        if (!checked) newMods = newMods.filter((m) => m !== 'activity');
                        setEditingPermissionsUser({ ...editingPermissionsUser, allowedModules: newMods });
                      }}
                      className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <span>Enable Module</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {activitySubs.map((sub) => {
                    const isSubChecked = editingPermissionsUser.allowedSubmodules.includes(sub.id);
                    return (
                      <label
                        key={sub.id}
                        className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 cursor-pointer transition ${
                          isSubChecked ? 'bg-red-50/60 border-red-200 text-slate-900' : 'bg-white border-slate-200 text-slate-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSubChecked}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            let newSubs = [...editingPermissionsUser.allowedSubmodules];
                            if (checked && !newSubs.includes(sub.id)) newSubs.push(sub.id);
                            if (!checked) newSubs = newSubs.filter((s) => s !== sub.id);
                            setEditingPermissionsUser({ ...editingPermissionsUser, allowedSubmodules: newSubs });
                          }}
                          className="mt-0.5 rounded text-red-600 focus:ring-red-500"
                        />
                        <div>
                          <span className="font-bold block text-[11px] leading-tight">{sub.name}</span>
                          <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{sub.description}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 4. Administration Module & Submodules */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-red-600" />
                    <span className="font-bold text-xs text-slate-900">4. Campus Administration & Finance ERP</span>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPermissionsUser.allowedModules.includes('administration')}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        let newMods = [...editingPermissionsUser.allowedModules];
                        if (checked && !newMods.includes('administration')) newMods.push('administration');
                        if (!checked) newMods = newMods.filter((m) => m !== 'administration');
                        setEditingPermissionsUser({ ...editingPermissionsUser, allowedModules: newMods });
                      }}
                      className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <span>Enable Module</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {adminSubs.map((sub) => {
                    const isSubChecked = editingPermissionsUser.allowedSubmodules.includes(sub.id);
                    return (
                      <label
                        key={sub.id}
                        className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 cursor-pointer transition ${
                          isSubChecked ? 'bg-red-50/60 border-red-200 text-slate-900' : 'bg-white border-slate-200 text-slate-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSubChecked}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            let newSubs = [...editingPermissionsUser.allowedSubmodules];
                            if (checked && !newSubs.includes(sub.id)) newSubs.push(sub.id);
                            if (!checked) newSubs = newSubs.filter((s) => s !== sub.id);
                            setEditingPermissionsUser({ ...editingPermissionsUser, allowedSubmodules: newSubs });
                          }}
                          className="mt-0.5 rounded text-red-600 focus:ring-red-500"
                        />
                        <div>
                          <span className="font-bold block text-[11px] leading-tight">{sub.name}</span>
                          <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{sub.description}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {editingPermissionsUser.allowedModules.length} Modules & {editingPermissionsUser.allowedSubmodules.length} Submodules Authorized
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPermissionsUser(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateUser(editingPermissionsUser);
                    setEditingPermissionsUser(null);
                  }}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Permissions Matrix</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add New User */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="bg-red-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5" />
                <div>
                  <h3 className="font-bold text-base">Provision New @baljyoti.com Account</h3>
                  <p className="text-xs text-red-100">Super Admin User Provisioning Portal</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Prof. R. K. Singhal"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Email</label>
                  <input
                    type="text"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="e.g. rk.singhal@baljyoti.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={newUserEmpId}
                    onChange={(e) => setNewUserEmpId(e.target.value)}
                    placeholder="e.g. BPS-EMP-014"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">System Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserAccountRole)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-red-600"
                  >
                    <option value="TEACHER">Classroom Teacher</option>
                    <option value="ACADEMIC_LEAD">Academic Lead</option>
                    <option value="ADMISSIONS_OFFICER">Admissions Officer</option>
                    <option value="ACTIVITY_COORDINATOR">Activity Coordinator</option>
                    <option value="FINANCE_OFFICER">Admin & Finance Officer</option>
                    <option value="DIRECTOR">Director (All Modules)</option>
                    <option value="SUPER_ADMIN">Super Admin (All Modules + User Mgmt)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={newUserDepartment}
                    onChange={(e) => setNewUserDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-red-600"
                  >
                    <option value="Science & Pedagogy">Science & Pedagogy</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Admissions & Outreach">Admissions & Outreach</option>
                    <option value="Holistic & Physical Education">Holistic & Physical Education</option>
                    <option value="Administration & Finance">Administration & Finance</option>
                    <option value="Executive Governance">Executive Governance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Designation Title</label>
                <input
                  type="text"
                  value={newUserDesignation}
                  onChange={(e) => setNewUserDesignation(e.target.value)}
                  placeholder="e.g. Senior Faculty / Grade 10 Coordinator"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-red-600" />
                  <span className="text-slate-700 font-medium">Enforce Google Authenticator MFA at first login</span>
                </div>
                <Check className="w-4 h-4 text-red-600" />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account & Authorize</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
