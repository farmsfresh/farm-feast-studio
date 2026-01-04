import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Loader2,
  Search,
  Trash2,
  XCircle,
  Check,
  X,
  Link2,
  Images,
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  category_id: string;
  image_url: string | null;
  price: number;
}

interface Category {
  id: string;
  name: string;
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  url?: string;
  linkedItemId?: string;
}

const AdminMenuImages = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [bulkUploading, setBulkUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");

    if (roles && roles.length > 0) {
      setIsAdmin(true);
      fetchData();
    } else {
      setIsAdmin(false);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    
    const [itemsRes, categoriesRes] = await Promise.all([
      supabase.from("menu_items").select("id, name, category_id, image_url, price").order("name"),
      supabase.from("menu_categories").select("id, name").order("display_order"),
    ]);

    if (itemsRes.data) setMenuItems(itemsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    
    setLoading(false);
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || "Unknown";
  };

  const openUploadDialog = (item: MenuItem) => {
    setSelectedItem(item);
    setUploadDialogOpen(true);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedItem) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Create a unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${selectedItem.id}-${Date.now()}.${fileExt}`;
      const filePath = `menu-items/${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);

      // Update the menu item with the new image URL
      const { error: updateError } = await supabase
        .from("menu_items")
        .update({ image_url: publicUrl })
        .eq("id", selectedItem.id);

      if (updateError) throw updateError;

      // Update local state
      setMenuItems(prev =>
        prev.map(item =>
          item.id === selectedItem.id ? { ...item, image_url: publicUrl } : item
        )
      );

      toast({
        title: "Success",
        description: "Image uploaded and linked successfully",
      });

      setUploadDialogOpen(false);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = async (item: MenuItem) => {
    try {
      const { error } = await supabase
        .from("menu_items")
        .update({ image_url: null })
        .eq("id", item.id);

      if (error) throw error;

      setMenuItems(prev =>
        prev.map(i => (i.id === item.id ? { ...i, image_url: null } : i))
      );

      toast({
        title: "Success",
        description: "Image removed from menu item",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  // Bulk upload handlers
  const handleBulkFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith("image/")) return false;
      if (file.size > 5 * 1024 * 1024) return false;
      return true;
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Some files skipped",
        description: "Only images under 5MB are allowed",
        variant: "destructive",
      });
    }

    const newImages: UploadedImage[] = validFiles.map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false,
    }));

    setUploadedImages(prev => [...prev, ...newImages]);
    
    if (bulkFileInputRef.current) {
      bulkFileInputRef.current.value = "";
    }
  };

  const removeUploadedImage = (id: string) => {
    setUploadedImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter(i => i.id !== id);
    });
  };

  const linkImageToItem = (imageId: string, itemId: string) => {
    setUploadedImages(prev =>
      prev.map(img =>
        img.id === imageId ? { ...img, linkedItemId: itemId } : img
      )
    );
  };

  const uploadAndLinkAll = async () => {
    const imagesToUpload = uploadedImages.filter(img => img.linkedItemId && !img.uploaded);
    
    if (imagesToUpload.length === 0) {
      toast({
        title: "No images to upload",
        description: "Please link images to menu items first",
        variant: "destructive",
      });
      return;
    }

    setBulkUploading(true);

    let successCount = 0;
    let failCount = 0;

    for (const img of imagesToUpload) {
      setUploadedImages(prev =>
        prev.map(i => (i.id === img.id ? { ...i, uploading: true } : i))
      );

      try {
        const fileExt = img.file.name.split(".").pop();
        const fileName = `${img.linkedItemId}-${Date.now()}.${fileExt}`;
        const filePath = `menu-items/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(filePath, img.file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("photos")
          .getPublicUrl(filePath);

        const { error: updateError } = await supabase
          .from("menu_items")
          .update({ image_url: publicUrl })
          .eq("id", img.linkedItemId);

        if (updateError) throw updateError;

        setUploadedImages(prev =>
          prev.map(i =>
            i.id === img.id ? { ...i, uploading: false, uploaded: true, url: publicUrl } : i
          )
        );

        setMenuItems(prev =>
          prev.map(item =>
            item.id === img.linkedItemId ? { ...item, image_url: publicUrl } : item
          )
        );

        successCount++;
      } catch (error) {
        console.error("Upload error:", error);
        setUploadedImages(prev =>
          prev.map(i => (i.id === img.id ? { ...i, uploading: false } : i))
        );
        failCount++;
      }
    }

    setBulkUploading(false);

    toast({
      title: "Bulk upload complete",
      description: `${successCount} uploaded successfully${failCount > 0 ? `, ${failCount} failed` : ""}`,
    });

    // Remove successfully uploaded images after a delay
    setTimeout(() => {
      setUploadedImages(prev => prev.filter(img => !img.uploaded));
    }, 2000);
  };

  const closeBulkDialog = () => {
    uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    setUploadedImages([]);
    setBulkDialogOpen(false);
  };

  const getAvailableItems = () => {
    const linkedItemIds = uploadedImages.map(img => img.linkedItemId).filter(Boolean);
    return menuItems.filter(item => !linkedItemIds.includes(item.id));
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
                You don't have permission to access this page.
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Link to="/admin" className="inline-flex items-center gap-2 text-gold hover:text-gold/80 mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Admin
            </Link>
            <span className="block px-4 py-2 rounded-full bg-gold/20 text-gold text-sm font-medium tracking-wide mb-6 w-fit mx-auto">
              Menu Images
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6">
              Manage <span className="text-gold">Menu Images</span>
            </h1>
            <p className="text-cream/70 text-lg">
              Upload and link images to your menu items.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={() => setBulkDialogOpen(true)}
              className="gap-2"
            >
              <Images className="w-4 h-4" />
              Bulk Upload
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-muted-foreground text-sm">Total Items</p>
              <p className="text-2xl font-bold text-foreground">{menuItems.length}</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-muted-foreground text-sm">With Images</p>
              <p className="text-2xl font-bold text-green-500">
                {menuItems.filter(i => i.image_url).length}
              </p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-muted-foreground text-sm">Without Images</p>
              <p className="text-2xl font-bold text-yellow-500">
                {menuItems.filter(i => !i.image_url).length}
              </p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-muted-foreground text-sm">Categories</p>
              <p className="text-2xl font-bold text-foreground">{categories.length}</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No menu items found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-foreground">{item.name}</p>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {getCategoryName(item.category_id)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gold">
                          ${Number(item.price).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.image_url ? (
                          <span className="inline-flex items-center gap-1 text-green-500 text-sm">
                            <Check className="w-4 h-4" />
                            Has Image
                          </span>
                        ) : (
                          <span className="text-yellow-500 text-sm">No Image</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openUploadDialog(item)}
                            className="gap-1"
                          >
                            <Upload className="w-4 h-4" />
                            {item.image_url ? "Replace" : "Upload"}
                          </Button>
                          {item.image_url && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeImage(item)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Upload Image for "{selectedItem?.name}"
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedItem?.image_url && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.name}
                  className="w-full h-48 object-cover"
                />
                <p className="text-sm text-muted-foreground mt-2">Current image</p>
              </div>
            )}
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin text-gold" />
                    <p className="text-muted-foreground">Uploading...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <p className="text-foreground font-medium">Click to upload</p>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG or WEBP (max 5MB)
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog open={bulkDialogOpen} onOpenChange={(open) => !open && closeBulkDialog()}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Images className="w-5 h-5" />
              Bulk Image Upload
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Upload area */}
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <input
                ref={bulkFileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleBulkFileSelect}
                className="hidden"
                id="bulk-image-upload"
              />
              <label
                htmlFor="bulk-image-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-10 h-10 text-muted-foreground" />
                <p className="text-foreground font-medium">Click to select images</p>
                <p className="text-sm text-muted-foreground">
                  Select multiple PNG, JPG or WEBP files (max 5MB each)
                </p>
              </label>
            </div>

            {/* Uploaded images grid */}
            {uploadedImages.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">
                    {uploadedImages.length} image{uploadedImages.length > 1 ? "s" : ""} selected
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
                        setUploadedImages([]);
                      }}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedImages.map((img) => (
                    <div
                      key={img.id}
                      className={`relative bg-card border rounded-lg overflow-hidden ${
                        img.uploaded ? "border-green-500" : "border-border"
                      }`}
                    >
                      {/* Image preview */}
                      <div className="aspect-video relative">
                        <img
                          src={img.preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        {img.uploading && (
                          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-gold" />
                          </div>
                        )}
                        {img.uploaded && (
                          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                            <Check className="w-8 h-8 text-green-500" />
                          </div>
                        )}
                        {!img.uploaded && !img.uploading && (
                          <button
                            onClick={() => removeUploadedImage(img.id)}
                            className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Link to menu item */}
                      <div className="p-3">
                        <p className="text-xs text-muted-foreground mb-2 truncate">
                          {img.file.name}
                        </p>
                        {!img.uploaded && (
                          <Select
                            value={img.linkedItemId || ""}
                            onValueChange={(value) => linkImageToItem(img.id, value)}
                          >
                            <SelectTrigger className="w-full h-9">
                              <SelectValue placeholder="Link to menu item..." />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableItems().map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  <div className="flex items-center gap-2">
                                    <span>{item.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      ({getCategoryName(item.category_id)})
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                              {img.linkedItemId && (
                                <SelectItem value={img.linkedItemId}>
                                  {menuItems.find(i => i.id === img.linkedItemId)?.name}
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        )}
                        {img.linkedItemId && !img.uploaded && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-green-500">
                            <Link2 className="w-3 h-3" />
                            Linked to: {menuItems.find(i => i.id === img.linkedItemId)?.name}
                          </div>
                        )}
                        {img.uploaded && (
                          <div className="flex items-center gap-1 text-xs text-green-500">
                            <Check className="w-3 h-3" />
                            Uploaded successfully
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upload button */}
                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button variant="outline" onClick={closeBulkDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={uploadAndLinkAll}
                    disabled={bulkUploading || uploadedImages.filter(i => i.linkedItemId && !i.uploaded).length === 0}
                    className="gap-2"
                  >
                    {bulkUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload {uploadedImages.filter(i => i.linkedItemId && !i.uploaded).length} Image{uploadedImages.filter(i => i.linkedItemId && !i.uploaded).length !== 1 ? "s" : ""}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminMenuImages;
