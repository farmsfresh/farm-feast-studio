import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAccess = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdminAccess = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin'
      });

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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!mounted) return;
      
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
