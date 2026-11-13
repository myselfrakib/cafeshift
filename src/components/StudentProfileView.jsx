import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Camera,
  Upload,
  Save,
  CheckCircle,
  LogOut,
  Coffee,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { formatDateDDMMYYYY, formatTime12Hour } from '../utils/dateTime';

export default function StudentProfileView() {
  const {
    currentUser,
    updateUserProfile,
    uploadImage,
    shifts,
    setActiveTab,
    handleLogout,
    isSyncing
  } = useApp();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    college: currentUser?.college || '',
    address: currentUser?.address || '',
    age: currentUser?.age || 20,
    gender: currentUser?.gender || 'Female',
    bio: currentUser?.bio || '',
    preferredAreas: currentUser?.preferredAreas || 'Park Street, Southern Avenue, Salt Lake',
    preferredHours: currentUser?.preferredHours || 'Evening Rushes (4:00 PM - 9:00 PM)',
    photoUrl: currentUser?.photoUrl || ''
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        college: currentUser.college || '',
        address: currentUser.address || '',
        age: currentUser.age || 20,
        gender: currentUser.gender || 'Female',
        bio: currentUser.bio || '',
        preferredAreas: currentUser.preferredAreas || 'Park Street, Southern Avenue, Salt Lake',
        preferredHours: currentUser.preferredHours || 'Evening Rushes (4:00 PM - 9:00 PM)',
        photoUrl: currentUser.photoUrl || ''
      });
    }
  }, [currentUser]);

  // Calculate student shift metrics
  const myBookedShifts = shifts.filter(s =>
    s.status === 'booked' &&
    (s.applicant?.userId === currentUser?.id || s.applicant?.email === currentUser?.email)
  );

  const totalEarnings = myBookedShifts.reduce((sum, s) => sum + (s.durationHours * s.hourlyWage), 0);
  const totalHours = myBookedShifts.reduce((sum, s) => sum + s.durationHours, 0);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setErrorMessage('');
    try {
      const url = await uploadImage(file, 'students');
      setFormData(prev => ({ ...prev, photoUrl: url }));
      await updateUserProfile({ photoUrl: url });
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to upload image. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      return setErrorMessage('Full name is required.');
    }
    if (!formData.phone || formData.phone.length < 10) {
      return setErrorMessage('Please enter a valid 10-digit mobile number.');
    }
    if (!formData.college.trim()) {
      return setErrorMessage('Please specify your Kolkata college or school.');
    }

    setIsSaving(true);
    try {
      await updateUserProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        college: formData.college.trim(),
        address: formData.address.trim(),
        age: Number(formData.age) || 20,
        gender: formData.gender,
        bio: formData.bio.trim(),
        preferredAreas: formData.preferredAreas.trim(),
        preferredHours: formData.preferredHours.trim(),
        photoUrl: formData.photoUrl
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to save profile changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-[3px] border border-stone-200 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
          
          {/* Avatar with Camera Overlay */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[3px] bg-stone-100 border-2 border-stone-200 overflow-hidden flex items-center justify-center shadow-xs">
              {formData.photoUrl ? (
                <img
                  src={formData.photoUrl}
                  alt={formData.name || 'Student'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400 font-bold font-headline text-3xl text-[#FF0046]">
                  {formData.name ? formData.name[0].toUpperCase() : 'S'}
                </div>
              )}
            </div>

            {/* Upload Button */}
            <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-[3px] bg-[#0A011C] hover:bg-[#FF0046] text-white flex items-center justify-center cursor-pointer shadow-md transition-colors border border-white">
              {uploadingPhoto ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#00DADC]" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingPhoto}
                onChange={handlePhotoUpload}
              />
            </label>
          </div>

          {/* Student Info & Badges */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline text-[#0A011C] uppercase tracking-tight">
                {formData.name || 'Student Attendant'}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[3px] text-xs font-bold bg-[#00DADC]/20 text-[#006062] border border-[#00DADC]/40 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#008b8d]" />
                <span>Verified Attendant</span>
              </span>
            </div>

            <div className="text-xs text-stone-600 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className="flex items-center gap-1 font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-[#FF0046]" />
                <span>{formData.college || 'Kolkata Student'}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{formData.address || 'Kolkata, WB'}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 font-mono text-stone-500">
                <Phone className="w-3 h-3 text-stone-400" />
                <span>+91 {formData.phone || '98XXXXXXXX'}</span>
              </span>
            </div>

            <p className="text-xs text-stone-500 max-w-xl italic pt-1">
              "{formData.bio || 'College student ready for evening & weekend cafe rushes across Kolkata.'}"
            </p>
          </div>

          {/* Quick Sign Out button on Profile */}
          <div className="sm:self-start">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-[#FF0046] hover:bg-[#FF0046]/10 rounded-[3px] border border-stone-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* 2. Key Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-100">
          <div className="p-3 bg-stone-50 rounded-[3px] border border-stone-200 text-center">
            <div className="text-xl sm:text-2xl font-bold font-headline text-[#0A011C]">
              {myBookedShifts.length}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 font-headline mt-0.5">
              Booked Shifts
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-[3px] border border-stone-200 text-center">
            <div className="text-xl sm:text-2xl font-bold font-headline text-[#008b8d]">
              {totalHours} hrs
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 font-headline mt-0.5">
              Total Hours
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-[3px] border border-stone-200 text-center">
            <div className="text-xl sm:text-2xl font-bold font-headline text-[#FF0046]">
              ₹{totalEarnings.toLocaleString()}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 font-headline mt-0.5">
              Est. Earnings
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-[3px] border border-stone-200 text-center">
            <div className="text-xl sm:text-2xl font-bold font-headline text-[#0A011C] flex items-center justify-center gap-1">
              <span>100%</span>
              <span className="text-emerald-500 text-base">★</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 font-headline mt-0.5">
              Reliability Score
            </div>
          </div>
        </div>
      </div>

      {/* 3. Manage Profile Form Card */}
      <div className="bg-white rounded-[3px] border border-stone-200 p-5 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold font-headline text-[#0A011C] uppercase tracking-tight flex items-center gap-2">
              <User className="w-4 h-4 text-[#FF0046]" />
              <span>Personal & Student Details</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Keep your profile updated. Cafe owners view this information when you lock a shift.
            </p>
          </div>
          {saveSuccess && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-[3px]">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Saved!</span>
            </span>
          )}
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-[3px] bg-rose-50 border border-[#FF0046]/30 text-[#FF0046] text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Row 1: Full Name & Mobile Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ananya Mukherjee"
                className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] font-medium focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                Mobile Number (+91) *
              </label>
              <div className="flex items-center">
                <span className="px-2.5 py-2 text-xs font-bold bg-stone-200 text-stone-800 rounded-l-[3px] border border-r-0 border-stone-200">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  placeholder="9831299881"
                  className="w-full px-3 py-2 text-xs rounded-r-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] font-mono focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Row 2: College / University & Kolkata Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                College / Institution (Kolkata) *
              </label>
              <input
                type="text"
                required
                value={formData.college}
                onChange={e => setFormData({ ...formData, college: e.target.value })}
                placeholder="e.g. St. Xavier's College / Presidency Univ"
                className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] font-medium focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                Residence Locality / Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Ballygunge Circular Rd, Kolkata - 700019"
                className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] font-medium focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors"
              />
            </div>
          </div>

          {/* Row 3: Age & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                Age
              </label>
              <input
                type="number"
                min={16}
                max={30}
                required
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] font-bold focus:bg-white focus:outline-none focus:border-[#FF0046]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] font-medium focus:bg-white focus:outline-none focus:border-[#FF0046]"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Row 4: Bio & Attendant Notes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
              About You & Experience
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              placeholder="e.g. English literature undergraduate. Fast learner, polite, experienced with billing counter & coffee table service."
              className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors"
            />
          </div>

          {/* Row 5: Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                Preferred Shift Timing
              </label>
              <input
                type="text"
                value={formData.preferredHours}
                onChange={e => setFormData({ ...formData, preferredHours: e.target.value })}
                placeholder="e.g. Evening Rushes (4:00 PM - 9:00 PM)"
                className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] font-medium focus:bg-white focus:outline-none focus:border-[#FF0046]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                Preferred Kolkata Neighborhoods
              </label>
              <input
                type="text"
                value={formData.preferredAreas}
                onChange={e => setFormData({ ...formData, preferredAreas: e.target.value })}
                placeholder="e.g. Park Street, Southern Ave, Hindustan Park"
                className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] font-medium focus:bg-white focus:outline-none focus:border-[#FF0046]"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#FF0046] hover:bg-[#E6003F] text-white font-bold text-xs uppercase tracking-wider rounded-[3px] transition-all flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. Booked Shifts Quick Jump */}
      <div className="bg-white rounded-[3px] border border-stone-200 p-5 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold font-headline text-[#0A011C] uppercase tracking-tight">
              Recent Booked Shifts ({myBookedShifts.length})
            </h3>
            <p className="text-xs text-stone-500">
              Shifts you have locked and are scheduled to attend.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('my-applications')}
            className="text-xs font-bold text-[#FF0046] hover:underline uppercase tracking-wider flex items-center gap-1 font-headline"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {myBookedShifts.length === 0 ? (
          <div className="p-6 text-center bg-stone-50 rounded-[3px] border border-dashed border-stone-200">
            <Coffee className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-xs text-stone-500">You haven't locked any shifts yet.</p>
            <button
              onClick={() => setActiveTab('browse')}
              className="mt-3 px-4 py-2 bg-[#0A011C] hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider rounded-[3px] transition-colors"
            >
              Browse Open Shifts
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {myBookedShifts.slice(0, 3).map(shift => (
              <div
                key={shift.id}
                className="p-3 bg-stone-50 rounded-[3px] border border-stone-200 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-[#0A011C] uppercase font-headline">
                    {shift.roleName}
                  </div>
                  <div className="text-stone-500 text-[11px] flex items-center gap-2 mt-0.5">
                    <span>{shift.cafeName}</span>
                    <span>·</span>
                    <span>{shift.date}</span>
                    <span>·</span>
                    <span className="text-[#008b8d] font-bold">{shift.startTime}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-[#FF0046] font-mono">
                    ₹{shift.durationHours * shift.hourlyWage}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-[2px] uppercase">
                    Locked
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Account Information & Sign Out */}
      <div className="bg-white rounded-[3px] border border-stone-200 p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 font-headline">
            Signed in account
          </h4>
          <p className="text-xs text-stone-500 font-mono mt-0.5">
            {currentUser?.email}
          </p>
          <p className="text-[10px] text-stone-400 mt-0.5">
            Role: Student Cafe Attendant · Member ID: {currentUser?.id}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-stone-100 hover:bg-rose-50 text-[#FF0046] border border-stone-200 hover:border-rose-200 font-bold text-xs uppercase tracking-wider rounded-[3px] transition-colors flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Account</span>
        </button>
      </div>
    </div>
  );
}

