import React from 'react';
import { Phone, MessageCircle, MapPin, GraduationCap, Calendar, Clock } from 'lucide-react';
import { formatDateDDMMYYYY, formatTime12Hour } from '../utils/dateTime';

export default function ApplicantCard({ shift, onComplete, onCancel }) {
  const applicant = shift.applicant;

  if (!applicant) return null;

  const displayDate = formatDateDDMMYYYY(shift.date);
  const displayStartTime = formatTime12Hour(shift.startTime);
  const displayEndTime = formatTime12Hour(shift.endTime);

  const cleanPhone = applicant.phone ? applicant.phone.replace(/\D/g, '') : '';
  const waPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const waText = encodeURIComponent(
    `Hello ${applicant.name}! This is regarding your booked shift at ${shift.cafeName} for "${shift.roleName}" on ${displayDate} (${displayStartTime}). We are happy to confirm your shift!`
  );
  const waUrl = `https://wa.me/${waPhone}?text=${waText}`;

  return (
    <div className="bg-white rounded-[3px] p-5 border border-stone-200 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Student Profile Info */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-[3px] bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            {applicant.photoUrl ? (
              <img src={applicant.photoUrl} alt={applicant.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-headline font-bold text-base text-[#FF0046]">
                {applicant.name ? applicant.name.split(' ').map(n=>n[0]).join('').slice(0, 2).toUpperCase() : 'ST'}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-lg font-bold text-[#0A011C] font-headline uppercase tracking-tight">
                {applicant.name}
              </h4>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600 px-2 py-0.5 rounded-[3px] border border-stone-200">
                {applicant.gender || 'Student'} · {applicant.age} yrs
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#00DADC]/20 text-[#008b8d] border border-[#00DADC]/40 px-2 py-0.5 rounded-[3px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00DADC]"></span>
                <span>Booked</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
              <GraduationCap className="w-3.5 h-3.5 text-[#008b8d] shrink-0" />
              <span>{applicant.college || 'Kolkata College Student'}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF0046] shrink-0" />
              <span>{applicant.address || 'Kolkata'}</span>
            </div>
          </div>
        </div>

        {/* Payout Details */}
        <div className="bg-stone-50 p-3 rounded-[3px] border border-stone-200 text-left sm:text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider font-headline">
            Student Payout
          </span>
          <div className="text-lg font-headline font-bold text-[#FF0046]">
            ₹{shift.totalEarnings}
            <span className="text-xs font-normal text-stone-500"> (₹{shift.hourlyWage}/hr)</span>
          </div>
          <div className="text-[11px] text-stone-500">
            {shift.durationHours} hrs · {displayStartTime}
          </div>
        </div>
      </div>

      {/* Applied Shift Info */}
      <div className="bg-stone-50 rounded-[3px] p-3 border border-stone-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-stone-600">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#FF0046]" />
          <span>Date: <strong className="text-[#0A011C] font-headline">{displayDate}</strong></span>
          <span className="text-stone-300">·</span>
          <span>Time: <strong className="text-[#0A011C] font-headline">{displayStartTime} – {displayEndTime}</strong></span>
        </div>
        <div>
          Role: <strong className="text-[#0A011C] font-headline uppercase">{shift.roleName}</strong>
        </div>
      </div>

      {/* Direct Contact Actions (IFP Buttons) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-stone-200">
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
            className="text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-[3px] border border-stone-200 text-stone-600 hover:text-[#0A011C] hover:bg-stone-100 transition-colors"
          >
            Mark Paid & Done
          </button>
        )}
      </div>
    </div>
  );
}
