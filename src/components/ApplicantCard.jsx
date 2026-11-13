import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, GraduationCap, Calendar, Clock, CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react';

export default function ApplicantCard({ shift, onComplete, onCancel }) {
  const applicant = shift.applicant;

  if (!applicant) return null;

  const cleanPhone = applicant.phone ? applicant.phone.replace(/\D/g, '') : '';
  const waPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const waText = encodeURIComponent(
    `Hello ${applicant.name}! This is regarding your booked shift at ${shift.cafeName} for ${shift.roleName} on ${shift.date} (${shift.startTime}). We're excited to have you join our team!`
  );
  const waUrl = `https://wa.me/${waPhone}?text=${waText}`;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 rounded-3xl p-4 sm:p-5 border-2 border-amber-300 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        {/* Student Profile Info & Photo */}
        <div className="flex items-start gap-3 sm:gap-3.5">
          {applicant.photoUrl ? (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-sm shrink-0">
              <img src={applicant.photoUrl} alt={applicant.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-200 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-sm shrink-0">
              {applicant.mascot || '🐼'}
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h4 className="text-base sm:text-lg font-bold text-amber-950 font-bubble">
                {applicant.name}
              </h4>
              <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                {applicant.gender || 'Student'} · {applicant.age} yrs
              </span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Booked in Firebase
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-amber-800 mt-1 font-medium">
              <GraduationCap className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>{applicant.college || 'Kolkata College Student'}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-amber-800 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Residence: {applicant.address || 'Kolkata, WB'}</span>
            </div>
          </div>
        </div>

        {/* Pay & Shift Badge */}
        <div className="bg-white/90 p-3 rounded-2xl border border-amber-200 text-left sm:text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-amber-600 block">
            Guaranteed Payout
          </span>
          <div className="text-base font-bubble font-bold text-emerald-700">
            ₹{shift.totalEarnings}
            <span className="text-[11px] font-sans font-normal text-amber-700"> (₹{shift.hourlyWage}/hr)</span>
          </div>
          <div className="text-[11px] text-amber-800 font-medium">
            {shift.durationHours} hrs · {shift.startTime}
          </div>
        </div>
      </div>

      {/* Applied Shift Details */}
      <div className="bg-white/80 rounded-2xl p-3 border border-amber-200/80 mb-4 text-xs space-y-1.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-amber-950 font-semibold">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>Shift Date: {shift.date}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{shift.startTime} - {shift.endTime}</span>
          </span>
        </div>
        <div className="text-amber-800 font-medium">
          Role: <span className="font-bold text-amber-950">{shift.roleName}</span>
        </div>
      </div>

      {/* Direct Contact Actions for Cafe Owner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-amber-200/80">
        {/* Call Action */}
        <a
          href={`tel:+91${cleanPhone}`}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-sm transition-all active:scale-95"
        >
          <Phone className="w-4 h-4" />
          <span>Call Student (+91 {cleanPhone})</span>
        </a>

        {/* WhatsApp Direct Chat */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-sm transition-all active:scale-95"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Chat 💬</span>
        </a>

        {/* Mark completed */}
        {onComplete && (
          <button
            onClick={() => onComplete(shift.id)}
            className="text-xs font-semibold px-3 py-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
          >
            Mark Done ✅
          </button>
        )}
      </div>
    </div>
  );
}
