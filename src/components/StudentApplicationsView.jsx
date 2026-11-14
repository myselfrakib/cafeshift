import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, CalendarCheck, Briefcase, Clock, Check, ArrowRight, Store, Phone, Award } from 'lucide-react';
import { formatDateDDMMYYYY, formatTime12Hour } from '../utils/dateTime';

export default function StudentApplicationsView() {
  const { shifts, jobs, currentUser, cancelShiftApplication, setActiveTab } = useApp();
  const [appType, setAppType] = useState('shifts'); // 'shifts' | 'jobs'

  const getShiftTime = (s) => {
    if (!s) return 0;
    if (s.createdAt) {
      const t = new Date(s.createdAt).getTime();
      if (!isNaN(t)) return t;
    }
    if (s.id && typeof s.id === 'string' && s.id.startsWith('shift-')) {
      const t = parseInt(s.id.replace('shift-', ''));
      if (!isNaN(t)) return t;
    }
    return 0;
  };

  const getJobTime = (j) => {
    if (!j) return 0;
    if (j.createdAt) {
      const t = new Date(j.createdAt).getTime();
      if (!isNaN(t)) return t;
    }
    if (j.id && typeof j.id === 'string' && j.id.startsWith('job-')) {
      const t = parseInt(j.id.replace('job-', ''));
      if (!isNaN(t)) return t;
    }
    return 0;
  };

  const studentShifts = [...(shifts || []).filter(
    s => s.status === 'booked' && (s.applicant?.userId === currentUser?.id || s.applicant?.email === currentUser?.email)
  )].sort((a, b) => getShiftTime(b) - getShiftTime(a));

  const appliedJobs = [...(jobs || []).filter(
    j => (j.applicants || []).some(a => a.userId === currentUser?.id || a.email === currentUser?.email)
  )].sort((a, b) => getJobTime(b) - getJobTime(a));

  const totalEarningsBooked = studentShifts.reduce((acc, s) => acc + (s.totalEarnings || 0), 0);
  const totalHoursBooked = studentShifts.reduce((acc, s) => acc + (s.durationHours || 0), 0);

  return (
    <div className="space-y-4 pb-12">
      
      {/* Switcher: Shifts vs Job Applications */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setAppType('shifts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-[3px] font-headline text-xs sm:text-sm font-bold uppercase tracking-wider transition-all ${
            appType === 'shifts'
              ? 'bg-[#0A011C] text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
          }`}
        >
          <span>⚡ Booked Shifts</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-[2px] font-mono ${
            appType === 'shifts' ? 'bg-[#00DADC] text-black font-bold' : 'bg-stone-100 text-stone-600'
          }`}>
            {studentShifts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAppType('jobs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-[3px] font-headline text-xs sm:text-sm font-bold uppercase tracking-wider transition-all ${
            appType === 'jobs'
              ? 'bg-[#0A011C] text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
          }`}
        >
          <Briefcase className={`w-3.5 h-3.5 ${appType === 'jobs' ? 'text-[#00DADC]' : 'text-stone-400'}`} />
          <span>💼 Job Applications</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-[2px] font-mono ${
            appType === 'jobs' ? 'bg-[#FF0046] text-white font-bold' : 'bg-stone-100 text-stone-600'
          }`}>
            {appliedJobs.length}
          </span>
        </button>
      </div>

      {/* SECTION 1: BOOKED SHIFTS */}
      {appType === 'shifts' && (
        <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-headline font-bold text-[#0A011C] uppercase tracking-tight flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-[#00DADC]" />
                  <span>My Booked Shifts</span>
                </h2>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-[2px] bg-cyan-50 text-[#006062] border border-cyan-200">
                  Confirmed
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Confirmed shifts locked exclusively for you. The cafe owner will contact you directly on +91 {currentUser?.phone}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-stone-50 rounded-[3px] px-3.5 py-1.5 border border-stone-200 text-right">
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider font-headline">
                  Upcoming Earnings
                </span>
                <div className="text-base font-headline font-bold text-[#FF0046]">
                  ₹{totalEarningsBooked} <span className="text-[11px] text-stone-500 font-normal">({totalHoursBooked} hrs)</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('browse')}
                className="text-xs font-bold uppercase tracking-wider text-black bg-stone-100 hover:bg-[#FF0046] hover:text-white px-3.5 py-2 rounded-[3px] border border-stone-200 transition-colors shadow-2xs"
              >
                + Browse Shifts
              </button>
            </div>
          </div>

          {studentShifts.length === 0 ? (
            <div className="text-center py-12 px-4 bg-stone-50 rounded-[3px] border border-dashed border-stone-200 space-y-2">
              <h4 className="text-sm font-bold text-[#0A011C] font-headline uppercase">No Booked Shifts</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mb-3">
                Explore open shifts across Kolkata cafes and tap "Apply Now" to book your spot.
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="bg-[#FF0046] hover:bg-[#E6003F] text-white font-bold uppercase tracking-wider text-xs px-4 py-2 rounded-[3px] shadow-xs"
              >
                Browse Shifts
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentShifts.map(shift => (
                <div
                  key={shift.id}
                  className="bg-stone-50 rounded-[3px] p-4 border border-stone-200 flex flex-col justify-between text-xs space-y-3 hover:border-stone-300 transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-headline font-bold text-base text-[#0A011C] uppercase">
                          {shift.cafeName}
                        </h4>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#FF0046]" />
                          <span>{shift.cafeArea}, Kolkata</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#00DADC]/20 text-[#008b8d] border border-[#00DADC]/40 px-2 py-0.5 rounded-[3px]">
                        Booked
                      </span>
                    </div>

                    <h3 className="font-headline text-base font-bold text-[#0A011C] mb-2 uppercase">
                      {shift.roleName}
                    </h3>

                    <div className="bg-white rounded-[3px] p-2.5 border border-stone-200 space-y-1 text-xs">
                      <div className="flex justify-between text-[#0A011C] font-semibold">
                        <span>Date:</span>
                        <span>{formatDateDDMMYYYY(shift.date)}</span>
                      </div>
                      <div className="flex justify-between text-stone-500">
                        <span>Time:</span>
                        <span>{formatTime12Hour(shift.startTime)} – {formatTime12Hour(shift.endTime)} ({shift.durationHours} hrs)</span>
                      </div>
                      <div className="flex justify-between text-stone-500">
                        <span>Rate:</span>
                        <span>₹{shift.hourlyWage}/hr</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                    <div className="font-headline text-sm font-bold text-[#FF0046]">
                      ₹{shift.totalEarnings} Total Pay
                    </div>
                    <button
                      onClick={() => cancelShiftApplication(shift.id)}
                      className="text-stone-400 hover:text-[#FF0046] text-[11px] font-bold uppercase tracking-wider transition-colors"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: JOB APPLICATIONS */}
      {appType === 'jobs' && (
        <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-headline font-bold text-[#0A011C] uppercase tracking-tight flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#FF0046]" />
                  <span>My Job Applications</span>
                </h2>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-[2px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {appliedJobs.length} Active
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Your submitted job applications at Kolkata cafes. The owner reviews your profile and contacts you on +91 {currentUser?.phone}.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('browse')}
              className="text-xs font-bold uppercase tracking-wider text-black bg-stone-100 hover:bg-[#0A011C] hover:text-white px-3.5 py-2 rounded-[3px] border border-stone-200 transition-colors shadow-2xs self-start sm:self-auto"
            >
              + Browse Jobs
            </button>
          </div>

          {appliedJobs.length === 0 ? (
            <div className="text-center py-12 px-4 bg-stone-50 rounded-[3px] border border-dashed border-stone-200 space-y-2">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-xl">
                💼
              </div>
              <h4 className="text-sm font-bold text-[#0A011C] font-headline uppercase">No Job Applications Yet</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mb-3">
                Looking for regular positions like Barista, Floor Supervisor, or Cashier? Browse available openings across Kolkata.
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="bg-[#0A011C] hover:bg-[#FF0046] text-white font-bold uppercase tracking-wider text-xs px-4 py-2 rounded-[3px] shadow-xs"
              >
                Explore Job Openings
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appliedJobs.map(job => {
                const myApp = (job.applicants || []).find(
                  a => a.userId === currentUser?.id || a.email === currentUser?.email
                );

                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-[3px] p-5 border border-stone-200 hover:border-stone-300 shadow-2xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0A011C] text-white px-2 py-0.5 rounded-[2px]">
                            {job.employmentType}
                          </span>
                          <h4 className="font-headline font-bold text-base text-[#0A011C] uppercase mt-1">
                            {job.positionTitle}
                          </h4>
                          <p className="text-xs text-stone-600 font-medium">
                            {job.cafeName} · {job.cafeArea}, Kolkata
                          </p>
                        </div>

                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-[2px] shrink-0 inline-flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Under Review</span>
                        </span>
                      </div>

                      <div className="bg-stone-50 rounded-[3px] p-3 border border-stone-200 space-y-1 text-xs">
                        <div className="flex justify-between font-bold text-[#0A011C]">
                          <span>Offered Salary:</span>
                          <span className="text-[#FF0046]">₹{Number(job.salaryAmount).toLocaleString('en-IN')} / {job.salaryPeriod}</span>
                        </div>
                        <div className="flex justify-between text-stone-500">
                          <span>Starting Day:</span>
                          <span className="text-stone-700 font-medium">{job.startingDate}</span>
                        </div>
                        <div className="flex justify-between text-stone-500">
                          <span>Work Schedule:</span>
                          <span className="text-stone-700 font-medium">{job.workSchedule}</span>
                        </div>
                      </div>

                      {myApp?.note && (
                        <div className="mt-2 text-xs text-stone-500 bg-stone-50/70 p-2 rounded-[2px] border border-stone-100 italic">
                          Your note: "{myApp.note}"
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span>Applied: <strong className="text-stone-700">{myApp?.appliedAt ? formatDateDDMMYYYY(myApp.appliedAt) : 'Recently'}</strong></span>
                      <span className="text-[11px] text-[#008b8d] font-semibold">Cafe has your profile</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
