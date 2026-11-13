import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, GraduationCap, Calendar, Clock, CheckCircle2 } from 'lucide-react';

export default function ApplicantCard({ shift, onComplete, onCancel }) {
  const applicant = shift.applicant;

  if (!applicant) return null;

  const cleanPhone = applicant.phone ? applicant.phone.replace(/\D/g, '') : '';
  const waPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const waText = encodeURIComponent(
    `Hello ${applicant.name}! This is regarding your booked shift at ${shift.cafeName} for "${shift.roleName}" on ${shift.date} (${shift.startTime}). We are happy to confirm your shift!`
  );
  const waUrl = `https://wa.me/${waPhone}?text=${waText}`;

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Student Profile Info */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-2xl shrink-0">
            {applicant.mascot || '🐼'}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base font-bold text-stone-950 font-bubble">
                {applicant.name}
              </h4>
              <span className="text-[10px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full border border-stone-200">
                {applicant.gender || 'Student'} · {applicant.age} yrs
              </span>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Booked</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
              <GraduationCap className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>{applicant.college || 'Kolkata College Student'}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>{applicant.address || 'Kolkata'}</span>
            </div>
          </div>
        </div>

        {/* Payout Details */}
        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-left sm:text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
            Student Payout
          </span>
          <div className="text-base font-bubble font-bold text-stone-950">
            ₹{shift.totalEarnings}
            <span className="text-xs font-normal text-stone-500"> (₹{shift.hourlyWage}/hr)</span>
          </div>
          <div className="text-[11px] text-stone-500">
            {shift.durationHours} hrs · {shift.startTime}
          </div>
        </div>
      </div>

      {/* Applied Shift Info */}
      <div className="bg-stone-50/70 rounded-xl p-3 border border-stone-200/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-stone-700">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <span>Date: <strong>{shift.date}</strong></span>
          <span className="text-stone-300">·</span>
          <span>Time: <strong>{shift.startTime} – {shift.endTime}</strong></span>
        </div>
        <div>
          Role: <strong className="text-stone-900">{shift.roleName}</strong>
        </div>
      </div>

      {/* Direct Contact Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-stone-100">
        <a
          href={`tel:+91${cleanPhone}`}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Student (+91 {cleanPhone})</span>
        </a>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp Message</span>
        </a>

        {onComplete && (
          <button
            onClick={() => onComplete(shift.id)}
            className="text-xs font-medium px-3 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Mark Paid & Done
          </button>
        )}
      </div>
    </div>
  );
}
