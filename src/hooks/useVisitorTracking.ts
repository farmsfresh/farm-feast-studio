import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";

export const useVisitorTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const logVisitor = async () => {
      try {
        await supabase.functions.invoke("log-visitor", {
          body: {
            page_path: location.pathname,
            referrer: document.referrer || "",
          },
        });
      } catch (error) {
        // Silently fail - visitor tracking shouldn't break the app
        console.debug("Visitor tracking failed:", error);
      }
    };

    logVisitor();
  }, [location.pathname]);
};
