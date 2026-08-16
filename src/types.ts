export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'Super Admin' | 'Principal' | 'Faculty' | 'Admissions Officer' | 'Accountant' | 'Student / Parent';
  department: string;
  verifiedDomain: boolean;
  lastLogin: string;
}

export interface GoogleAuthAccount {
  name: string;
  email: string;
  role: 'Super Admin' | 'Principal' | 'Faculty' | 'Admissions Officer' | 'Accountant' | 'Student / Parent';
  department: string;
  avatarColor: string;
}
