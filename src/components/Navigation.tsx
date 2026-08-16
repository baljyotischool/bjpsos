import React from 'react';
import {
  LayoutDashboard,
  UserPlus,
  GraduationCap,
  Trophy,
  Building2,
  Database,
  FileText,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { MainModule, SystemUser } from '../types';

interface NavigationProps {
  currentUser?: SystemUser;
  currentModule?: MainModule;
  activeTab?: MainModule;
  onSelectModule?: (module: MainModule) => void;
  onTabChange?: (tab: MainModule) => void;
  badgeCounts?: {
    admission: number;
    academic: number;
    activity: number;
    administration: number;
  };
  admissionsCount?: number;
  academicRiskCount?: number;
  activitiesCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentUser,
  currentModule,
  activeTab,
  onSelectModule,
  onTabChange,
  badgeCounts,
  admissionsCount = 4,
  academicRiskCount = 2,
  activitiesCount = 4,
}) => {
  const selectedModule = activeTab || currentModule || 'overview';
  const handleSelect = (mod: MainModule) => {
    if (onTabChange) onTabChange(mod);
    else if (onSelectModule) onSelectModule(mod);
  };

  const admCount = badgeCounts?.admission ?? admissionsCount;
  const acaCount = badgeCounts?.academic ?? academicRiskCount;
  const actCount = badgeCounts?.activity ?? activitiesCount;

  const allNavItems: {
    id: MainModule;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    type: 'core' | 'vertical' | 'horizontal' | 'settings' | 'analytics' | 'doc' | 'admin_only';
    badge?: number;
  }[] = [
    {
      id: 'overview',
      label: 'OS Overview',
      sublabel: 'Executive Cockpit',
      icon: <LayoutDashboard className="w-4 h-4" />,
      type: 'core',
    },
    {
      id: 'admission',
      label: '1. Admission',
      sublabel: 'Vertical: Leads & Verification',
      icon: <UserPlus className="w-4 h-4" />,
      type: 'vertical',
      badge: admCount,
    },
    {
      id: 'academic',
      label: '2. Academic',
      sublabel: 'Vertical: Pedagogy & Gradebook',
      icon: <GraduationCap className="w-4 h-4" />,
      type: 'vertical',
      badge: acaCount,
    },
    {
      id: 'activity',
      label: '3. Activity',
      sublabel: 'Vertical: Sports & Houses',
      icon: <Trophy className="w-4 h-4" />,
      type: 'vertical',
      badge: actCount,
    },
    {
      id: 'administration',
      label: 'Administration',
      sublabel: 'Horizontal: ERP, Bus & Users',
      icon: <Building2 className="w-4 h-4" />,
      type: 'horizontal',
    },
    {
      id: 'settings',
      label: 'Settings',
      sublabel: 'Logo, Theme & School Web Info',
      icon: <Settings className="w-4 h-4" />,
      type: 'settings',
    },
    {
      id: 'bigquery_analytics',
      label: 'BigQuery Data Lake',
      sublabel: 'Predictive Insights',
      icon: <Database className="w-4 h-4" />,
      type: 'analytics',
    },
    {
      id: 'architecture_blueprint',
      label: 'Architect Blueprint',
      sublabel: 'Google Cloud Whitepaper',
      icon: <FileText className="w-4 h-4" />,
      type: 'doc',
    },
  ];

  // Filter items based on current user permissions
  const navItems = allNavItems.filter((item) => {
    if (!currentUser) return true;
    if (item.id === 'settings') {
      return (
        currentUser.role === 'SUPER_ADMIN' ||
        currentUser.role === 'DIRECTOR' ||
        currentUser.allowedModules.includes('settings') ||
        currentUser.allowedModules.includes('administration')
      );
    }
    return (
      currentUser.allowedModules.includes(item.id) ||
      (item.id === 'bigquery_analytics' && currentUser.allowedModules.includes('analytics')) ||
      (item.id === 'architecture_blueprint' && currentUser.allowedModules.includes('blueprint'))
    );
  });

  return (
    <>
      {/* Desktop Navigation Bar */}
      <nav className="hidden md:block bg-white border-b border-slate-200 sticky top-[57px] z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none">
            {navItems.map((item) => {
              const isActive =
                selectedModule === item.id ||
                (item.id === 'bigquery_analytics' && selectedModule === 'analytics') ||
                (item.id === 'architecture_blueprint' && selectedModule === 'blueprint');
              const isSuperAdminSpecial = item.id === 'user_management';

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? isSuperAdminSpecial
                        ? 'bg-red-700 text-white shadow-xs'
                        : 'bg-red-600 text-white shadow-xs'
                      : isSuperAdminSpecial
                      ? 'text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 font-bold'
                      : 'text-slate-700 hover:text-red-700 hover:bg-red-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur border-t border-slate-200 px-1 py-1.5 shadow-lg">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 5).map((tab) => {
            const isActive = selectedModule === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelect(tab.id as MainModule)}
                className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition cursor-pointer ${
                  isActive ? 'text-red-600 bg-red-50' : 'text-slate-500 hover:text-red-600'
                }`}
              >
                {tab.icon}
                <span className="mt-0.5 max-w-[60px] truncate">{tab.label.replace(/^\d+\.\s*/, '')}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute top-0.5 right-1 w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[8px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

