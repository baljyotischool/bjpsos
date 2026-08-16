export type UserRole =
  | 'Principal'
  | 'Academic Lead'
  | 'Teacher'
  | 'Admissions Officer'
  | 'Activity Coordinator'
  | 'Administration & Finance'
  | 'Admin & Finance Officer'
  | 'Parent / Student';

export type UserAccountRole =
  | 'SUPER_ADMIN'
  | 'DIRECTOR'
  | 'ADMISSIONS_OFFICER'
  | 'ACADEMIC_LEAD'
  | 'TEACHER'
  | 'ACTIVITY_COORDINATOR'
  | 'FINANCE_OFFICER'
  | 'PARENT_STUDENT';

export type MainModule =
  | 'overview'
  | 'admission'
  | 'academic'
  | 'activity'
  | 'administration'
  | 'user_management'
  | 'settings'
  | 'bigquery_analytics'
  | 'architecture_blueprint'
  | 'analytics'
  | 'blueprint';

export type ModuleTab = MainModule;

export interface SchoolSettings {
  schoolName: string;
  tagline: string;
  logoUrl?: string;
  logoShape: 'rounded' | 'circle' | 'square';
  themeColor: 'red' | 'blue' | 'emerald' | 'purple' | 'slate' | 'amber';
  
  // Contact & Location
  websiteUrl: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  googleMapsUrl: string;
  
  // Communications & Helpdesk
  contactEmail: string;
  admissionsEmail: string;
  primaryPhone: string;
  emergencyPhone: string;
  
  // Statutory & Institutional Info
  affiliationNo: string;
  schoolCode: string;
  udiseNumber: string;
  academicSession: string;
  operatingHours: string;
  principalName: string;
  
  // Social Media Links
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
}

export interface SubmoduleDefinition {
  id: string;
  name: string;
  description: string;
  parentModule: 'admission' | 'academic' | 'activity' | 'administration' | 'overview' | 'bigquery_analytics' | 'user_management' | 'settings';
}

export interface SystemUser {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: UserAccountRole;
  personaRole: UserRole;
  designation: string;
  department: string;
  phone?: string;
  avatarUrl?: string;
  status: 'Active' | 'Suspended' | 'Pending MFA';
  mfaEnabled: boolean;
  mfaSecret?: string;
  demoPassword?: string;
  lastLogin: string;
  allowedModules: MainModule[];
  allowedSubmodules: string[];
}

export interface NextActionItem {
  id: string;
  title: string;
  actionTitle?: string;
  module: 'Admission' | 'Academic' | 'Activity' | 'Administration';
  targetRole: UserRole[];
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  impact?: string;
  rationale?: string;
  suggestedAction: string;
  googleTool?: string;
  googleIntegration?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  meta?: Record<string, any>;
}

export type NextBestActionItem = NextActionItem;

export interface AdmissionLead {
  id: string;
  applicantName: string;
  parentName: string;
  contactEmail: string;
  contactPhone: string;
  gradeApplying: string;
  stage: 'Inquiry' | 'Document Verification' | 'Entrance Assessment' | 'Principal Interview' | 'Offer Issued' | 'Enrolled';
  previousSchool: string;
  entranceScore: number;
  eligibilityIndex: number;
  scholarshipTier?: string;
  applicationDate: string;
  assignedCounselor: string;
  documentsVerified: boolean;
  notes: string;
}

export interface StudentAcademicRecord {
  id: string;
  rollNo: string;
  name: string;
  grade: string;
  section: string;
  house: 'Agni' | 'Trishul' | 'Prithvi' | 'Akash';
  subjects: {
    name: string;
    score: number;
    maxScore: number;
    gradeLetter: string;
    masteryStatus: 'Mastered' | 'On Track' | 'Borderline' | 'Needs Intervention';
  }[];
  overallPercentage: number;
  attendancePercent: number;
  googleClassroomSubmissions: number; // e.g. 96%
  predictedScore: number;
  atRiskFlag: boolean;
  interventionPlan?: string;
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  grade: string;
  teacher: string;
  duration: string;
  bloomsTaxonomy: string[];
  hook: string;
  phases: { time: string; phase: string; activity: string }[];
  homework: string;
  aiInterventionTips: string;
  classroomSyncStatus: 'Synced' | 'Draft' | 'Scheduled';
  dateScheduled: string;
}

export interface SchoolActivityEvent {
  id: string;
  title: string;
  category: 'Sports' | 'Cultural' | 'STEM & Robotics' | 'Leadership' | 'Community Outreach';
  house: 'Agni' | 'Trishul' | 'Prithvi' | 'Akash' | 'All Houses';
  date: string;
  venue: string;
  coordinator: string;
  enrolledStudentsCount: number;
  status: 'Upcoming' | 'Active' | 'Completed';
  budgetApproved: boolean;
  parentConsentSync: '100% Verified' | 'Pending Review' | '88% Received';
  highlight: string;
}

export interface AdminFeeRecord {
  id: string;
  receiptNo: string;
  studentName: string;
  rollNo: string;
  grade: string;
  term: 'Quarter 1' | 'Quarter 2' | 'Quarter 3' | 'Quarter 4';
  amountDue: number;
  amountPaid: number;
  status: 'Paid' | 'Partial' | 'Overdue' | 'Exempted';
  dueDate: string;
  paymentMode?: string;
}

export interface BusRouteTracker {
  routeNumber: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  vehicleNo: string;
  capacity: number;
  studentsOnboard: number;
  currentLocation: string;
  status: 'On Time' | 'Delayed by 6 mins' | 'Completed Morning Route' | 'At Depot';
  speedKmH: number;
  lastGpsPing: string;
}

export interface StaffRecord {
  id: string;
  name: string;
  role: string;
  department: 'Science' | 'Mathematics' | 'Humanities' | 'Physical Education' | 'Administration' | 'Admissions';
  email: string;
  phone: string;
  attendanceToday: 'Present' | 'On Leave' | 'Class in Progress';
  currentClassAssigned?: string;
  googleAccountLinked: boolean;
}

export interface GoogleWorkspaceIntegrationStatus {
  service: string;
  status: 'Connected' | 'Syncing' | 'Operational';
  lastSync: string;
  latencyMs: number;
  recordsSyncedToday: number;
  iconName: string;
}
