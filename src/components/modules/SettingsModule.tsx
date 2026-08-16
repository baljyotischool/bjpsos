import React, { useState, useRef } from 'react';
import {
  Settings,
  Image,
  Palette,
  Globe,
  MapPin,
  Building,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Upload,
  RefreshCw,
  Save,
  Trash2,
  ExternalLink,
  Sliders,
  Sparkles,
  Award,
  Clock,
  Share2,
  Smartphone,
  Info,
  Check,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { SchoolSettings, SystemUser } from '../../types';
import { DEFAULT_SCHOOL_SETTINGS } from '../../data/mockSettingsData';

interface SettingsModuleProps {
  settings: SchoolSettings;
  onUpdateSettings: (newSettings: SchoolSettings) => void;
  currentUser?: SystemUser;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  settings,
  onUpdateSettings,
  currentUser,
}) => {
  const [formData, setFormData] = useState<SchoolSettings>(settings);
  const [activeSubTab, setActiveSubTab] = useState<'branding' | 'location' | 'statutory' | 'communications'>('branding');
  const [isSaved, setIsSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(settings.logoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const themeColors: { id: SchoolSettings['themeColor']; label: string; bgClass: string; borderClass: string; hex: string }[] = [
    { id: 'red', label: 'Baljyoti Crimson', bgClass: 'bg-red-600', borderClass: 'border-red-600', hex: '#DC2626' },
    { id: 'blue', label: 'Royal Navy', bgClass: 'bg-blue-600', borderClass: 'border-blue-600', hex: '#2563EB' },
    { id: 'emerald', label: 'Emerald Green', bgClass: 'bg-emerald-600', borderClass: 'border-emerald-600', hex: '#059669' },
    { id: 'purple', label: 'Imperial Purple', bgClass: 'bg-purple-600', borderClass: 'border-purple-600', hex: '#7C3AED' },
    { id: 'slate', label: 'Graphite Slate', bgClass: 'bg-slate-700', borderClass: 'border-slate-700', hex: '#334155' },
    { id: 'amber', label: 'Amber Bronze', bgClass: 'bg-amber-600', borderClass: 'border-amber-600', hex: '#D97706' },
  ];

  const handleTextChange = (field: keyof SchoolSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSocialChange = (network: keyof SchoolSettings['socialLinks'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [network]: value,
      },
    }));
    setIsSaved(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Please choose an image file under 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setFormData((prev) => ({ ...prev, logoUrl: result }));
        setIsSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview('');
    setFormData((prev) => ({ ...prev, logoUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsSaved(false);
  };

  const handleSave = () => {
    onUpdateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all institutional settings to default?')) {
      setFormData(DEFAULT_SCHOOL_SETTINGS);
      setLogoPreview(DEFAULT_SCHOOL_SETTINGS.logoUrl);
      onUpdateSettings(DEFAULT_SCHOOL_SETTINGS);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3500);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-slate-100 text-slate-700 rounded-xl">
              <Settings className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                School Settings & Institutional Branding
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Configure school logo, color palette, campus address, website portal, and statutory metadata.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>School Settings & Theme Configuration successfully updated and applied across School OS!</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
            Live Synchronized
          </span>
        </div>
      )}

      {/* Sub Navigation Tabs */}
      <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold overflow-x-auto">
        {[
          { id: 'branding', label: 'Brand & Logo Theme', icon: <Palette className="w-4 h-4" /> },
          { id: 'location', label: 'School Address & Website', icon: <Globe className="w-4 h-4" /> },
          { id: 'statutory', label: 'CBSE & Affiliation Info', icon: <Award className="w-4 h-4" /> },
          { id: 'communications', label: 'Helpdesk & Contacts', icon: <Phone className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeSubTab === tab.id
                ? 'bg-white text-red-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* SUBTAB 1: BRANDING, LOGO & THEME COLORS */}
      {activeSubTab === 'branding' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Customization Controls */}
          <div className="lg:col-span-8 space-y-6">
            {/* School Name & Motto */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-red-600" />
                <span>School Name & Institutional Motto</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official School Name
                  </label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => handleTextChange('schoolName', e.target.value)}
                    placeholder="e.g. Baljyoti Public School"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Academic Tagline / Motto
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleTextChange('tagline', e.target.value)}
                    placeholder="e.g. Lead from Darkness unto Light"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* School Logo Upload */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Image className="w-4 h-4 text-red-600" />
                  <span>School Logo & Crest</span>
                </h3>
                <span className="text-[11px] text-slate-500">PNG, JPG, SVG up to 3MB</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Logo Display Box */}
                <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <div
                    className={`w-24 h-24 bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden ${
                      formData.logoShape === 'circle'
                        ? 'rounded-full'
                        : formData.logoShape === 'rounded'
                        ? 'rounded-2xl'
                        : 'rounded-none'
                    }`}
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="School Logo"
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <Building className="w-8 h-8 text-slate-400 mx-auto" />
                        <span className="text-[9px] text-slate-400 font-bold uppercase mt-1 block">Default Crest</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[10px] text-slate-500 font-semibold">Shape:</span>
                    {(['rounded', 'circle', 'square'] as const).map((shape) => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => handleTextChange('logoShape', shape)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize transition cursor-pointer ${
                          formData.logoShape === shape
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload & Actions */}
                <div className="sm:col-span-8 space-y-3">
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                      id="logo-upload"
                    />
                    <div className="flex flex-wrap gap-2">
                      <label
                        htmlFor="logo-upload"
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload New Logo File</span>
                      </label>

                      {logoPreview && (
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Or Direct Image Web URL
                    </label>
                    <input
                      type="url"
                      value={formData.logoUrl || ''}
                      onChange={(e) => {
                        handleTextChange('logoUrl', e.target.value);
                        setLogoPreview(e.target.value);
                      }}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <p className="text-[11px] text-slate-500">
                    The uploaded logo will immediately appear in the top application header, navigation bar, PDF fee receipts, and print reports.
                  </p>
                </div>
              </div>
            </div>

            {/* Theme Color Customization */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-red-600" />
                  <span>Color Theme & Palette</span>
                </h3>
                <span className="text-xs font-bold text-slate-600">
                  Active: <strong className="text-slate-900 capitalize">{formData.themeColor}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {themeColors.map((color) => {
                  const isSelected = formData.themeColor === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => handleTextChange('themeColor', color.id)}
                      className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-center gap-3 text-left ${
                        isSelected
                          ? 'border-slate-900 bg-slate-50 shadow-xs ring-2 ring-slate-900/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl ${color.bgClass} flex items-center justify-center text-white shrink-0 shadow-xs`}
                      >
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-slate-900 truncate">
                          {color.label}
                        </span>
                        <span className="block text-[10px] text-slate-500 font-mono">
                          {color.hex}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Live Header & Badge Preview */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Live App Header Mockup</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Instant
                </span>
              </div>

              {/* Header Preview Box */}
              <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-md space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-8 h-8 bg-white flex items-center justify-center overflow-hidden shrink-0 ${
                        formData.logoShape === 'circle'
                          ? 'rounded-full'
                          : formData.logoShape === 'rounded'
                          ? 'rounded-lg'
                          : 'rounded-none'
                      }`}
                    >
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-0.5" />
                      ) : (
                        <Building className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate leading-tight">
                        {formData.schoolName || 'Baljyoti Public School'}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate">
                        {formData.tagline || 'Integrated School OS'}
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-600 text-white shrink-0">
                    SUPER ADMIN
                  </span>
                </div>

                <div className="text-[10px] text-slate-300 flex items-center justify-between">
                  <span>Domain: @baljyoti.com</span>
                  <span className="text-emerald-400">CBSE Affiliated</span>
                </div>
              </div>

              {/* Summary Card */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Applied Configurations:</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div><strong>School:</strong> {formData.schoolName}</div>
                  <div><strong>Theme:</strong> <span className="capitalize">{formData.themeColor}</span></div>
                  <div><strong>Session:</strong> {formData.academicSession}</div>
                  <div><strong>Principal:</strong> {formData.principalName}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Apply & Save All Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SCHOOL ADDRESS & OFFICIAL WEBSITE */}
      {activeSubTab === 'location' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {/* Website & Online Portals */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Official Website & Web Portals</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official School Website URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.websiteUrl}
                      onChange={(e) => handleTextChange('websiteUrl', e.target.value)}
                      placeholder="https://baljyoti.com"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                    {formData.websiteUrl && (
                      <a
                        href={formData.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 flex items-center gap-1.5 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Visit</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-3 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Institutional Social & Media Channels
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold mb-1">YouTube Channel</span>
                      <input
                        type="url"
                        value={formData.socialLinks.youtube || ''}
                        onChange={(e) => handleSocialChange('youtube', e.target.value)}
                        placeholder="https://youtube.com/@baljyotischool"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold mb-1">LinkedIn Page</span>
                      <input
                        type="url"
                        value={formData.socialLinks.linkedin || ''}
                        onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/school/baljyoti"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold mb-1">Instagram</span>
                      <input
                        type="url"
                        value={formData.socialLinks.instagram || ''}
                        onChange={(e) => handleSocialChange('instagram', e.target.value)}
                        placeholder="https://instagram.com/baljyotischool"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold mb-1">Facebook</span>
                      <input
                        type="url"
                        value={formData.socialLinks.facebook || ''}
                        onChange={(e) => handleSocialChange('facebook', e.target.value)}
                        placeholder="https://facebook.com/baljyotischool"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Campus Physical Address */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Physical Campus Address</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Address Line 1 (Campus / Street / Institutional Area)
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine1}
                    onChange={(e) => handleTextChange('addressLine1', e.target.value)}
                    placeholder="e.g. Baljyoti Knowledge Campus, Institutional Area, Sector 21"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Address Line 2 (Landmark / Near Metro)
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) => handleTextChange('addressLine2', e.target.value)}
                    placeholder="e.g. Near Cyber Expressway & Metro Hub"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleTextChange('city', e.target.value)}
                      placeholder="New Delhi"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">State / Province</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleTextChange('state', e.target.value)}
                      placeholder="Delhi NCR"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pincode / Postal Code</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => handleTextChange('pincode', e.target.value)}
                      placeholder="110075"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleTextChange('country', e.target.value)}
                      placeholder="India"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Google Maps Pin Location Link
                  </label>
                  <input
                    type="url"
                    value={formData.googleMapsUrl}
                    onChange={(e) => handleTextChange('googleMapsUrl', e.target.value)}
                    placeholder="https://maps.google.com/?q=Baljyoti+Public+School"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Address Card Preview */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Contact Card
              </h4>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-sm text-slate-900">{formData.schoolName}</div>
                <div className="text-xs text-slate-600 leading-relaxed">
                  <p>{formData.addressLine1}</p>
                  {formData.addressLine2 && <p>{formData.addressLine2}</p>}
                  <p>{formData.city}, {formData.state} - {formData.pincode}</p>
                  <p>{formData.country}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs space-y-1">
                  <div className="text-slate-600">
                    <strong>Website:</strong>{' '}
                    <a href={formData.websiteUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      {formData.websiteUrl}
                    </a>
                  </div>
                  <div className="text-slate-600">
                    <strong>Email:</strong> {formData.contactEmail}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Address & Web Info</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: CBSE, STATUTORY & AFFILIATION METADATA */}
      {activeSubTab === 'statutory' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Statutory Affiliation & Academic Registration</span>
              </h3>
              <p className="text-xs text-slate-500">
                Official regulatory registrations displayed on fee receipts, report cards, and CBSE submissions.
              </p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
              CBSE Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                CBSE Affiliation Number
              </label>
              <input
                type="text"
                value={formData.affiliationNo}
                onChange={(e) => handleTextChange('affiliationNo', e.target.value)}
                placeholder="CBSE/AFF/2130894/2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                School Code / Center ID
              </label>
              <input
                type="text"
                value={formData.schoolCode}
                onChange={(e) => handleTextChange('schoolCode', e.target.value)}
                placeholder="BPS-DEL-0894"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                National U-DISE+ Code
              </label>
              <input
                type="text"
                value={formData.udiseNumber}
                onChange={(e) => handleTextChange('udiseNumber', e.target.value)}
                placeholder="07010203412"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Academic Session
              </label>
              <input
                type="text"
                value={formData.academicSession}
                onChange={(e) => handleTextChange('academicSession', e.target.value)}
                placeholder="2026-2027"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Operating Campus Hours
              </label>
              <input
                type="text"
                value={formData.operatingHours}
                onChange={(e) => handleTextChange('operatingHours', e.target.value)}
                placeholder="07:30 AM - 03:30 PM (IST)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Head of School / Principal Name
              </label>
              <input
                type="text"
                value={formData.principalName}
                onChange={(e) => handleTextChange('principalName', e.target.value)}
                placeholder="Dr. Sunita Sharma, Ph.D."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Statutory Details</span>
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 4: HELPDESK & COMMUNICATIONS */}
      {activeSubTab === 'communications' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>Institutional Contacts & Automated Helpdesk Lines</span>
            </h3>
            <p className="text-xs text-slate-500">
              Inquiry email addresses and telephone routing for parents, visitors, and emergency SOS alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official General Inquiry Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleTextChange('contactEmail', e.target.value)}
                placeholder="info@baljyoti.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admissions Desk Email
              </label>
              <input
                type="email"
                value={formData.admissionsEmail}
                onChange={(e) => handleTextChange('admissionsEmail', e.target.value)}
                placeholder="admissions@baljyoti.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Campus Reception Phone
              </label>
              <input
                type="tel"
                value={formData.primaryPhone}
                onChange={(e) => handleTextChange('primaryPhone', e.target.value)}
                placeholder="+91 11 2894 5000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Emergency & Fleet SOS Hotline
              </label>
              <input
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => handleTextChange('emergencyPhone', e.target.value)}
                placeholder="+91 98100 44221"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono text-red-600 font-bold"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Contact Information</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
