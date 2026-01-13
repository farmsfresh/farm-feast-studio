import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

const DownloadMenu = () => {
  const [loading, setLoading] = useState(false);

  const downloadCSV = async () => {
    setLoading(true);
    
    // Fetch all menu items with categories
    const { data: menuItems } = await supabase
      .from("menu_items")
      .select(`
        id,
        name,
        description,
        price,
        category_id,
        image_url,
        is_available,
        display_order,
        dietary_tags
      `)
      .order("display_order");

    const { data: categories } = await supabase
      .from("menu_categories")
      .select("id, name");

    if (!menuItems) {
      setLoading(false);
      return;
    }

    // Create category lookup
    const categoryMap = new Map(categories?.map(c => [c.id, c.name]) || []);

    // Build CSV content
    const headers = ["id", "name", "description", "price", "category_name", "image_url", "is_available", "display_order", "dietary_tags"];
    
    const rows = menuItems.map(item => {
      const categoryName = categoryMap.get(item.category_id) || "";
      return [
        item.id,
        `"${(item.name || "").replace(/"/g, '""')}"`,
        `"${(item.description || "").replace(/"/g, '""')}"`,
        item.price,
        `"${categoryName}"`,
        item.image_url || "",
        item.is_available,
        item.display_order,
        JSON.stringify(item.dietary_tags || [])
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `menu-items-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Download Menu Items</h1>
        <p className="text-muted-foreground mb-6">
          Click the button below to download all menu items as a CSV file.
        </p>
        <Button onClick={downloadCSV} disabled={loading} size="lg" className="gap-2">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Preparing...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download CSV
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DownloadMenu;
