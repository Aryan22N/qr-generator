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
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full relative z-10"
      >
        {/* CARD */}
        <div className="bg-card rounded-2xl border border-border/50 shadow-2xl overflow-hidden backdrop-blur-sm">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-primary/90 to-primary p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.1] bg-[length:16px_16px]" />
            <h1 className="text-3xl font-bold text-primary-foreground mb-2 relative z-10">
              {showResetPassword
                ? "Reset Password"
                : isSignUp
                  ? "Create Account"
                  : "Welcome Back"}
            </h1>
            <p className="text-primary-foreground/80 relative z-10">
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
                  className="mb-6 p-4 bg-green-500/15 border border-green-500/30 rounded-xl"
                >
                  <p className="text-green-600 dark:text-green-400 text-sm">{successMessage}</p>
                </motion.div>
              )}

              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 bg-destructive/15 border border-destructive/30 rounded-xl"
                >
                  <p className="text-destructive text-sm">{errorMessage}</p>
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
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
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
                      className={`w-full pl-10 pr-4 py-3 bg-muted/30 border ${errors.email ? "border-destructive focus:ring-destructive/30" : "border-input focus:ring-primary/30"} rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none`}
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive mt-2">{errors.email}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-medium shadow-lg shadow-primary/20"
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
                  className="w-full text-muted-foreground hover:text-foreground py-2 text-sm transition-colors"
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
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
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
                      className={`w-full pl-10 pr-4 py-3 bg-muted/30 border ${errors.email ? "border-destructive focus:ring-destructive/30" : "border-input focus:ring-primary/30"} rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none`}
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive mt-2">{errors.email}</p>
                  )}
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password
                    {isSignUp && (
                      <span className="text-muted-foreground text-xs font-normal ml-1">
                        (min. 6 characters)
                      </span>
                    )}
                  </label>
                  <div className="relative group">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
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
                      className={`w-full pl-10 pr-12 py-3 bg-muted/30 border ${errors.password ? "border-destructive focus:ring-destructive/30" : "border-input focus:ring-primary/30"} rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none`}
                      disabled={loading}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive mt-2">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* CONFIRM PASSWORD (SIGN UP ONLY) */}
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
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
                        className={`w-full pl-10 pr-12 py-3 bg-muted/30 border ${errors.confirmPassword ? "border-destructive focus:ring-destructive/30" : "border-input focus:ring-primary/30"} rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none`}
                        disabled={loading}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="text-muted-foreground hover:text-foreground transition-colors p-1"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-destructive mt-2">
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
                      className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-medium shadow-lg shadow-primary/20"
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
                <div className="text-center pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
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
              <div className="mt-8 p-4 bg-muted/50 rounded-xl border border-border/50">
                <p className="text-sm text-muted-foreground text-center">
                  <strong>Demo Account:</strong> demo@example.com / demodemo
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground text-sm">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
