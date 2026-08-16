import React, { useState } from 'react';
import {
  Building2,
  DollarSign,
  Bus,
  Users,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Send,
  Download,
  Phone,
  Mail,
  FileCheck,
  ExternalLink,
  MapPin,
  Clock,
  UserCheck,
  Lock,
} from 'lucide-react';
import { AdminFeeRecord, BusRouteTracker, StaffRecord, SystemUser, UserRole } from '../../types';
import { INITIAL_FEES, INITIAL_BUSES, INITIAL_STAFF } from '../../data/mockSchoolData';
import { UserManagementModule } from './UserManagementModule';

interface AdministrationModuleProps {
  currentRole: UserRole;
  currentUser?: SystemUser;
  users?: SystemUser[];
  onUpdateUser?: (updatedUser: SystemUser) => void;
  onAddUser?: (newUser: SystemUser) => void;
  onDeleteUser?: (userId: string) => void;
  onOpenCopilotWithPrompt?: (prompt: string) => void;
  initialSubTab?: 'fees' | 'transport' | 'staff' | 'compliance' | 'user_management';
}

export const AdministrationModule: React.FC<AdministrationModuleProps> = ({
  currentRole,
  currentUser,
  users = [],
  onUpdateUser,
  onAddUser,
  onDeleteUser,
  onOpenCopilotWithPrompt,
  initialSubTab = 'fees',
}) => {
  const [activeTab, setActiveTab] = useState<'fees' | 'transport' | 'staff' | 'compliance' | 'user_management'>(
    initialSubTab
  );
  const [feesList, setFeesList] = useState<AdminFeeRecord[]>(INITIAL_FEES);
  const [busesList, setBusesList] = useState<BusRouteTracker[]>(INITIAL_BUSES);
  const [staffList, setStaffList] = useState<StaffRecord[]>(INITIAL_STAFF);
  const [feeStatusFilter, setFeeStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Metrics
  const totalDue = feesList.reduce((acc, f) => acc + f.amountDue, 0);
  const totalCollected = feesList.reduce((acc, f) => acc + f.amountPaid, 0);
  const realizationPct = Math.round((totalCollected / totalDue) * 100);

  const filteredFees = feesList.filter((f) => {
    const matchesFilter = feeStatusFilter === 'All' || f.status === feeStatusFilter;
    const matchesSearch =
      f.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.grade.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleMarkFeePaid = (feeId: string) => {
    setFeesList((prev) =>
      prev.map((item) =>
        item.id === feeId ? { ...item, status: 'Paid', amountPaid: item.amountDue, paymentMode: 'UPI Verified' } : item
      )
    );
  };

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Horizontal ERP Core
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Administration, Finance & Operations
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Enterprise foundation supporting Fee Collection, Fleet Bus GPS, Staff HR, Compliance, and User Management RBAC.
          </p>
        </div>

        {/* Subtabs */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'fees', label: 'Fee ERP', icon: <DollarSign className="w-3.5 h-3.5" /> },
            { id: 'transport', label: 'Fleet Bus GPS', icon: <Bus className="w-3.5 h-3.5" /> },
            { id: 'staff', label: 'Faculty & HR', icon: <Users className="w-3.5 h-3.5" /> },
            { id: 'compliance', label: 'Safety & Compliance', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
            {
              id: 'user_management',
              label: 'User Management & RBAC',
              icon: <UserCheck className="w-3.5 h-3.5" />,
              badge: isSuperAdmin ? 'Super Admin' : 'Admin',
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Fee Collection ERP */}
      {activeTab === 'fees' && (
        <div className="space-y-5">
          {/* Fee Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Q2 Total Demand</div>
              <div className="text-2xl font-black text-slate-900 mt-1">₹{(totalDue / 1000).toFixed(1)}k</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Quarter 2 (Jul - Sep 2026)</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Realized Collections</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">₹{(totalCollected / 1000).toFixed(1)}k</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">{realizationPct}% realization rate</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Pending / Overdue Balance</div>
              <div className="text-2xl font-black text-amber-700 mt-1">
                ₹{((totalDue - totalCollected) / 1000).toFixed(1)}k
              </div>
              <div className="text-[11px] text-amber-600 font-semibold mt-0.5">1-click WhatsApp reminders active</div>
            </div>
          </div>

          {/* Fee Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by student name, roll number, or grade..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {['All', 'Paid', 'Partial', 'Overdue'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFeeStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                      feeStatusFilter === st
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Receipt / Student</th>
                    <th className="py-2.5 px-3">Grade</th>
                    <th className="py-2.5 px-3">Term</th>
                    <th className="py-2.5 px-3">Amount Due</th>
                    <th className="py-2.5 px-3">Amount Paid</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{fee.studentName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{fee.receiptNo} • {fee.rollNo}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{fee.grade}</td>
                      <td className="py-3 px-3 text-slate-600">{fee.term}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">₹{fee.amountDue.toLocaleString()}</td>
                      <td className="py-3 px-3 font-bold text-emerald-700">₹{fee.amountPaid.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            fee.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : fee.status === 'Partial'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {fee.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {fee.status !== 'Paid' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() =>
                                onOpenCopilotWithPrompt?.(
                                  `Draft an automated fee reminder notification with UPI payment link for ${fee.studentName} (Roll ${fee.rollNo}, Balance: ₹${fee.amountDue - fee.amountPaid}).`
                                )
                              }
                              className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                            >
                              Send Reminder
                            </button>
                            <button
                              onClick={() => handleMarkFeePaid(fee.id)}
                              className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition cursor-pointer"
                            >
                              Mark Paid
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">
                            {fee.paymentMode || 'Paid via UPI'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Transport & Fleet Bus GPS */}
      {activeTab === 'transport' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Campus Fleet Real-Time GPS Tracking</h3>
                <p className="text-xs text-slate-500">Live IoT geofencing with automated parent arrival alerts</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Live GPS Feed Stream Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {busesList.map((bus) => (
                <div key={bus.routeNumber} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-700 text-white rounded-lg">
                        <Bus className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{bus.routeNumber}</h4>
                        <span className="text-[10px] font-mono text-slate-500">{bus.vehicleNo}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        bus.status === 'On Time'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {bus.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-start gap-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="font-semibold">{bus.currentLocation}</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Route: {bus.routeName}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/70">
                    <div className="text-slate-600">
                      <span className="font-bold text-slate-900">{bus.studentsOnboard}</span> / {bus.capacity} Students
                    </div>
                    <div className="font-mono font-bold text-emerald-700">{bus.speedKmH} km/h</div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Driver: {bus.driverName}</span>
                    <a
                      href={`tel:${bus.driverPhone}`}
                      className="flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Faculty & Staff HR */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Faculty & Staff Directory</h3>
              <p className="text-xs text-slate-500">Google Workspace Single Sign-On (SSO) and active timetable duty</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full">
              6 Department Leads
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffList.map((staff) => (
              <div key={staff.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{staff.name}</h4>
                    <p className="text-[11px] text-slate-500">{staff.role}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      staff.attendanceToday === 'Present'
                        ? 'bg-emerald-100 text-emerald-800'
                        : staff.attendanceToday === 'Class in Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {staff.attendanceToday}
                  </span>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-500">Active Duty: </span>
                    <strong className="text-slate-800">{staff.currentClassAssigned}</strong>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">{staff.email}</div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Google Account Linked
                  </span>
                  <a href={`mailto:${staff.email}`} className="text-blue-600 font-bold hover:underline">
                    Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Safety & Compliance Vault */}
      {activeTab === 'compliance' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Institutional Compliance & Statutory Vault</h3>
            <p className="text-xs text-slate-500">
              CBSE / ICSE affiliation archives, fire safety certificates, and health audit documentation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              {
                title: 'CBSE Affiliation Extension Certificate (Reg #BPS-CBSE-88392)',
                validTill: 'March 2029',
                status: 'Certified & Verified',
                authority: 'Central Board of Secondary Education',
              },
              {
                title: 'Municipal Fire Safety & Evacuation NOC Certificate',
                validTill: 'August 2027',
                status: 'Certified & Verified',
                authority: 'Directorate of Fire Services',
              },
              {
                title: 'POCSO & Child Safety Committee Annual Resolution 2026',
                validTill: 'Active 2026-27',
                status: 'Certified & Verified',
                authority: 'Baljyoti Internal Safety Board',
              },
              {
                title: 'Potable Water & Hygiene Sanitization Laboratory Clearance',
                validTill: 'December 2026',
                status: 'Certified & Verified',
                authority: 'Public Health Engineering Dept',
              },
            ].map((doc) => (
              <div key={doc.title} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-900">{doc.title}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                    {doc.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1">
                  <span>Authority: {doc.authority}</span>
                  <span className="font-semibold text-slate-800">Valid: {doc.validTill}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: User Management & RBAC Under Administration */}
      {activeTab === 'user_management' && (
        <div className="space-y-4">
          {currentUser && onUpdateUser && onAddUser && onDeleteUser ? (
            <UserManagementModule
              users={users}
              currentSuperAdmin={currentUser}
              onUpdateUser={onUpdateUser}
              onAddUser={onAddUser}
              onDeleteUser={onDeleteUser}
            />
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
              <Lock className="w-10 h-10 text-red-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">User Management & RBAC Governance</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Manage all institutional @baljyoti.com accounts, module access grants, and Google Authenticator 2FA credentials.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
