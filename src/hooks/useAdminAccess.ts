import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAccess = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdminAccess = useCallback(async (userId: string) => {
    console.log("[useAdminAccess] Checking admin access for userId:", userId);
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin'
      });

      console.log("[useAdminAccess] has_role result:", { data, error });

      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }
      return data === true;
    } catch (err) {
      console.error("Admin access check failed:", err);
      return false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Initial session check - runs immediately on mount
    const initializeAuth = async () => {
      console.log("[useAdminAccess] Initializing auth check...");
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log("[useAdminAccess] Session:", session ? { userId: session.user.id, email: session.user.email } : null);
      
      if (!mounted) return;
      
      if (session?.user) {
        const adminStatus = await checkAdminAccess(session.user.id);
        console.log("[useAdminAccess] Admin status:", adminStatus);
        if (mounted) {
          setIsAdmin(adminStatus);
          setLoading(false);
        }
      } else {
        console.log("[useAdminAccess] No session found, setting isAdmin to false");
        setIsAdmin(false);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        // Skip INITIAL_SESSION as we handle it above
        if (event === 'INITIAL_SESSION') return;

        if (session?.user) {
          const adminStatus = await checkAdminAccess(session.user.id);
          if (mounted) {
            setIsAdmin(adminStatus);
            setLoading(false);
          }
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminAccess]);

  return { isAdmin, loading };
};
