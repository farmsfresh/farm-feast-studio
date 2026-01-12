import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  RefreshCw,
  Loader2,
  XCircle,
  Globe,
  Monitor,
  Smartphone,
  Users,
  Eye,
  MapPin,
  Clock,
  ArrowLeft,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";

interface VisitorLog {
  id: string;
  ip_address: string | null;
  user_agent: string | null;
  page_path: string | null;
  referrer: string | null;
  country: string | null;
  city: string | null;
  created_at: string;
}

const AdminVisitors = () => {
  const [visitors, setVisitors] = useState<VisitorLog[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAdmin, loading: adminLoading } = useAdminAccess();
  const { toast } = useToast();

  const loading = adminLoading || dataLoading;

  useEffect(() => {
    if (isAdmin === true) {
      fetchVisitors();
    } else if (isAdmin === false) {
      setDataLoading(false);
    }
  }, [isAdmin]);

  const fetchVisitors = async () => {
    setDataLoading(true);
    const { data, error } = await supabase
      .from("visitor_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("Error fetching visitors:", error);
      toast({
        title: "Error",
        description: "Failed to fetch visitor logs",
        variant: "destructive",
      });
    } else {
      setVisitors(data || []);
    }
    setDataLoading(false);
  };

  const filteredVisitors = visitors.filter((visitor) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      visitor.ip_address?.toLowerCase().includes(searchLower) ||
      visitor.page_path?.toLowerCase().includes(searchLower) ||
      visitor.user_agent?.toLowerCase().includes(searchLower) ||
      visitor.country?.toLowerCase().includes(searchLower) ||
      visitor.city?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDeviceType = (userAgent: string | null) => {
    if (!userAgent) return "Unknown";
    const ua = userAgent.toLowerCase();
    if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
      return "Mobile";
    }
    if (ua.includes("tablet") || ua.includes("ipad")) {
      return "Tablet";
    }
    return "Desktop";
  };

  const getBrowser = (userAgent: string | null) => {
    if (!userAgent) return "Unknown";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) return "Chrome";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
    if (userAgent.includes("Edg")) return "Edge";
    if (userAgent.includes("Opera") || userAgent.includes("OPR")) return "Opera";
    return "Other";
  };

  // Calculate stats
  const uniqueIPs = new Set(visitors.map(v => v.ip_address)).size;
  const todayVisits = visitors.filter(v => {
    const today = new Date().toDateString();
    return new Date(v.created_at).toDateString() === today;
  }).length;
  const mobileVisits = visitors.filter(v => getDeviceType(v.user_agent) === "Mobile").length;
  const topPages = visitors.reduce((acc, v) => {
    const page = v.page_path || "/";
    acc[page] = (acc[page] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const exportToCSV = () => {
    const headers = ["IP Address", "Country", "City", "Page", "Device", "Browser", "Referrer", "Time"];
    const rows = filteredVisitors.map(visitor => [
      visitor.ip_address || "Unknown",
      visitor.country || "",
      visitor.city || "",
      visitor.page_path || "/",
      getDeviceType(visitor.user_agent),
      getBrowser(visitor.user_agent),
      visitor.referrer || "Direct",
      new Date(visitor.created_at).toISOString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `visitor-logs-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Exported ${filteredVisitors.length} visitor records to CSV`,
    });
  };

  if (loading) {
    return (
      <Layout>
        <section className="pt-32 pb-20 min-h-screen bg-gradient-to-b from-forest to-forest-dark">
          <div className="container mx-auto px-4 lg:px-8 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        </section>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <section className="pt-32 pb-20 min-h-screen bg-gradient-to-b from-forest to-forest-dark">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-destructive/20 flex items-center justify-center">
                <XCircle className="w-12 h-12 text-destructive" />
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream mb-6">
                Access Denied
              </h1>
              <p className="text-cream/70 text-lg">
                You don't have permission to access the visitor analytics.
                Please contact an administrator if you believe this is an error.
              </p>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-forest to-forest-dark">
        <div className="container mx-auto px-4 lg:px-8">
          <Link to="/admin" className="inline-flex items-center gap-2 text-cream/70 hover:text-gold transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-gold/20 text-gold text-sm font-medium tracking-wide mb-6">
              Analytics Dashboard
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6">
              Visitor <span className="text-gold">Analytics</span>
            </h1>
            <p className="text-cream/70 text-lg">
              Track visitor IP addresses, locations, and browsing behavior.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Page Views</p>
                  <p className="text-2xl font-bold text-foreground">{visitors.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Unique Visitors</p>
                  <p className="text-2xl font-bold text-foreground">{uniqueIPs}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Today's Visits</p>
                  <p className="text-2xl font-bold text-foreground">{todayVisits}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Mobile Visits</p>
                  <p className="text-2xl font-bold text-foreground">{mobileVisits}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Pages */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Top Pages</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(topPages)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([page, count]) => (
                <div key={page} className="bg-card border border-border rounded-lg px-4 py-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{page}</span>
                  <span className="text-sm text-gold font-medium">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Visitors Table */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by IP, page, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={fetchVisitors} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportToCSV} className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>

          {/* Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Browser</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Referrer</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisitors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No visitors found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVisitors.map((visitor) => {
                    const deviceType = getDeviceType(visitor.user_agent);
                    const DeviceIcon = deviceType === "Mobile" ? Smartphone : Monitor;
                    return (
                      <TableRow key={visitor.id}>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                            {visitor.ip_address || "Unknown"}
                          </code>
                        </TableCell>
                        <TableCell>
                          <span className="text-foreground">{visitor.page_path || "/"}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DeviceIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{deviceType}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {getBrowser(visitor.user_agent)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {visitor.country || visitor.city ? (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">
                                {[visitor.city, visitor.country].filter(Boolean).join(", ")}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground truncate max-w-32 block">
                            {visitor.referrer || "Direct"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(visitor.created_at)}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminVisitors;
