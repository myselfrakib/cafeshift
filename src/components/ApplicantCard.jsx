import React from 'react';
import { Phone, MessageCircle, MapPin, GraduationCap, Calendar, Clock } from 'lucide-react';

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
    <div className="bg-[#160838] rounded-[3px] p-5 border border-[#2A1354] space-y-4 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Student Profile Info */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-[3px] bg-[#1E0D48] border border-[#3D1C7A] flex items-center justify-center text-2xl shrink-0">
            {applicant.mascot || '🐼'}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-lg font-bold text-white font-headline uppercase tracking-tight">
                {applicant.name}
              </h4>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1E0D48] text-[#A399BA] px-2 py-0.5 rounded-[3px] border border-[#3D1C7A]">
                {applicant.gender || 'Student'} · {applicant.age} yrs
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#00DADC]/20 text-[#00DADC] border border-[#00DADC]/40 px-2 py-0.5 rounded-[3px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00DADC]"></span>
                <span>Booked</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#A399BA] mt-1">
              <GraduationCap className="w-3.5 h-3.5 text-[#00DADC] shrink-0" />
              <span>{applicant.college || 'Kolkata College Student'}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#A399BA] mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF0046] shrink-0" />
              <span>{applicant.address || 'Kolkata'}</span>
            </div>
          </div>
        </div>

        {/* Payout Details */}
        <div className="bg-[#12052E] p-3 rounded-[3px] border border-[#2A1354] text-left sm:text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-[#786C94] block tracking-wider font-headline">
            Student Payout
          </span>
          <div className="text-lg font-headline font-bold text-[#00DADC]">
            ₹{shift.totalEarnings}
            <span className="text-xs font-normal text-[#A399BA]"> (₹{shift.hourlyWage}/hr)</span>
          </div>
          <div className="text-[11px] text-[#A399BA]">
            {shift.durationHours} hrs · {shift.startTime}
          </div>
        </div>
      </div>

      {/* Applied Shift Info */}
      <div className="bg-[#12052E] rounded-[3px] p-3 border border-[#2A1354] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[#A399BA]">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#00DADC]" />
          <span>Date: <strong className="text-white font-headline">{shift.date}</strong></span>
          <span className="text-[#3D1C7A]">·</span>
          <span>Time: <strong className="text-white font-headline">{shift.startTime} – {shift.endTime}</strong></span>
        </div>
        <div>
          Role: <strong className="text-white font-headline uppercase">{shift.roleName}</strong>
        </div>
      </div>

      {/* Direct Contact Actions (IFP Buttons) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-[#2A1354]">
        <a
          href={`tel:+91${cleanPhone}`}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#00DADC] hover:bg-[#00c5c7] text-black font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-[3px] shadow-sm transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Student (+91 {cleanPhone})</span>
        </a>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#FE9900] hover:bg-[#e88c00] text-black font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-[10px] shadow-[rgb(255,81,0)_0px_4px_0px_0px] transition-all active:translate-y-0.5 active:shadow-[rgb(255,81,0)_0px_2px_0px_0px]"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp Message</span>
        </a>

        {onComplete && (
          <button
            onClick={() => onComplete(shift.id)}
            className="text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-[3px] border border-[#2A1354] text-[#A399BA] hover:text-white hover:bg-[#1E0D48] transition-colors"
          >
            Mark Paid & Done
          </button>
        )}
      </div>
    </div>
  );
}
