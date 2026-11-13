import React from 'react';
import { Phone, MessageCircle, MapPin, GraduationCap, Calendar, Clock } from 'lucide-react';

export default function ApplicantCard({ shift, onComplete, onCancel }) {
  const applicant = shift.applicant;

  if (!applicant) return null;

  const cleanPhone = applicant.phone ? applicant.phone.replace(/\D/g, '') : '';
  const waPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const waText = encodeURIComponent(
    `Hello ${applicant.name}! This is regarding your booked shift at ${shift.cafeName} for "${shift.roleName}" on ${shift.date} (${shift.startTime}). We are excited to confirm your shift!`
  );
  const waUrl = `https://wa.me/${waPhone}?text=${waText}`;

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Student Profile Info */}
        <div className="flex items-start gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-3xl shrink-0 shadow-inner">
            {applicant.mascot || '🐼'}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base sm:text-lg font-bold text-white font-bubble">
                {applicant.name}
              </h4>
              <span className="text-[10px] font-bold bg-white/[0.08] text-white/80 px-2 py-0.5 rounded-full border border-white/[0.1]">
                {applicant.gender || 'Student'} · {applicant.age} yrs
              </span>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Booked Candidate</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-white/60 mt-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>{applicant.college || 'Kolkata College Student'}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-white/60 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>{applicant.address || 'Kolkata'}</span>
            </div>
          </div>
        </div>

        {/* Payout Details */}
        <div className="bg-white/[0.05] p-3.5 rounded-2xl border border-white/[0.08] text-left sm:text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-white/40 block tracking-wider">
            Student Payout
          </span>
          <div className="text-lg font-bubble font-bold text-orange-400">
            ₹{shift.totalEarnings}
            <span className="text-xs font-normal text-white/50"> (₹{shift.hourlyWage}/hr)</span>
          </div>
          <div className="text-[11px] text-white/50">
            {shift.durationHours} hrs · {shift.startTime}
          </div>
        </div>
      </div>

      {/* Applied Shift Info */}
      <div className="bg-white/[0.04] rounded-2xl p-3.5 border border-white/[0.06] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-white/80">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-orange-400" />
          <span>Date: <strong className="text-white">{shift.date}</strong></span>
          <span className="text-white/20">·</span>
          <span>Time: <strong className="text-white">{shift.startTime} – {shift.endTime}</strong></span>
        </div>
        <div>
          Role: <strong className="text-orange-300 font-bubble">{shift.roleName}</strong>
        </div>
      </div>

      {/* Direct Contact Actions Matching Orange Button Styling */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2 border-t border-white/[0.08]">
        <a
          href={`tel:+91${cleanPhone}`}
          className="flex-1 inline-flex items-center justify-center gap-2 btn-orange-glow text-xs font-bold py-3 px-4 rounded-2xl shadow-md"
        >
          <Phone className="w-4 h-4" />
          <span>Call Student (+91 {cleanPhone})</span>
        </a>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs py-3 px-4 rounded-2xl border border-emerald-500/40 shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Chat 💬</span>
        </a>

        {onComplete && (
          <button
            onClick={() => onComplete(shift.id)}
            className="text-xs font-semibold px-4 py-3 rounded-2xl glass-pill text-white/70 hover:text-white"
          >
            Mark Paid & Done
          </button>
        )}
      </div>
    </div>
  );
}
