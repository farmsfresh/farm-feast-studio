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

    // Set up auth state listener FIRST - this handles INITIAL_SESSION too
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("[useAdminAccess] Auth state changed:", event, session?.user?.email);
        
        if (!mounted) return;

        if (session?.user) {
          // Defer Supabase calls with setTimeout to prevent deadlock
          setTimeout(async () => {
            if (!mounted) return;
            const adminStatus = await checkAdminAccess(session.user.id);
            console.log("[useAdminAccess] Admin status:", adminStatus);
            if (mounted) {
              setIsAdmin(adminStatus);
              setLoading(false);
            }
          }, 0);
        } else {
          console.log("[useAdminAccess] No session, setting isAdmin to false");
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session (as a fallback)
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("[useAdminAccess] getSession result:", session?.user?.email || null);
      
      // Only process if we haven't already handled via onAuthStateChange
      if (!mounted) return;
      
      if (session?.user) {
        setTimeout(async () => {
          if (!mounted) return;
          const adminStatus = await checkAdminAccess(session.user.id);
          if (mounted) {
            setIsAdmin(adminStatus);
            setLoading(false);
          }
        }, 0);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminAccess]);

  return { isAdmin, loading };
};
