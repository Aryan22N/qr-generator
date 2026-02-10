"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/providers";
import { UserCircle, LogOut, Settings, Home as HomeIcon, ArrowRight, QrCode } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
  const {
    user,
    loading: authLoading,
    signOut,
    userName,
    userEmail,
    userAvatar,
  } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getUserInitials = () => {
    if (userName) {
      return userName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (userEmail) {
      return userEmail.split("@")[0].charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".user-dropdown")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* LOGO */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => router.push("/")}
          >
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-blue-600 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300 opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:-translate-y-1 transition-transform duration-300">
                <QrCode className="text-white w-6 h-6" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                QR Generator
              </span>
              <span className="text-[10px] font-medium text-blue-600 tracking-wider uppercase">
                Enterprise Edition
              </span>
            </div>
          </motion.div>

          {/* DESKTOP NAVIGATION */}
          {user && !authLoading && (
            <div className="hidden md:flex items-center space-x-1">
              {[
                { name: "Dashboard", icon: HomeIcon, path: "/" },
                { name: "Clients", icon: UserCircle, path: "/client" },
              ].map((item) => (
                <Link key={item.path} href={item.path}>
                  <span className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200">
                    <item.icon size={18} />
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          )}


          {/* USER AVATAR & DROPDOWN */}
          <div className="flex items-center gap-4">
            {user && !authLoading ? (
              <div className="relative user-dropdown">
                <motion.button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-gray-100/80 transition-all duration-200 border border-transparent hover:border-gray-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* User info - hidden on mobile */}
                  <div className="hidden md:block text-right mr-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">{userEmail}</p>
                  </div>

                  {/* Avatar */}
                  <div className="relative">
                    {userAvatar ? (
                      <Image
                        src={userAvatar}
                        alt={userName || "User Avatar"}
                        width={40}
                        height={40}
                        className="rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                        {getUserInitials()}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>

                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(10px)" }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-4 w-72 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50 ring-1 ring-black/5"
                    >
                      {/* User Info Section */}
                      <div className="p-5 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-inner">
                            {getUserInitials()}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="font-bold text-gray-900 truncate">
                              {getUserDisplayName()}
                            </p>
                            <p className="text-xs text-gray-500 truncate font-medium">
                              {userEmail}
                            </p>
                            <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700">
                              Pro Plan
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2 space-y-1">
                        {[
                          { name: "Dashboard", icon: HomeIcon, path: "/", mobileOnly: true },
                          { name: "My Clients", icon: UserCircle, path: "/client", mobileOnly: true },
                          { name: "Profile Settings", icon: Settings, path: "/settings" },
                        ].map((item) => (
                          <button
                            key={item.path}
                            onClick={() => {
                              setIsDropdownOpen(false);
                              router.push(item.path);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all group ${item.mobileOnly ? "md:hidden" : ""
                              }`}
                          >
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100/50 transition-colors">
                              <item.icon size={18} className="text-gray-500 group-hover:text-blue-600" />
                            </div>
                            {item.name}
                          </button>
                        ))}
                      </div>

                      {/* Logout Button */}
                      <div className="p-2 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-xl transition-all font-medium text-sm group"
                        >
                          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                onClick={() => router.push("/login")}
                className="group relative px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium overflow-hidden shadow-lg shadow-gray-900/20 hover:shadow-gray-900/30 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
