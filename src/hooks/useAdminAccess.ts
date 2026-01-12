import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAccess = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAdminAccess = async (userId: string) => {
      try {
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: userId,
          _role: 'admin'
        });

        if (mounted) {
          if (error) {
            console.error("Error checking admin role:", error);
            setIsAdmin(false);
          } else {
            setIsAdmin(data === true);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Admin access check failed:", err);
        if (mounted) {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    };

    // Listen for auth state changes - this handles INITIAL_SESSION on page load
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (session?.user) {
          // User is authenticated - check admin status
          await checkAdminAccess(session.user.id);
        } else {
          // No session - not an admin
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, loading };
};
