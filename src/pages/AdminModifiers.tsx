import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminAccess } from "@/hooks/useAdminAccess";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  XCircle,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Settings2,
  DollarSign,
  Link2,
} from "lucide-react";

interface ModifierCategory {
  id: string;
  name: string;
  description: string | null;
  is_required: boolean | null;
  max_selections: number | null;
  display_order: number;
}

interface Modifier {
  id: string;
  modifier_category_id: string;
  name: string;
  price: number;
  is_available: boolean | null;
  display_order: number;
}

interface MenuItem {
  id: string;
  name: string;
  category_name: string;
}

interface MenuItemModifier {
  id: string;
  menu_item_id: string;
  modifier_category_id: string;
  is_required: boolean | null;
  min_selections: number | null;
  max_selections: number | null;
}

const AdminModifiers = () => {
  const [categories, setCategories] = useState<ModifierCategory[]>([]);
  const [modifiers, setModifiers] = useState<Modifier[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [itemModifiers, setItemModifiers] = useState<MenuItemModifier[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { isAdmin, loading: adminLoading } = useAdminAccess();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Category dialog state
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ModifierCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    is_required: false,
    max_selections: "",
  });

  // Modifier dialog state
  const [modifierDialogOpen, setModifierDialogOpen] = useState(false);
  const [editingModifier, setEditingModifier] = useState<Modifier | null>(null);
  const [modifierCategoryId, setModifierCategoryId] = useState<string>("");
  const [modifierForm, setModifierForm] = useState({
    name: "",
    price: "",
    is_available: true,
  });

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "category" | "modifier"; id: string; name: string } | null>(null);

  // Items dialog state
  const [itemsDialogOpen, setItemsDialogOpen] = useState(false);
  const [itemsDialogCategoryId, setItemsDialogCategoryId] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const loading = adminLoading || dataLoading;

  useEffect(() => {
    if (isAdmin === true) {
      fetchData();
    } else if (isAdmin === false) {
      setDataLoading(false);
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setDataLoading(true);
    const [categoriesRes, modifiersRes, menuItemsRes, itemModifiersRes] = await Promise.all([
      supabase.from("modifier_categories").select("*").order("display_order"),
      supabase.from("modifiers").select("*").order("display_order"),
      supabase.from("menu_items").select("id, name, category_id, menu_categories(name)").order("name"),
      supabase.from("menu_item_modifiers").select("*"),
    ]);

    if (categoriesRes.error) {
      toast({ title: "Error", description: "Failed to fetch categories", variant: "destructive" });
    } else {
      setCategories(categoriesRes.data || []);
    }

    if (modifiersRes.error) {
      toast({ title: "Error", description: "Failed to fetch modifiers", variant: "destructive" });
    } else {
      setModifiers(modifiersRes.data || []);
    }

    if (menuItemsRes.error) {
      toast({ title: "Error", description: "Failed to fetch menu items", variant: "destructive" });
    } else {
      const items = (menuItemsRes.data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        category_name: item.menu_categories?.name || "Unknown",
      }));
      setMenuItems(items);
    }

    if (itemModifiersRes.error) {
      toast({ title: "Error", description: "Failed to fetch item modifiers", variant: "destructive" });
    } else {
      setItemModifiers(itemModifiersRes.data || []);
    }

    setDataLoading(false);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // Category CRUD
  const openCategoryDialog = (category?: ModifierCategory) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        description: category.description || "",
        is_required: category.is_required || false,
        max_selections: category.max_selections?.toString() || "",
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: "", description: "", is_required: false, max_selections: "" });
    }
    setCategoryDialogOpen(true);
  };

  const saveCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast({ title: "Error", description: "Category name is required", variant: "destructive" });
      return;
    }

    const categoryData = {
      name: categoryForm.name.trim(),
      description: categoryForm.description.trim() || null,
      is_required: categoryForm.is_required,
      max_selections: categoryForm.max_selections ? parseInt(categoryForm.max_selections) : null,
    };

    if (editingCategory) {
      const { error } = await supabase
        .from("modifier_categories")
        .update(categoryData)
        .eq("id", editingCategory.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update category", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Category updated" });
        fetchData();
      }
    } else {
      const maxOrder = Math.max(0, ...categories.map((c) => c.display_order));
      const { error } = await supabase
        .from("modifier_categories")
        .insert({ ...categoryData, display_order: maxOrder + 1 });

      if (error) {
        toast({ title: "Error", description: "Failed to create category", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Category created" });
        fetchData();
      }
    }

    setCategoryDialogOpen(false);
  };

  // Modifier CRUD
  const openModifierDialog = (categoryId: string, modifier?: Modifier) => {
    setModifierCategoryId(categoryId);
    if (modifier) {
      setEditingModifier(modifier);
      setModifierForm({
        name: modifier.name,
        price: modifier.price.toString(),
        is_available: modifier.is_available ?? true,
      });
    } else {
      setEditingModifier(null);
      setModifierForm({ name: "", price: "0", is_available: true });
    }
    setModifierDialogOpen(true);
  };

  const saveModifier = async () => {
    if (!modifierForm.name.trim()) {
      toast({ title: "Error", description: "Modifier name is required", variant: "destructive" });
      return;
    }

    const modifierData = {
      name: modifierForm.name.trim(),
      price: parseFloat(modifierForm.price) || 0,
      is_available: modifierForm.is_available,
      modifier_category_id: modifierCategoryId,
    };

    if (editingModifier) {
      const { error } = await supabase
        .from("modifiers")
        .update(modifierData)
        .eq("id", editingModifier.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update modifier", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Modifier updated" });
        fetchData();
      }
    } else {
      const categoryModifiers = modifiers.filter((m) => m.modifier_category_id === modifierCategoryId);
      const maxOrder = Math.max(0, ...categoryModifiers.map((m) => m.display_order));
      const { error } = await supabase
        .from("modifiers")
        .insert({ ...modifierData, display_order: maxOrder + 1 });

      if (error) {
        toast({ title: "Error", description: "Failed to create modifier", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Modifier created" });
        fetchData();
      }
    }

    setModifierDialogOpen(false);
  };

  // Delete
  const confirmDelete = (type: "category" | "modifier", id: string, name: string) => {
    setDeleteTarget({ type, id, name });
    setDeleteDialogOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;

    const table = deleteTarget.type === "category" ? "modifier_categories" : "modifiers";
    const { error } = await supabase.from(table).delete().eq("id", deleteTarget.id);

    if (error) {
      toast({ title: "Error", description: `Failed to delete ${deleteTarget.type}`, variant: "destructive" });
    } else {
      toast({ title: "Success", description: `${deleteTarget.name} deleted` });
      fetchData();
    }

    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const getModifiersForCategory = (categoryId: string) =>
    modifiers.filter((m) => m.modifier_category_id === categoryId);

  const getLinkedItemsForCategory = (categoryId: string) =>
    itemModifiers
      .filter((im) => im.modifier_category_id === categoryId)
      .map((im) => menuItems.find((mi) => mi.id === im.menu_item_id))
      .filter(Boolean) as MenuItem[];

  // Items linking
  const openItemsDialog = (categoryId: string) => {
    setItemsDialogCategoryId(categoryId);
    const linkedItemIds = itemModifiers
      .filter((im) => im.modifier_category_id === categoryId)
      .map((im) => im.menu_item_id);
    setSelectedItems(new Set(linkedItemIds));
    setItemsDialogOpen(true);
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const saveItemLinks = async () => {
    const currentLinks = itemModifiers.filter((im) => im.modifier_category_id === itemsDialogCategoryId);
    const currentItemIds = new Set(currentLinks.map((l) => l.menu_item_id));

    // Items to add
    const toAdd = [...selectedItems].filter((id) => !currentItemIds.has(id));
    // Items to remove
    const toRemove = currentLinks.filter((l) => !selectedItems.has(l.menu_item_id)).map((l) => l.id);

    let hasError = false;

    // Remove unlinked items
    if (toRemove.length > 0) {
      const { error } = await supabase
        .from("menu_item_modifiers")
        .delete()
        .in("id", toRemove);
      if (error) hasError = true;
    }

    // Add new links
    if (toAdd.length > 0) {
      const category = categories.find((c) => c.id === itemsDialogCategoryId);
      const newLinks = toAdd.map((itemId) => ({
        menu_item_id: itemId,
        modifier_category_id: itemsDialogCategoryId,
        is_required: category?.is_required || false,
        min_selections: category?.is_required ? 1 : 0,
        max_selections: category?.max_selections || null,
      }));
      const { error } = await supabase.from("menu_item_modifiers").insert(newLinks);
      if (error) hasError = true;
    }

    if (hasError) {
      toast({ title: "Error", description: "Failed to update item links", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Item links updated" });
      fetchData();
    }

    setItemsDialogOpen(false);
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
            <Link to="/admin" className="inline-flex items-center gap-2 text-cream/70 hover:text-gold mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <span className="inline-block px-4 py-2 rounded-full bg-gold/20 text-gold text-sm font-medium tracking-wide mb-6 ml-4">
              Admin
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6">
              Modifier <span className="text-gold">Management</span>
            </h1>
            <p className="text-cream/70 text-lg">
              Add, edit, and delete modifier categories and their options.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Add Category Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Modifier Categories</h2>
            <Button onClick={() => openCategoryDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>

          {/* Categories List */}
          <div className="space-y-4">
            {categories.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <Settings2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No modifier categories yet. Create one to get started.</p>
              </div>
            ) : (
              categories.map((category) => {
                const categoryModifiers = getModifiersForCategory(category.id);
                const isExpanded = expandedCategories.has(category.id);

                return (
                  <div key={category.id} className="bg-card rounded-xl border border-border overflow-hidden">
                    {/* Category Header */}
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <h3 className="font-medium text-foreground">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {categoryModifiers.length} option{categoryModifiers.length !== 1 ? "s" : ""}
                            {category.is_required && " • Required"}
                            {category.max_selections && ` • Max ${category.max_selections}`}
                          </p>
                          {(() => {
                            const linkedItems = getLinkedItemsForCategory(category.id);
                            return linkedItems.length > 0 ? (
                              <p className="text-xs text-gold mt-1">
                                Linked to: {linkedItems.slice(0, 3).map((i) => i.name).join(", ")}
                                {linkedItems.length > 3 && ` +${linkedItems.length - 3} more`}
                              </p>
                            ) : null;
                          })()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openItemsDialog(category.id)}
                          title="Link menu items"
                        >
                          <Link2 className="w-4 h-4 text-gold" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openCategoryDialog(category)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDelete("category", category.id, category.name)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    {/* Modifiers Table */}
                    {isExpanded && (
                      <div className="border-t border-border">
                        <div className="p-4 bg-muted/30">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium text-muted-foreground">Options</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openModifierDialog(category.id)}
                              className="gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              Add Option
                            </Button>
                          </div>
                          {categoryModifiers.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No options in this category yet.
                            </p>
                          ) : (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Price</TableHead>
                                  <TableHead>Available</TableHead>
                                  <TableHead className="w-24">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {categoryModifiers.map((modifier) => (
                                  <TableRow key={modifier.id}>
                                    <TableCell className="font-medium">{modifier.name}</TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-1">
                                        <DollarSign className="w-3 h-3 text-muted-foreground" />
                                        {modifier.price.toFixed(2)}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                          modifier.is_available
                                            ? "bg-green-500/20 text-green-500"
                                            : "bg-red-500/20 text-red-500"
                                        }`}
                                      >
                                        {modifier.is_available ? "Yes" : "No"}
                                      </span>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex gap-1">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => openModifierDialog(category.id, modifier)}
                                        >
                                          <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => confirmDelete("modifier", modifier.id, modifier.name)}
                                        >
                                          <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "New Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory ? "Update the category details." : "Create a new modifier category."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name *</Label>
              <Input
                id="cat-name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g., Toppings"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Optional description"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="cat-required">Required</Label>
              <Switch
                id="cat-required"
                checked={categoryForm.is_required}
                onCheckedChange={(checked) => setCategoryForm((f) => ({ ...f, is_required: checked }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-max">Max Selections</Label>
              <Input
                id="cat-max"
                type="number"
                min="1"
                value={categoryForm.max_selections}
                onChange={(e) => setCategoryForm((f) => ({ ...f, max_selections: e.target.value }))}
                placeholder="Leave empty for unlimited"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveCategory}>
              {editingCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modifier Dialog */}
      <Dialog open={modifierDialogOpen} onOpenChange={setModifierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingModifier ? "Edit Option" : "New Option"}</DialogTitle>
            <DialogDescription>
              {editingModifier ? "Update the modifier option." : "Add a new modifier option."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="mod-name">Name *</Label>
              <Input
                id="mod-name"
                value={modifierForm.name}
                onChange={(e) => setModifierForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g., Extra Cheese"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mod-price">Price ($)</Label>
              <Input
                id="mod-price"
                type="number"
                step="0.01"
                min="0"
                value={modifierForm.price}
                onChange={(e) => setModifierForm((f) => ({ ...f, price: e.target.value }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="mod-available">Available</Label>
              <Switch
                id="mod-available"
                checked={modifierForm.is_available}
                onCheckedChange={(checked) => setModifierForm((f) => ({ ...f, is_available: checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModifierDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveModifier}>
              {editingModifier ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.type}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"?
              {deleteTarget?.type === "category" && " This will also delete all options in this category."}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Link Items Dialog */}
      <Dialog open={itemsDialogOpen} onOpenChange={setItemsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Link Menu Items</DialogTitle>
            <DialogDescription>
              Select which menu items should use the "{categories.find((c) => c.id === itemsDialogCategoryId)?.name}" modifier category.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4">
            {(() => {
              // Group items by category
              const grouped = menuItems.reduce((acc, item) => {
                if (!acc[item.category_name]) acc[item.category_name] = [];
                acc[item.category_name].push(item);
                return acc;
              }, {} as Record<string, MenuItem[]>);

              return Object.entries(grouped).map(([categoryName, items]) => (
                <div key={categoryName} className="mb-4">
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">{categoryName}</h4>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onCheckedChange={() => toggleItemSelection(item.id)}
                        />
                        <span className="text-sm text-foreground">{item.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveItemLinks}>
              Save Links
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminModifiers;
