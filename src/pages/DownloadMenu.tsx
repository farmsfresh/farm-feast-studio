import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Loader2, FileText, FileSpreadsheet } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DownloadMenu = () => {
  const [loadingCSV, setLoadingCSV] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);

  const fetchMenuData = async () => {
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

    if (!menuItems) return null;

    const categoryMap = new Map(categories?.map(c => [c.id, c.name]) || []);

    return { menuItems, categoryMap };
  };

  const downloadCSV = async () => {
    setLoadingCSV(true);
    
    const data = await fetchMenuData();
    if (!data) {
      setLoadingCSV(false);
      return;
    }

    const { menuItems, categoryMap } = data;

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

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `menu-items-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setLoadingCSV(false);
  };

  const downloadPDF = async () => {
    setLoadingPDF(true);
    
    const data = await fetchMenuData();
    if (!data) {
      setLoadingPDF(false);
      return;
    }

    const { menuItems, categoryMap } = data;

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text("Menu Items", 14, 22);
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare table data
    const tableData = menuItems.map(item => [
      item.name || "",
      (item.description || "").substring(0, 50) + ((item.description?.length || 0) > 50 ? "..." : ""),
      `$${(item.price || 0).toFixed(2)}`,
      categoryMap.get(item.category_id) || "",
      item.is_available ? "Yes" : "No",
      (item.dietary_tags || []).join(", ")
    ]);

    autoTable(doc, {
      head: [["Name", "Description", "Price", "Category", "Available", "Dietary Tags"]],
      body: tableData,
      startY: 35,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 50 },
        2: { cellWidth: 20 },
        3: { cellWidth: 25 },
        4: { cellWidth: 18 },
        5: { cellWidth: 35 }
      }
    });

    doc.save(`menu-items-${new Date().toISOString().split("T")[0]}.pdf`);
    
    setLoadingPDF(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Download Menu Items</h1>
        <p className="text-muted-foreground mb-6">
          Choose your preferred format to download the menu items.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={downloadCSV} disabled={loadingCSV || loadingPDF} size="lg" className="gap-2">
            {loadingCSV ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Preparing...
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4" />
                Download CSV
              </>
            )}
          </Button>
          <Button onClick={downloadPDF} disabled={loadingCSV || loadingPDF} size="lg" variant="outline" className="gap-2">
            {loadingPDF ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Preparing...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DownloadMenu;
