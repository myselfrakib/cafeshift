import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ApplicantCard from './ApplicantCard';
import AddCafeModal from './AddCafeModal';
import {
  PlusCircle,
  MapPin,
  Plus,
  Edit3,
  Store,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  DollarSign,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  UserCheck,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { formatDateDDMMYYYY, formatTime12Hour } from '../utils/dateTime';

export default function OwnerCafeView() {
  const {
    currentUser,
    activeCafe,
    ownerCafes,
    shifts,
    jobs,
    setSelectedCafeId,
    setCreateShiftModalOpen,
    setCreateJobModalOpen,
    cancelShiftApplication,
    deleteShift,
    deleteJob,
    toggleJobStatus,
    showToast
  } = useApp();

  const [mainSection, setMainSection] = useState('shifts'); // 'shifts' | 'jobs'
  const [cafeTab, setCafeTab] = useState('booked'); // 'booked' | 'open'
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [addCafeModalOpen, setAddCafeModalOpen] = useState(false);
  const [editingCafe, setEditingCafe] = useState(null);

  const cafe = activeCafe;

  if (!cafe) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white rounded-[3px] border border-stone-200 shadow-sm mt-6 space-y-4">
        <div className="w-12 h-12 rounded-[3px] bg-stone-100 flex items-center justify-center text-2xl mx-auto border border-stone-200">
          ☕
        </div>
        <h3 className="text-lg font-bold font-headline text-[#0A011C] uppercase">No Cafe Registered Yet</h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Register your first cafe or restaurant branch to start posting shift offers and job opportunities for college students.
        </p>
        <button
          onClick={() => {
            setEditingCafe(null);
            setAddCafeModalOpen(true);
          }}
          className="px-5 py-2.5 bg-[#FF0046] hover:bg-[#E6003F] text-white font-bold text-xs uppercase tracking-wider rounded-[3px] transition-colors shadow-sm inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Register Your Cafe</span>
        </button>
        <AddCafeModal
          isOpen={addCafeModalOpen}
          onClose={() => setAddCafeModalOpen(false)}
          editCafe={null}
        />
      </div>
    );
  }

  // Helper to get numeric timestamp for sorting shifts & jobs
  const getTimestamp = (item) => {
    if (!item) return 0;
    if (item.createdAt) {
      const t = new Date(item.createdAt).getTime();
      if (!isNaN(t)) return t;
    }
    if (item.id && typeof item.id === 'string') {
      const num = parseInt(item.id.replace(/^(shift|job)-/, ''));
      if (!isNaN(num)) return num;
    }
    return 0;
  };

  // Filter shifts belonging to this cafe, ordered latest first
  const cafeShifts = [...(shifts || []).filter(s => s.cafeId === cafe.id)].sort((a, b) => getTimestamp(b) - getTimestamp(a));
  const bookedShifts = cafeShifts.filter(s => s.status === 'booked');
  const openShifts = cafeShifts.filter(s => s.status === 'open');

  // Filter jobs belonging to this cafe, ordered latest first
  const cafeJobs = [...(jobs || []).filter(j => j.cafeId === cafe.id)].sort((a, b) => getTimestamp(b) - getTimestamp(a));
  const totalJobApplicants = cafeJobs.reduce((acc, j) => acc + (j.applicants?.length || 0), 0);

  const handleCompleteShift = (shiftId) => {
    showToast('Shift marked completed & paid.', 'success', '✓');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Slidable Cafe Outlets Bar at the Top */}
      <div className="bg-white rounded-[3px] p-3 sm:p-3.5 border border-stone-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between gap-2 px-0.5">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[#FF0046]" />
            <h2 className="text-xs font-bold font-headline text-[#0A011C] uppercase tracking-wider">
              Your Cafe Outlets ({ownerCafes.length})
            </h2>
          </div>
          <span className="text-[11px] text-stone-600 hidden sm:inline">
            Slide to switch outlet
          </span>
        </div>

        {/* Slidable Outlets Strip */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scroll-smooth">
          {ownerCafes.map(c => {
            const cShifts = (shifts || []).filter(s => s.cafeId === c.id);
            const cJobs = (jobs || []).filter(j => j.cafeId === c.id);
            const bookedCount = cShifts.filter(s => s.status === 'booked').length;
            const openCount = cShifts.filter(s => s.status === 'open').length;
            const jobsCount = cJobs.length;
            const isActive = c.id === cafe.id;

            return (
              <div
                key={c.id}
                onClick={() => setSelectedCafeId(c.id)}
                className={`shrink-0 flex items-center gap-2.5 px-3 py-2 rounded-[3px] border transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#0A011C] text-white border-[#0A011C] shadow-sm'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                {/* Outlet Mini Photo / Avatar */}
                <div className={`w-8 h-8 rounded-[2px] overflow-hidden flex items-center justify-center font-bold text-xs shrink-0 ${
                  isActive ? 'bg-[#FF0046] text-white' : 'bg-stone-200 text-stone-700'
                }`}>
                  {c.photoUrl ? (
                    <img
                      src={c.photoUrl}
                      alt={c.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <span>{c.name ? c.name.slice(0, 2).toUpperCase() : '☕'}</span>
                  )}
                </div>

                {/* Outlet Name & Area */}
                <div className="text-left min-w-[90px] max-w-[140px]">
                  <div className={`text-xs font-bold font-headline uppercase tracking-tight truncate ${
                    isActive ? 'text-white' : 'text-[#0A011C]'
                  }`}>
                    {c.name}
                  </div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-stone-300' : 'text-stone-700'}`}>
                    {c.area}
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-1 pl-1">
                  <span className={`px-1.5 py-0.2 rounded-[2px] text-[9px] font-bold font-mono ${
                    isActive
                      ? (openCount > 0 ? 'bg-[#FF0046] text-white' : 'bg-white/10 text-stone-300')
                      : (openCount > 0 ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-stone-200/60 text-stone-600')
                  }`}>
                    {openCount} Shifts
                  </span>
                  {jobsCount > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-[2px] text-[9px] font-bold font-mono ${
                      isActive ? 'bg-[#00DADC] text-black font-bold' : 'bg-[#00DADC]/20 text-[#006062] border border-[#00DADC]/40 font-bold'
                    }`}>
                      {jobsCount} Jobs
                    </span>
                  )}

                  {/* Inline Edit Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCafe(c);
                      setAddCafeModalOpen(true);
                    }}
                    className={`p-1 rounded-[2px] transition-colors ml-0.5 ${
                      isActive ? 'text-stone-300 hover:text-white hover:bg-white/10' : 'text-stone-600 hover:text-[#0A011C] hover:bg-stone-200'
                    }`}
                    title={`Edit ${c.name}`}
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* SINGLE Add Another Cafe Button */}
          <button
            type="button"
            onClick={() => {
              setEditingCafe(null);
              setAddCafeModalOpen(true);
            }}
            className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-[3px] border border-dashed border-stone-300 hover:border-[#FF0046] hover:bg-[#FF0046]/5 text-stone-600 hover:text-[#FF0046] transition-all cursor-pointer group select-none"
            title="Add another cafe outlet in Kolkata"
          >
            <div className="w-8 h-8 rounded-[2px] bg-stone-100 group-hover:bg-[#FF0046] group-hover:text-white text-stone-500 flex items-center justify-center transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <div className="text-left pr-1">
              <div className="text-xs font-bold font-headline uppercase tracking-wider text-[#0A011C] group-hover:text-[#FF0046] transition-colors leading-tight">
                Add Another Cafe
              </div>
              <div className="text-[10px] text-stone-600">
                New Outlet
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Active Cafe Focus Header Banner with BOTH Creation Actions */}
      <div className="bg-white rounded-[3px] border border-stone-200 p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-[3px] bg-stone-50 border border-stone-200 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            {cafe.photoUrl ? (
              <img
                src={cafe.photoUrl}
                alt={cafe.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <span className="font-headline font-bold text-xl text-[#FF0046]">
                {cafe.name ? cafe.name.slice(0, 2).toUpperCase() : '☕'}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] bg-[#00DADC] text-black">
                {cafe.area}, Kolkata
              </span>
              <button
                onClick={() => {
                  setEditingCafe(cafe);
                  setAddCafeModalOpen(true);
                }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-stone-100 hover:bg-stone-200 text-stone-600 text-[10px] font-bold uppercase tracking-wider border border-stone-200 transition-colors"
                title="Edit Cafe Details"
              >
                <Edit3 className="w-3 h-3 text-stone-500" />
                <span>Edit Info</span>
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-headline font-bold text-[#0A011C] uppercase tracking-tight mt-1">
              {cafe.name}
            </h1>
            <p className="text-xs text-stone-500 mt-1 max-w-lg leading-relaxed">
              {cafe.description}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-[#FF0046]" />
              <span>{cafe.address}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: 1. Publish Shift Offer, 2. Post Job Opening */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
          <button
            onClick={() => setCreateShiftModalOpen(true)}
            className="bg-[#FF0046] hover:bg-[#E6003F] text-white font-bold uppercase tracking-wider px-5 py-2.5 rounded-[3px] transition-colors flex items-center justify-center gap-2 text-xs shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Shift Offer</span>
          </button>

          <button
            onClick={() => setCreateJobModalOpen(true)}
            className="bg-[#0A011C] hover:bg-stone-800 text-white font-bold uppercase tracking-wider px-5 py-2.5 rounded-[3px] transition-colors flex items-center justify-center gap-2 text-xs shadow-sm border border-stone-700"
          >
            <Briefcase className="w-4 h-4 text-[#00DADC]" />
            <span>Post Job Opening</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-[3px] border border-stone-200 shadow-sm">
          <span className="text-[11px] font-bold text-stone-600 block uppercase tracking-wider font-headline">
            Booked Shifts
          </span>
          <div className="text-2xl font-headline font-bold text-[#0A011C] mt-1">
            {bookedShifts.length}
          </div>
          <p className="text-[11px] text-[#008b8d] font-semibold mt-0.5">Ready to contact</p>
        </div>

        <div className="bg-white p-4 rounded-[3px] border border-stone-200 shadow-sm">
          <span className="text-[11px] font-bold text-stone-600 block uppercase tracking-wider font-headline">
            Live Shifts
          </span>
          <div className="text-2xl font-headline font-bold text-[#0A011C] mt-1">
            {openShifts.length}
          </div>
          <p className="text-[11px] text-[#FE9900] font-semibold mt-0.5">Listed for students</p>
        </div>

        <div className="bg-white p-4 rounded-[3px] border border-stone-200 shadow-sm">
          <span className="text-[11px] font-bold text-stone-600 block uppercase tracking-wider font-headline">
            Job Openings
          </span>
          <div className="text-2xl font-headline font-bold text-[#FF0046] mt-1">
            {cafeJobs.length}
          </div>
          <p className="text-[11px] text-[#0A011C] font-semibold mt-0.5">{totalJobApplicants} total applicants</p>
        </div>

        <div className="bg-white p-4 rounded-[3px] border border-stone-200 shadow-sm">
          <span className="text-[11px] font-bold text-stone-600 block uppercase tracking-wider font-headline">
            Owner Contact
          </span>
          <div className="text-sm font-bold text-[#0A011C] mt-1 font-mono">
            +91 {currentUser?.phone}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">{currentUser?.name}</p>
        </div>
      </div>

      {/* TOP-LEVEL OPPORTUNITY TYPE SWITCHER (Shifts vs Jobs) */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          type="button"
          onClick={() => setMainSection('shifts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-[3px] font-headline text-xs sm:text-sm font-bold uppercase tracking-wider transition-all ${
            mainSection === 'shifts'
              ? 'bg-[#0A011C] text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
          }`}
        >
          <span>⚡ Hourly Shifts</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-[2px] font-mono ${
            mainSection === 'shifts' ? 'bg-[#FF0046] text-white' : 'bg-stone-100 text-stone-600'
          }`}>
            {cafeShifts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setMainSection('jobs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-[3px] font-headline text-xs sm:text-sm font-bold uppercase tracking-wider transition-all ${
            mainSection === 'jobs'
              ? 'bg-[#0A011C] text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
          }`}
        >
          <Briefcase className={`w-3.5 h-3.5 ${mainSection === 'jobs' ? 'text-[#00DADC]' : 'text-stone-400'}`} />
          <span>💼 Job Opportunities</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-[2px] font-mono ${
            mainSection === 'jobs' ? 'bg-[#00DADC] text-black font-bold' : 'bg-stone-100 text-stone-600'
          }`}>
            {cafeJobs.length}
          </span>
        </button>
      </div>

      {/* SECTION 1: SHIFTS MANAGEMENT */}
      {mainSection === 'shifts' && (
        <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-stone-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <h3 className="text-lg font-headline font-bold text-[#0A011C] uppercase tracking-tight">
                Hourly Shift Offers & Bookings
              </h3>
              <p className="text-xs text-stone-500">
                Managing hourly shifts at <strong className="text-stone-800">{cafe.name}</strong> ({cafe.area}). When a student applies, the slot locks instantly.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-[3px] border border-stone-200 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setCafeTab('booked')}
                className={`px-3 py-1.5 rounded-[3px] transition-colors ${
                  cafeTab === 'booked' ? 'bg-[#FF0046] text-white shadow-xs' : 'text-stone-600 hover:text-[#0A011C]'
                }`}
              >
                Booked Candidates ({bookedShifts.length})
              </button>
              <button
                onClick={() => setCafeTab('open')}
                className={`px-3 py-1.5 rounded-[3px] transition-colors ${
                  cafeTab === 'open' ? 'bg-[#00DADC] text-black shadow-xs' : 'text-stone-600 hover:text-[#0A011C]'
                }`}
              >
                Open Shifts ({openShifts.length})
              </button>
            </div>
          </div>

          {/* BOOKED SHIFTS LIST */}
          {cafeTab === 'booked' && (
            <div className="space-y-4">
              {bookedShifts.length === 0 ? (
                <div className="text-center py-12 px-4 bg-stone-50 rounded-[3px] border border-dashed border-stone-200">
                  <div className="text-2xl mb-1 text-[#FF0046]">📋</div>
                  <h4 className="text-sm font-bold text-[#0A011C] font-headline uppercase">No Booked Candidates Yet for {cafe.name}</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-3">
                    When a student taps "Apply" on a shift at this cafe, their profile and contact buttons will appear here immediately.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {bookedShifts.map(shift => (
                    <ApplicantCard
                      key={shift.id}
                      shift={shift}
                      onComplete={handleCompleteShift}
                      onCancel={cancelShiftApplication}
                      onDelete={deleteShift}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* OPEN SHIFTS LIST */}
          {cafeTab === 'open' && (
            <div className="space-y-4">
              {openShifts.length === 0 ? (
                <div className="text-center py-12 px-4 bg-stone-50 rounded-[3px] border border-dashed border-stone-200">
                  <h4 className="text-sm font-bold text-[#0A011C] font-headline uppercase">No Open Shifts for {cafe.name}</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-3">
                    Publish a shift offer to find students for your upcoming rush hours.
                  </p>
                  <button
                    onClick={() => setCreateShiftModalOpen(true)}
                    className="px-4 py-2 bg-[#FF0046] hover:bg-[#E6003F] text-white rounded-[3px] text-xs font-bold uppercase tracking-wider shadow-xs"
                  >
                    Create Shift Offer
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {openShifts.map(shift => (
                    <div
                      key={shift.id}
                      className="p-4 rounded-[3px] border border-stone-200 bg-stone-50 flex flex-col justify-between text-xs hover:border-stone-300 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#00DADC]/15 text-[#008b8d] px-2 py-0.5 rounded-[3px] border border-[#00DADC]/30">
                            Active on Feed
                          </span>
                          <span className="font-bold text-[#008b8d] font-headline text-sm">
                            ₹{shift.hourlyWage}/hr · ₹{shift.totalEarnings} total
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-[#0A011C] font-headline uppercase">{shift.roleName}</h4>
                        <div className="text-stone-500 mt-2 space-y-1">
                          <div>Date: <strong className="text-stone-700">{formatDateDDMMYYYY(shift.date)}</strong></div>
                          <div>Timing: <strong className="text-stone-700">{formatTime12Hour(shift.startTime)} – {formatTime12Hour(shift.endTime)}</strong> ({shift.durationHours} hrs)</div>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-stone-200 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-stone-600 font-medium">Unbooked · Available on feed</span>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete the shift offer "${shift.roleName}"? It will be permanently removed from the feed.`)) {
                              deleteShift(shift.id);
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-[3px] border border-stone-200 hover:border-rose-300 bg-white hover:bg-rose-50 text-stone-600 hover:text-[#FF0046] font-bold text-[11px] uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Shift</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: JOB OPENINGS MANAGEMENT */}
      {mainSection === 'jobs' && (
        <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-stone-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <h3 className="text-lg font-headline font-bold text-[#0A011C] uppercase tracking-tight">
                Job Openings & Student Applicants
              </h3>
              <p className="text-xs text-stone-500">
                Full-time and ongoing positions at <strong className="text-stone-800">{cafe.name}</strong>. Review student applicant profiles and call candidates directly.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCreateJobModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF0046] hover:bg-[#E6003F] text-white rounded-[3px] text-xs font-bold uppercase tracking-wider shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post New Job Opening</span>
            </button>
          </div>

          {cafeJobs.length === 0 ? (
            <div className="text-center py-12 px-4 bg-stone-50 rounded-[3px] border border-dashed border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-xl">
                💼
              </div>
              <h4 className="text-sm font-bold text-[#0A011C] font-headline uppercase">
                No Job Openings Posted Yet for {cafe.name}
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Need a Head Barista, Floor Supervisor, Baker, or Cashier? Post an opening with salary, schedule, and requirements.
              </p>
              <button
                type="button"
                onClick={() => setCreateJobModalOpen(true)}
                className="px-5 py-2.5 bg-[#0A011C] hover:bg-stone-800 text-white rounded-[3px] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#00DADC]" />
                <span>Post Job Opening</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cafeJobs.map(job => {
                const applicants = job.applicants || [];
                const isExpanded = expandedJobId === job.id;

                return (
                  <div
                    key={job.id}
                    className="p-5 rounded-[3px] border border-stone-200 bg-white shadow-2xs hover:border-stone-300 transition-all space-y-4"
                  >
                    {/* Header: Title, Badges, Salary */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-[#0A011C] text-white">
                            {job.employmentType}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] ${
                            job.status === 'closed'
                              ? 'bg-stone-100 text-stone-500'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {job.status === 'closed' ? 'Closed' : 'Active Hiring'}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-[#00DADC]/20 text-[#006062]">
                            ⚡ Starts: {job.startingDate}
                          </span>
                        </div>
                        <h4 className="text-lg font-headline font-bold uppercase tracking-tight text-[#0A011C]">
                          {job.positionTitle}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-stone-500 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            {job.workSchedule} · {job.workHours}
                          </span>
                        </div>
                      </div>

                      {/* Salary Display */}
                      <div className="text-left sm:text-right shrink-0">
                        <div className="text-xl font-headline font-bold text-[#FF0046]">
                          ₹{Number(job.salaryAmount).toLocaleString('en-IN')}
                          <span className="text-xs text-stone-500 uppercase font-sans"> / {job.salaryPeriod}</span>
                        </div>
                        <div className="text-[11px] font-bold text-stone-500 uppercase mt-0.5">
                          {applicants.length} {applicants.length === 1 ? 'Applicant' : 'Applicants'}
                        </div>
                      </div>
                    </div>

                    {/* Requirements pills */}
                    {job.requirements && job.requirements.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Requirements:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {job.requirements.map(req => (
                            <span
                              key={req}
                              className="px-2 py-0.5 rounded-[2px] bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium"
                            >
                              ✓ {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Perks pills */}
                    {job.perks && job.perks.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Included Perks:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {job.perks.map(perk => (
                            <span
                              key={perk}
                              className="px-2 py-0.5 rounded-[2px] bg-amber-50/70 border border-amber-200 text-amber-900 text-xs font-medium"
                            >
                              ★ {perk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {job.description && (
                      <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-[2px] border border-stone-200/60 leading-relaxed">
                        {job.description}
                      </p>
                    )}

                    {/* Management Bar & Applicants Expander */}
                    <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-xs font-headline font-bold uppercase tracking-wider transition-colors border ${
                          isExpanded
                            ? 'bg-[#0A011C] text-white border-[#0A011C]'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5 text-[#00DADC]" />
                        <span>View Applicants ({applicants.length})</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleJobStatus(job.id)}
                          className="px-2.5 py-1.5 rounded-[3px] border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-medium transition-colors"
                        >
                          {job.status === 'closed' ? 'Reopen Job' : 'Close Job'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Permanently remove job opening "${job.positionTitle}"?`)) {
                              deleteJob(job.id);
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-[3px] border border-stone-200 hover:border-red-300 hover:bg-red-50 text-stone-500 hover:text-[#FF0046] text-xs font-medium transition-colors inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* EXPANDED APPLICANTS LIST */}
                    {isExpanded && (
                      <div className="pt-3 space-y-3 bg-stone-50/80 -mx-5 -mb-5 p-5 border-t border-stone-200 rounded-b-[3px]">
                        <div className="flex items-center justify-between">
                          <h5 className="font-headline text-xs font-bold uppercase tracking-wider text-[#0A011C]">
                            Student Applicants for {job.positionTitle} ({applicants.length})
                          </h5>
                          <span className="text-[11px] text-stone-500">Contact candidates directly</span>
                        </div>

                        {applicants.length === 0 ? (
                          <div className="text-center py-6 bg-white rounded-[3px] border border-stone-200 text-xs text-stone-500">
                            No student applications received yet. Your job opening is live on the student feed.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {applicants.map((app, idx) => (
                              <div
                                key={app.userId || idx}
                                className="bg-white p-4 rounded-[3px] border border-stone-200 shadow-2xs space-y-3"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-[3px] bg-stone-900 text-white font-headline font-bold text-xs flex items-center justify-center shrink-0">
                                      {app.name ? app.name.slice(0, 2).toUpperCase() : 'ST'}
                                    </div>
                                    <div>
                                      <h6 className="font-bold text-sm text-[#0A011C] leading-snug">
                                        {app.name}
                                      </h6>
                                      <p className="text-[11px] text-stone-500 flex items-center gap-1">
                                        <GraduationCap className="w-3 h-3 text-[#FF0046]" />
                                        {app.college || 'Kolkata Student'} · Age {app.age || 19}
                                      </p>
                                    </div>
                                  </div>

                                  <span className="text-[10px] text-stone-400 font-mono">
                                    {app.appliedAt ? formatDateDDMMYYYY(app.appliedAt) : 'Recently'}
                                  </span>
                                </div>

                                {app.note && (
                                  <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-[2px] border border-stone-200 italic">
                                    "{app.note}"
                                  </p>
                                )}

                                {/* Direct Call & WhatsApp Buttons */}
                                <div className="flex items-center gap-2 pt-1">
                                  <a
                                    href={`tel:+91${app.phone}`}
                                    className="flex-1 py-1.5 px-3 rounded-[3px] bg-[#0A011C] hover:bg-stone-800 text-white text-xs font-headline font-bold uppercase tracking-wider text-center inline-flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                                  >
                                    <Phone className="w-3.5 h-3.5 text-[#00DADC]" />
                                    <span>Call +91 {app.phone}</span>
                                  </a>

                                  <a
                                    href={`https://wa.me/91${app.phone}?text=${encodeURIComponent(`Hi ${app.name}, contacting you from ${cafe.name} regarding your application for ${job.positionTitle} on Calcutta Cafe Club!`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="py-1.5 px-3 rounded-[3px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-headline font-bold uppercase tracking-wider text-center inline-flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>WhatsApp</span>
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Cafe Modal */}
      <AddCafeModal
        isOpen={addCafeModalOpen}
        onClose={() => {
          setAddCafeModalOpen(false);
          setEditingCafe(null);
        }}
        editCafe={editingCafe}
      />

    </div>
  );
}
