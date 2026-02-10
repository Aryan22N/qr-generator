"use client";

import { useState } from "react";
import { useAuth } from "@/app/providers";
import { motion } from "framer-motion";
import { User, Mail, Phone, Save, Camera, X, Shield, Lock, Edit } from "lucide-react";
import Image from "next/image";
import { supabase } from "../lib/supabase";

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    full_name: user?.user_metadata?.full_name || "",
    phone: user?.user_metadata?.phone || "",
    avatar_url: user?.user_metadata?.avatar_url || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("user-avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("user-avatars").getPublicUrl(filePath);

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { ...formData, avatar_url: publicUrl },
      });

      if (updateError) throw updateError;

      setFormData((prev) => ({ ...prev, avatar_url: publicUrl }));
      setSuccess("Avatar updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase.auth.updateUser({
        data: formData,
      });

      if (error) throw error;

      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    if (formData.full_name) {
      return formData.full_name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email.split("@")[0].charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-100/30 blur-3xl rounded-full mix-blend-multiply opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-[50%] h-[40%] bg-purple-100/30 blur-3xl rounded-full mix-blend-multiply opacity-50"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* HEADER */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Account Settings
            </h1>
            <p className="text-gray-500 text-lg">
              Manage your profile information and preferences
            </p>
          </div>

          {/* STATUS MESSAGES */}
          <div className="h-6">
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-auto max-w-sm p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center shadow-sm"
              >
                <div className="flex items-center justify-center gap-2 text-emerald-600 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {success}
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-auto max-w-sm p-3 bg-red-50 border border-red-200 rounded-xl text-center shadow-sm"
              >
                <div className="flex items-center justify-center gap-2 text-red-600 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  {error}
                </div>
              </motion.div>
            )}
          </div>

          {/* PROFILE CARD */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
            {/* Decorative Banner */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/10 to-transparent"></div>
            </div>

            <div className="px-8 pb-8">
              {/* AVATAR SECTION */}
              <div className="relative -mt-16 mb-8 flex flex-col items-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white">
                    {formData.avatar_url ? (
                      <Image
                        src={formData.avatar_url}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                        {getUserInitials()}
                      </div>
                    )}
                  </div>

                  {/* Upload Overlay */}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full border-4 border-transparent">
                    <Camera size={32} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={loading}
                    />
                  </label>

                  {/* Edit Badge */}
                  <div className="absolute bottom-1 right-1 w-8 h-8 bg-blue-600 text-white rounded-full border-2 border-white flex items-center justify-center shadow-lg pointer-events-none">
                    <Edit size={14} />
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {formData.full_name || user?.email?.split("@")[0] || "User"}
                  </h2>
                  <div className="flex items-center justify-center gap-1.5 mt-1 text-gray-500">
                    <Mail size={14} />
                    <p className="text-sm font-medium">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 gap-6">
                  {/* Personal Details */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <User size={16} /> Personal Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900"
                          placeholder="Enter your full name"
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900"
                          placeholder="+1 (234) 567-8900"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="space-y-6 pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <Lock size={16} /> Account Info
                    </h3>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={user?.email || ""}
                          className="w-full px-4 py-3 bg-gray-100 border border-gray-200 text-gray-500 rounded-xl cursor-not-allowed font-medium"
                          disabled
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                          <Lock size={16} />
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 pl-1">
                        Contact support to change your email address.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SAVE BUTTON */}
                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
