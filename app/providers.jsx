"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check current user on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Error getting user:", error);
          setError(error.message);
        } else {
          setUser(user);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Failed to check authentication status");
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          setUser(session?.user ?? null);
          setError(null);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setError(null);
        } else if (event === "USER_UPDATED") {
          // Refresh user data if updated
          const {
            data: { user },
          } = await supabase.auth.getUser();
          setUser(user);
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        setError("Authentication error");
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Sign out error:", err);
      setError(err.message || "Failed to sign out");
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;

      // Update local state
      setUser(data.user);
      return { data, error: null };
    } catch (err) {
      console.error("Update profile error:", err);
      return { data: null, error: err };
    }
  };

  // Get user session
  const getSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      return { session, error: null };
    } catch (err) {
      return { session: null, error: err };
    }
  };

  const value = {
    user,
    loading,
    error,
    signOut,
    updateProfile,
    getSession,
    isAuthenticated: !!user,
    // User metadata shortcuts
    userEmail: user?.email,
    userName: user?.user_metadata?.full_name || user?.email?.split("@")[0],
    userAvatar: user?.user_metadata?.avatar_url,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
