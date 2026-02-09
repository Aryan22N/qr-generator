"use client";

import { useState } from "react";
import { signIn, signUp, resetPassword } from "../lib/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  UserPlus,
  Key,
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation for sign up
    if (isSignUp) {
      if (!confirmPassword.trim()) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login
  const handleLogin = async (e) => {
    e?.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { error, user } = await signIn(email, password);

      if (error) {
        setErrorMessage(
          error.message || "Login failed. Please check your credentials.",
        );
      } else {
        setSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle sign up
  const handleSignUp = async (e) => {
    e?.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { error } = await signUp(email, password);

      if (error) {
        setErrorMessage(error.message || "Sign up failed. Please try again.");
      } else {
        setSuccessMessage("Account created successfully! You can now log in.");
        setIsSignUp(false);
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error("Sign up error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e?.preventDefault();

    if (!email.trim()) {
      setErrors({ email: "Email is required for password reset" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await resetPassword(email);

      if (error) {
        setErrorMessage(error.message || "Failed to send reset email");
      } else {
        setSuccessMessage("Password reset email sent! Check your inbox.");
        setShowResetPassword(false);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error("Reset password error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle between login and sign up
  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setShowResetPassword(false);
    setErrorMessage("");
    setSuccessMessage("");
    setErrors({});
    setPassword("");
    setConfirmPassword("");
  };

  // Toggle reset password view
  const toggleResetPassword = () => {
    setShowResetPassword(!showResetPassword);
    setErrorMessage("");
    setSuccessMessage("");
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* CARD */}
        <div className="bg-white rounded-2xl text-gray-600 shadow-xl overflow-hidden">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              {showResetPassword
                ? "Reset Password"
                : isSignUp
                  ? "Create Account"
                  : "Welcome Back"}
            </h1>
            <p className="text-blue-100">
              {showResetPassword
                ? "Enter your email to reset your password"
                : isSignUp
                  ? "Sign up to create your account"
                  : "Sign in to your account to continue"}
            </p>
          </div>

          {/* FORM */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
                >
                  <p className="text-green-600 text-sm">{successMessage}</p>
                </motion.div>
              )}

              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <p className="text-red-600 text-sm">{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* RESET PASSWORD FORM */}
            {showResetPassword ? (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handlePasswordReset}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({ ...errors, email: "" });
                      }}
                      className={`w-full pl-10 pr-4 py-3 border ${errors.email ? "border-red-300" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-2">{errors.email}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    <>
                      <Key size={20} />
                      Send Reset Link
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={toggleResetPassword}
                  className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm"
                >
                  ← Back to {isSignUp ? "Sign Up" : "Login"}
                </button>
              </motion.form>
            ) : (
              /* LOGIN/SIGNUP FORM */
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={isSignUp ? handleSignUp : handleLogin}
                className="space-y-6"
              >
                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({ ...errors, email: "" });
                      }}
                      className={`w-full pl-10 pr-4 py-3 border ${errors.email ? "border-red-300" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-2">{errors.email}</p>
                  )}
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                    {isSignUp && (
                      <span className="text-gray-400 text-xs font-normal ml-1">
                        (min. 6 characters)
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors({ ...errors, password: "" });
                      }}
                      className={`w-full pl-10 pr-12 py-3 border ${errors.password ? "border-red-300" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-600 mt-2">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* CONFIRM PASSWORD (SIGN UP ONLY) */}
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setErrors({ ...errors, confirmPassword: "" });
                        }}
                        className={`w-full pl-10 pr-12 py-3 border ${errors.confirmPassword ? "border-red-300" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-600 mt-2">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                {/* FORGOT PASSWORD (LOGIN ONLY) */}
                {!isSignUp && !showResetPassword && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={toggleResetPassword}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {isSignUp ? "Creating Account..." : "Signing In..."}
                    </>
                  ) : (
                    <>
                      {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                      {isSignUp ? "Create Account" : "Sign In"}
                    </>
                  )}
                </button>

                {/* TOGGLE MODE */}
                <div className="text-center pt-4 border-t">
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    {isSignUp
                      ? "Already have an account? Sign In"
                      : "Don't have an account? Sign Up"}
                  </button>
                </div>
              </motion.form>
            )}

            {/* DEMO INFO */}
            {!isSignUp && !showResetPassword && (
              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 text-center">
                  <strong>Demo Account:</strong> demo@example.com / demodemo
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:text-blue-800">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
              Privacy Policy
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
