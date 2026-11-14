import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import AddCafeModal from './AddCafeModal';
import {
  User,
  Mail,
  Phone,
  Store,
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
  Loader2,
  Edit3,
  Plus,
  Briefcase
} from 'lucide-react';

export default function OwnerProfileView() {
  const {
    currentUser,
    updateUserProfile,
    uploadImage,
    ownerCafes,
    shifts,
    jobs,
    setActiveTab,
    handleLogout,
    isSyncing,
    showToast
  } = useApp();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    bio: currentUser?.bio || '',
    photoUrl: currentUser?.photoUrl || ''
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editingCafe, setEditingCafe] = useState(null);
  const [addCafeModalOpen, setAddCafeModalOpen] = useState(false);

  // Sync state if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        bio: currentUser.bio || `Owner & operator on Calcutta Cafe Club. Providing fair hourly shifts and job opportunities for students in Kolkata.`,
        photoUrl: currentUser.photoUrl || ''
      });
    }
  }, [currentUser]);

  // Aggregate stats across all cafes owned by this user
  const totalShifts = (shifts || []).filter(s => ownerCafes.some(c => c.id === s.cafeId));
  const liveShiftsCount = totalShifts.filter(s => s.status === 'open').length;
  const bookedShiftsCount = totalShifts.filter(s => s.status === 'booked').length;
  const totalJobs = (jobs || []).filter(j => ownerCafes.some(c => c.id === j.cafeId));
  const totalApplicantsCount = totalJobs.reduce((acc, j) => acc + (j.applicants?.length || 0), 0);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setErrorMessage('');
    try {
      const url = await uploadImage(file, 'owners');
      setFormData(prev => ({ ...prev, photoUrl: url }));
      await updateUserProfile({ photoUrl: url });
      if (showToast) showToast('Profile photo updated successfully!', 'success', '📸');
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
    setSaveSuccess(false);

    if (!formData.name.trim()) {
      return setErrorMessage('Please enter your full name');
    }
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
      return setErrorMessage('Please enter a valid 10-digit phone number for +91');
    }

    setIsSaving(true);
    try {
      await updateUserProfile({
        name: formData.name.trim(),
        phone: formData.phone.replace(/^\+91/, '').replace(/\s+/g, ''),
        bio: formData.bio.trim(),
        photoUrl: formData.photoUrl
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update profile details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Top Owner Profile Identity Card */}
      <div className="bg-white rounded-[3px] border border-stone-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
          
          {/* Avatar with Upload Hover Button */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[3px] bg-stone-900 border-2 border-stone-200 flex items-center justify-center overflow-hidden shadow-xs text-white">
              {formData.photoUrl ? (
                <img
                  src={formData.photoUrl}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <span className="font-headline font-bold text-3xl text-white">
                  {formData.name ? formData.name.slice(0, 2).toUpperCase() : 'CO'}
                </span>
              )}
            </div>

            <label className="absolute inset-0 bg-black/60 rounded-[3px] flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 mb-1 text-[#00DADC]" />
              <span className="text-[10px] font-bold uppercase tracking-wider font-headline">Change Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>

            {uploadingPhoto && (
              <div className="absolute inset-0 bg-black/70 rounded-[3px] flex items-center justify-center text-white">
                <Loader2 className="w-6 h-6 animate-spin text-[#00DADC]" />
              </div>
            )}
          </div>

          {/* Identity Info */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-[#0A011C] text-white">
                ☕ Cafe Owner / Operator
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-[#00DADC] text-black">
                Kolkata
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                Verified Account
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-headline font-bold uppercase tracking-tight text-[#0A011C]">
              {formData.name || 'Cafe Owner'}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-stone-600 font-medium">
              <span className="flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-[#FF0046]" />
                +91 {formData.phone}
              </span>
              {formData.email && (
                <span className="flex items-center gap-1.5 font-mono">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  {formData.email}
                </span>
              )}
            </div>

            <p className="text-xs text-stone-500 max-w-xl leading-relaxed pt-1">
              {formData.bio}
            </p>
          </div>

        </div>
      </div>

      {/* 2. Key Operator Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-[3px] border border-stone-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider font-headline">
            Cafe Outlets
          </span>
          <div className="text-2xl font-headline font-bold text-[#0A011C] mt-1">
            {ownerCafes.length}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">Kolkata branches</p>
        </div>

        <div className="bg-white p-4 rounded-[3px] border border-stone-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider font-headline">
            Live Shifts
          </span>
          <div className="text-2xl font-headline font-bold text-[#FE9900] mt-1">
            {liveShiftsCount}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">Open on student feed</p>
        </div>

        <div className="bg-white p-4 rounded-[3px] border border-stone-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider font-headline">
            Booked Shifts
          </span>
          <div className="text-2xl font-headline font-bold text-[#008b8d] mt-1">
            {bookedShiftsCount}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">Candidates ready</p>
        </div>

        <div className="bg-white p-4 rounded-[3px] border border-stone-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider font-headline">
            Job Openings
          </span>
          <div className="text-2xl font-headline font-bold text-[#FF0046] mt-1">
            {totalJobs.length}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">{totalApplicantsCount} applicants</p>
        </div>
      </div>

      {/* 3. Owner Details Edit Form */}
      <div className="bg-white rounded-[3px] border border-stone-200 p-5 sm:p-7 shadow-xs space-y-5">
        <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-headline font-bold text-[#0A011C] uppercase tracking-tight">
              Edit Owner Contact Information
            </h3>
            <p className="text-xs text-stone-500">
              Students view this name and phone number when booked on your shifts.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-[3px] text-xs text-red-700 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[3px] text-xs text-emerald-800 flex items-center gap-2 font-medium animate-pop">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Profile information updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 font-headline mb-1">
                Owner Full Name <span className="text-[#FF0046]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-[3px] border border-stone-200 focus:border-[#0A011C] focus:ring-1 focus:ring-[#0A011C] font-semibold text-stone-900 outline-none"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 font-headline mb-1">
                Contact Phone (+91) <span className="text-[#FF0046]">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-stone-500 font-bold font-mono text-xs">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="w-full pl-12 pr-3.5 py-2.5 rounded-[3px] border border-stone-200 focus:border-[#0A011C] focus:ring-1 focus:ring-[#0A011C] font-semibold font-mono text-stone-900 outline-none"
                />
              </div>
            </div>

            {/* Email (Read-Only) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 font-headline mb-1">
                Account Email Address
              </label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full px-3.5 py-2.5 rounded-[3px] border border-stone-200 bg-stone-100 text-stone-500 font-mono outline-none cursor-not-allowed"
              />
            </div>

            {/* Bio / Philosophy */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 font-headline mb-1">
                Owner Bio / Brand Philosophy
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Share a short note about your cafe outlets and fair student work culture..."
                className="w-full px-3.5 py-2.5 rounded-[3px] border border-stone-200 focus:border-[#0A011C] focus:ring-1 focus:ring-[#0A011C] font-medium text-stone-900 outline-none resize-none leading-relaxed"
              />
            </div>

          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving || isSyncing}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[3px] bg-[#0A011C] hover:bg-stone-800 text-white font-headline text-xs font-bold uppercase tracking-wider transition-colors shadow-xs disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#00DADC]" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 4. Registered Cafe Outlets Roster */}
      <div className="bg-white rounded-[3px] border border-stone-200 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="border-b border-stone-200 pb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-headline font-bold text-[#0A011C] uppercase tracking-tight">
              Your Registered Cafe Outlets ({ownerCafes.length})
            </h3>
            <p className="text-xs text-stone-500">
              Manage your cafe outlets and branch profiles across Kolkata.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingCafe(null);
              setAddCafeModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-[#FF0046] hover:bg-[#E6003F] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Outlet</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ownerCafes.map(cafe => {
            const cafeShifts = (shifts || []).filter(s => s.cafeId === cafe.id);
            const cafeJobs = (jobs || []).filter(j => j.cafeId === cafe.id);

            return (
              <div
                key={cafe.id}
                className="p-4 rounded-[3px] border border-stone-200 bg-stone-50 flex items-start justify-between gap-3 hover:border-stone-300 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-[3px] bg-stone-200 flex items-center justify-center overflow-hidden shrink-0 font-bold text-sm text-stone-600">
                    {cafe.photoUrl ? (
                      <img src={cafe.photoUrl} alt={cafe.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>☕</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-headline font-bold text-sm text-[#0A011C] uppercase truncate">
                      {cafe.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 flex items-center gap-1 truncate mt-0.5">
                      <MapPin className="w-3 h-3 text-[#FF0046] shrink-0" />
                      <span>{cafe.area}, Kolkata</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] font-bold">
                      <span className="px-1.5 py-0.2 rounded-[2px] bg-stone-200 text-stone-700">
                        {cafeShifts.length} Shifts
                      </span>
                      <span className="px-1.5 py-0.2 rounded-[2px] bg-stone-200 text-stone-700">
                        {cafeJobs.length} Jobs
                      </span>
                      <span className="px-1.5 py-0.2 rounded-[2px] bg-[#00DADC]/20 text-[#006062]">
                        Min ₹{cafe.minHourlyWage}/hr
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingCafe(cafe);
                    setAddCafeModalOpen(true);
                  }}
                  className="p-1.5 rounded-[3px] border border-stone-200 hover:bg-white text-stone-600 hover:text-[#0A011C] transition-colors shrink-0"
                  title="Edit Cafe"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Account Security & Sign Out Section */}
      <div className="bg-white rounded-[3px] border border-stone-200 p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 font-headline">
            Signed in account
          </h4>
          <p className="text-xs text-stone-500 font-mono mt-0.5">
            {currentUser?.email}
          </p>
          <p className="text-[10px] text-stone-400 mt-0.5">
            Role: Cafe Owner / Operator · Member ID: {currentUser?.id}
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
