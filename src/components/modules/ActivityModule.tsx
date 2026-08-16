import React, { useState } from 'react';
import {
  Trophy,
  Sparkles,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  Plus,
  Send,
  Flame,
  Shield,
  Compass,
  Globe,
  Music,
  Cpu,
  Heart,
} from 'lucide-react';
import { SchoolActivityEvent, UserRole } from '../../types';
import { HOUSE_STANDINGS } from '../../data/mockSchoolData';

interface ActivityModuleProps {
  currentRole: UserRole;
  activities: SchoolActivityEvent[];
  onAddActivity: (event: SchoolActivityEvent) => void;
  onOpenCopilotWithPrompt?: (prompt: string) => void;
}

export const ActivityModule: React.FC<ActivityModuleProps> = ({
  currentRole,
  activities,
  onAddActivity,
  onOpenCopilotWithPrompt,
}) => {
  const [housePoints, setHousePoints] = useState(HOUSE_STANDINGS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [selectedEventForNotice, setSelectedEventForNotice] = useState<SchoolActivityEvent | null>(activities[0]);
  const [generatedNotice, setGeneratedNotice] = useState<any>(null);
  const [isGeneratingNotice, setIsGeneratingNotice] = useState(false);

  const filteredEvents = activities.filter((evt) => {
    if (selectedCategory === 'All') return true;
    return evt.category === selectedCategory;
  });

  const handleAwardHousePoints = (houseName: string, pointsToAdd: number) => {
    setHousePoints((prev) =>
      prev.map((h) => (h.name === houseName ? { ...h, points: h.points + pointsToAdd } : h))
    );
  };

  const handleGenerateEventNotice = async (event: SchoolActivityEvent) => {
    setIsGeneratingNotice(true);
    setGeneratedNotice(null);
    try {
      const res = await fetch('/api/gemini/generate-announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: event.title,
          audience: 'Parents & Students',
          moduleCategory: 'Activity',
          keyPoints: `Scheduled for ${event.date} at ${event.venue}. Coordinator: ${event.coordinator}. Highlight: ${event.highlight}. Medical clearance & parent consent sync active.`,
          tone: 'Inspirational, organized, safety-focused',
        }),
      });
      const data = await res.json();
      setGeneratedNotice(data.notice);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingNotice(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Vertical Module 3
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Activity, Sports & House Championship
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Holistic student development tracking across sports, robotics, cultural arts, and inter-house cups.
          </p>
        </div>

        <button
          onClick={() =>
            onOpenCopilotWithPrompt?.(
              'Draft an executive holistic development summary highlighting student extracurricular participation and house points for the Baljyoti Board Meeting.'
            )
          }
          className="flex items-center gap-2 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>Synthesize Activity Report</span>
        </button>
      </div>

      {/* House Championship Leaderboard */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500 text-white rounded-xl">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Annual Baljyoti Inter-House Championship Standings (2026-27)
              </h2>
              <p className="text-xs text-slate-500">
                Points awarded across Academics, Athletics, Debate, STEM & Cultural Arts
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            Leader: Agni House
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {housePoints.map((house) => (
            <div
              key={house.name}
              className="p-4 rounded-xl border transition flex flex-col justify-between"
              style={{
                borderColor: `${house.color}40`,
                backgroundColor: `${house.color}08`,
              }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-black px-2.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: house.color }}
                  >
                    {house.name} House
                  </span>
                  <Award className="w-4 h-4" style={{ color: house.color }} />
                </div>

                <div className="text-3xl font-black text-slate-900 mt-3">{house.points} pts</div>
                <div className="text-[11px] font-semibold text-slate-600 mt-1">{house.emblem}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{house.lead}</div>
              </div>

              {/* Award Points Quick Bar */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Award Points:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleAwardHousePoints(house.name, 25)}
                    className="px-2 py-0.5 text-[10px] font-bold rounded bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs transition cursor-pointer"
                  >
                    +25
                  </button>
                  <button
                    onClick={() => handleAwardHousePoints(house.name, 50)}
                    className="px-2 py-0.5 text-[10px] font-bold rounded bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs transition cursor-pointer"
                  >
                    +50
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Events & Competitions Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Events List (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Upcoming Campus Events & Meets</h3>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
              {['All', 'Sports', 'STEM & Robotics', 'Cultural'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3.5">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-amber-300 transition bg-white space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{evt.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {evt.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>Date: <strong className="text-slate-800">{evt.date}</strong></span>
                      <span>•</span>
                      <span>Venue: {evt.venue}</span>
                      <span>•</span>
                      <span>Coordinator: {evt.coordinator}</span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 self-start">
                    {evt.parentConsentSync} Parent Consents
                  </span>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <strong className="text-slate-800">Event Scope: </strong>
                  {evt.highlight}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">
                    {evt.enrolledStudentsCount} Student Participants
                  </span>

                  <button
                    onClick={() => {
                      setSelectedEventForNotice(evt);
                      handleGenerateEventNotice(evt);
                      setIsNoticeModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition cursor-pointer border border-blue-200"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Notice via Google Workspace</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clubs & Student Talent Tagging Registry (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Future Skills & Club Registries</h3>
            <p className="text-xs text-slate-500">Student talent portfolios indexed for competitions</p>
          </div>

          <div className="space-y-3 text-xs">
            {[
              {
                name: 'Google AI & Robotics Innovation Club',
                members: 64,
                icon: <Cpu className="w-4 h-4 text-blue-600" />,
                lead: 'Aarav Sharma (President)',
              },
              {
                name: 'Baljyoti Model United Nations (MUN)',
                members: 52,
                icon: <Globe className="w-4 h-4 text-indigo-600" />,
                lead: 'Tanvi Iyer (Secretary General)',
              },
              {
                name: 'Western & Indian Classical Music Society',
                members: 48,
                icon: <Music className="w-4 h-4 text-purple-600" />,
                lead: 'Sanya Gupta (Lead Violinist)',
              },
              {
                name: 'Eco Warriors & Sustainability Guild',
                members: 76,
                icon: <Heart className="w-4 h-4 text-emerald-600" />,
                lead: 'Ishaan Malhotra (Convener)',
              },
            ].map((club) => (
              <div key={club.name} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  {club.icon}
                  <span>{club.name}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1">
                  <span>{club.lead}</span>
                  <span className="font-bold text-slate-800">{club.members} Members</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notice Generator Modal */}
      {isNoticeModalOpen && selectedEventForNotice && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500 text-white rounded-xl">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Automated Google Workspace Notice Dispatcher
                  </h3>
                  <p className="text-xs text-slate-500">{selectedEventForNotice.title}</p>
                </div>
              </div>
              <button
                onClick={() => setIsNoticeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {isGeneratingNotice ? (
              <div className="py-12 text-center text-xs text-slate-500">
                <Sparkles className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-2" />
                <span>Gemini API composing formal school circular & SMS alert...</span>
              </div>
            ) : generatedNotice ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Email Subject:</span>
                  <span className="font-bold text-slate-900">{generatedNotice.subject}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 max-h-52 overflow-y-auto whitespace-pre-line text-slate-700 leading-relaxed font-mono text-[11px]">
                  {generatedNotice.content}
                </div>

                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                  <strong>SMS Gateway Snippet: </strong>
                  {generatedNotice.smsSnippet}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500">
                    Channels: {generatedNotice.channels?.join(' • ')}
                  </div>
                  <button
                    onClick={() => setIsNoticeModalOpen(false)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Broadcast to All Parents & Students
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
