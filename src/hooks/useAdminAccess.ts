import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAccess = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAdminAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          if (mounted) {
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }

        // Use the has_role database function which is a security definer
        // This bypasses RLS and provides reliable admin checks
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: session.user.id,
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

    checkAdminAccess();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Re-check admin status when user signs in
          const { data } = await supabase.rpc('has_role', {
            _user_id: session.user.id,
            _role: 'admin'
          });
          if (mounted) {
            setIsAdmin(data === true);
            setLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          if (mounted) {
            setIsAdmin(false);
            setLoading(false);
          }
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
