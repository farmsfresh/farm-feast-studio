import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {
  UtensilsCrossed,
  Search,
  RefreshCw,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  XCircle,
  ArrowLeft,
  FolderOpen,
  DollarSign,
  ImageIcon,
  Check,
  X,
  Eye,
  EyeOff,
  FolderInput,
  GripVertical,
  Copy,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  parent_category_id: string | null;
  display_order: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  image_url: string | null;
  is_available: boolean;
  display_order: number;
}

// Sortable row components
interface SortableCategoryRowProps {
  category: Category;
  menuItems: MenuItem[];
  getCategoryName: (id: string) => string;
  openCategoryDialog: (cat: Category) => void;
  confirmDelete: (type: "item" | "category", id: string, name: string) => void;
}

function SortableCategoryRow({
  category,
  menuItems,
  getCategoryName,
  openCategoryDialog,
  confirmDelete,
}: SortableCategoryRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(isDragging && "opacity-50 bg-muted/50")}
    >
      <TableCell className="w-10">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted transition-colors"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      </TableCell>
      <TableCell className="font-medium">
        <span className={cn(category.parent_category_id && "pl-6 text-muted-foreground")}>
          {category.parent_category_id && "↳ "}
          {category.name}
        </span>
      </TableCell>
      <TableCell>
        {category.parent_category_id
          ? getCategoryName(category.parent_category_id)
          : <span className="text-muted-foreground">—</span>}
      </TableCell>
      <TableCell>
        {menuItems.filter((i) => i.category_id === category.id).length}
      </TableCell>
      <TableCell>{category.display_order}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openCategoryDialog(category)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => confirmDelete("category", category.id, category.name)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface SortableMenuItemRowProps {
  item: MenuItem;
  isSelected: boolean;
  toggleSelectItem: (id: string) => void;
  getCategoryName: (id: string) => string;
  toggleItemAvailability: (item: MenuItem) => void;
  openItemDialog: (item: MenuItem) => void;
  confirmDelete: (type: "item" | "category", id: string, name: string) => void;
  duplicateItem: (item: MenuItem) => void;
  isDragDisabled: boolean;
}

function SortableMenuItemRow({
  item,
  isSelected,
  toggleSelectItem,
  getCategoryName,
  toggleItemAvailability,
  openItemDialog,
  confirmDelete,
  duplicateItem,
  isDragDisabled,
}: SortableMenuItemRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: isDragDisabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(isDragging && "opacity-50 bg-muted/50")}
      data-state={isSelected ? "selected" : undefined}
    >
      <TableCell className="w-10">
        <button
          {...attributes}
          {...listeners}
          className={cn(
            "cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted transition-colors",
            isDragDisabled && "opacity-30 cursor-not-allowed"
          )}
          disabled={isDragDisabled}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      </TableCell>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => toggleSelectItem(item.id)}
        />
      </TableCell>
      <TableCell>
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          </div>
        )}
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium">{item.name}</p>
          {item.description && (
            <p className="text-sm text-muted-foreground truncate max-w-xs">
              {item.description}
            </p>
          )}
        </div>
      </TableCell>
      <TableCell>{getCategoryName(item.category_id)}</TableCell>
      <TableCell className="font-bold text-gold">
        ${Number(item.price).toFixed(2)}
      </TableCell>
      <TableCell>
        <Switch
          checked={item.is_available}
          onCheckedChange={() => toggleItemAvailability(item)}
        />
      </TableCell>
      <TableCell>{item.display_order}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => duplicateItem(item)}
            title="Duplicate item"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openItemDialog(item)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => confirmDelete("item", item.id, item.name)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

const AdminMenu = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Dialog states
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [bulkCategoryDialogOpen, setBulkCategoryDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "item" | "category"; id: string; name: string } | null>(null);

  // Bulk selection states
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [bulkCategoryId, setBulkCategoryId] = useState<string>("");

  // Form states
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image_url: "",
    is_available: true,
    display_order: 0,
  });
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    parent_category_id: "",
    display_order: 0,
  });

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
    
    const [categoriesRes, itemsRes] = await Promise.all([
      supabase.from("menu_categories").select("*").order("display_order"),
      supabase.from("menu_items").select("*").order("display_order"),
    ]);

    if (categoriesRes.error) {
      toast({ title: "Error", description: "Failed to fetch categories", variant: "destructive" });
    } else {
      setCategories(categoriesRes.data || []);
    }

    if (itemsRes.error) {
      toast({ title: "Error", description: "Failed to fetch menu items", variant: "destructive" });
    } else {
      setMenuItems(itemsRes.data || []);
    }

    setLoading(false);
  };

  // Item CRUD
  const openItemDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setItemForm({
        name: item.name,
        description: item.description || "",
        price: item.price.toString(),
        category_id: item.category_id,
        image_url: item.image_url || "",
        is_available: item.is_available,
        display_order: item.display_order,
      });
    } else {
      setEditingItem(null);
      setItemForm({
        name: "",
        description: "",
        price: "",
        category_id: categories[0]?.id || "",
        image_url: "",
        is_available: true,
        display_order: 0,
      });
    }
    setItemDialogOpen(true);
  };

  const saveItem = async () => {
    if (!itemForm.name || !itemForm.price || !itemForm.category_id) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const itemData = {
      name: itemForm.name,
      description: itemForm.description || null,
      price: parseFloat(itemForm.price),
      category_id: itemForm.category_id,
      image_url: itemForm.image_url || null,
      is_available: itemForm.is_available,
      display_order: itemForm.display_order,
    };

    if (editingItem) {
      const { error } = await supabase
        .from("menu_items")
        .update(itemData)
        .eq("id", editingItem.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update item", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Item updated successfully" });
        setItemDialogOpen(false);
        fetchData();
      }
    } else {
      const { error } = await supabase.from("menu_items").insert(itemData);

      if (error) {
        toast({ title: "Error", description: "Failed to create item", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Item created successfully" });
        setItemDialogOpen(false);
        fetchData();
      }
    }
  };

  // Duplicate item
  const duplicateItem = async (item: MenuItem) => {
    const maxOrder = Math.max(...menuItems.map((i) => i.display_order), 0);
    const duplicateData = {
      name: `${item.name} (Copy)`,
      description: item.description,
      price: item.price,
      category_id: item.category_id,
      image_url: item.image_url,
      is_available: item.is_available,
      display_order: maxOrder + 1,
    };

    const { error } = await supabase.from("menu_items").insert(duplicateData);

    if (error) {
      toast({ title: "Error", description: "Failed to duplicate item", variant: "destructive" });
    } else {
      toast({ title: "Success", description: `"${item.name}" duplicated successfully` });
      fetchData();
    }
  };

  // Category CRUD
  const openCategoryDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        parent_category_id: category.parent_category_id || "",
        display_order: category.display_order,
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: "",
        parent_category_id: "",
        display_order: 0,
      });
    }
    setCategoryDialogOpen(true);
  };

  const saveCategory = async () => {
    if (!categoryForm.name) {
      toast({ title: "Error", description: "Please enter a category name", variant: "destructive" });
      return;
    }

    const categoryData = {
      name: categoryForm.name,
      parent_category_id: categoryForm.parent_category_id || null,
      display_order: categoryForm.display_order,
    };

    if (editingCategory) {
      const { error } = await supabase
        .from("menu_categories")
        .update(categoryData)
        .eq("id", editingCategory.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update category", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Category updated successfully" });
        setCategoryDialogOpen(false);
        fetchData();
      }
    } else {
      const { error } = await supabase.from("menu_categories").insert(categoryData);

      if (error) {
        toast({ title: "Error", description: "Failed to create category", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Category created successfully" });
        setCategoryDialogOpen(false);
        fetchData();
      }
    }
  };

  // Delete
  const confirmDelete = (type: "item" | "category", id: string, name: string) => {
    setDeleteTarget({ type, id, name });
    setDeleteDialogOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;

    const table = deleteTarget.type === "item" ? "menu_items" : "menu_categories";
    const { error } = await supabase.from(table).delete().eq("id", deleteTarget.id);

    if (error) {
      toast({ title: "Error", description: `Failed to delete ${deleteTarget.type}`, variant: "destructive" });
    } else {
      toast({ title: "Success", description: `${deleteTarget.type === "item" ? "Item" : "Category"} deleted successfully` });
      fetchData();
    }

    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const toggleItemAvailability = async (item: MenuItem) => {
    const { error } = await supabase
      .from("menu_items")
      .update({ is_available: !item.is_available })
      .eq("id", item.id);

    if (error) {
      toast({ title: "Error", description: "Failed to update availability", variant: "destructive" });
    } else {
      setMenuItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_available: !i.is_available } : i))
      );
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  const getParentCategories = () => categories.filter((c) => !c.parent_category_id);

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Bulk selection handlers
  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map((i) => i.id)));
    }
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  // Bulk actions
  const bulkToggleAvailability = async (makeAvailable: boolean) => {
    const ids = Array.from(selectedItems);
    const { error } = await supabase
      .from("menu_items")
      .update({ is_available: makeAvailable })
      .in("id", ids);

    if (error) {
      toast({ title: "Error", description: "Failed to update items", variant: "destructive" });
    } else {
      toast({ title: "Success", description: `${ids.length} items updated` });
      setMenuItems((prev) =>
        prev.map((i) => (selectedItems.has(i.id) ? { ...i, is_available: makeAvailable } : i))
      );
      clearSelection();
    }
  };

  const bulkDelete = async () => {
    const ids = Array.from(selectedItems);
    const { error } = await supabase.from("menu_items").delete().in("id", ids);

    if (error) {
      toast({ title: "Error", description: "Failed to delete items", variant: "destructive" });
    } else {
      toast({ title: "Success", description: `${ids.length} items deleted` });
      fetchData();
      clearSelection();
    }
    setBulkDeleteDialogOpen(false);
  };

  const bulkChangeCategory = async () => {
    if (!bulkCategoryId) {
      toast({ title: "Error", description: "Please select a category", variant: "destructive" });
      return;
    }

    const ids = Array.from(selectedItems);
    const { error } = await supabase
      .from("menu_items")
      .update({ category_id: bulkCategoryId })
      .in("id", ids);

    if (error) {
      toast({ title: "Error", description: "Failed to update items", variant: "destructive" });
    } else {
      toast({ title: "Success", description: `${ids.length} items moved to ${getCategoryName(bulkCategoryId)}` });
      setMenuItems((prev) =>
        prev.map((i) => (selectedItems.has(i.id) ? { ...i, category_id: bulkCategoryId } : i))
      );
      clearSelection();
    }
    setBulkCategoryDialogOpen(false);
    setBulkCategoryId("");
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Drag handlers
  const handleCategoryDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const activeCategory = categories.find((c) => c.id === active.id);
    const overCategory = categories.find((c) => c.id === over.id);
    
    if (!activeCategory || !overCategory) return;

    // Subcategories can only be reordered within their parent group
    if (activeCategory.parent_category_id !== overCategory.parent_category_id) {
      // If dragging a subcategory onto a parent, check if it's the same parent
      if (activeCategory.parent_category_id && !overCategory.parent_category_id) {
        // Allow dropping on parent only if it's the active item's parent
        if (overCategory.id !== activeCategory.parent_category_id) {
          toast({ 
            title: "Invalid move", 
            description: "Subcategories can only be reordered within their parent category",
            variant: "destructive"
          });
          return;
        }
      } else {
        toast({ 
          title: "Invalid move", 
          description: "Subcategories can only be reordered within their parent category",
          variant: "destructive"
        });
        return;
      }
    }

    // If both are subcategories, ensure they have the same parent
    if (activeCategory.parent_category_id && overCategory.parent_category_id) {
      if (activeCategory.parent_category_id !== overCategory.parent_category_id) {
        toast({ 
          title: "Invalid move", 
          description: "Subcategories can only be reordered within their parent category",
          variant: "destructive"
        });
        return;
      }
    }

    // Reorder within the organized list
    const oldIndex = organizedCategories.findIndex((c) => c.id === active.id);
    const newIndex = organizedCategories.findIndex((c) => c.id === over.id);

    const reordered = arrayMove([...organizedCategories], oldIndex, newIndex);
    
    // Rebuild categories array with updated display_order
    // Parent categories get their own sequence, subcategories get sequence within parent
    const parentCats = reordered.filter(c => !c.parent_category_id);
    const updatedCategories: Category[] = [];
    
    parentCats.forEach((parent, parentIdx) => {
      updatedCategories.push({ ...parent, display_order: parentIdx });
      const children = reordered
        .filter(c => c.parent_category_id === parent.id);
      children.forEach((child, childIdx) => {
        updatedCategories.push({ ...child, display_order: childIdx });
      });
    });
    
    setCategories(updatedCategories);

    // Update display_order in database
    for (const cat of updatedCategories) {
      await supabase
        .from("menu_categories")
        .update({ display_order: cat.display_order })
        .eq("id", cat.id);
    }

    toast({ title: "Success", description: "Category order updated" });
  };

  const handleItemDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const oldIndex = filteredItems.findIndex((i) => i.id === active.id);
    const newIndex = filteredItems.findIndex((i) => i.id === over.id);

    // Reorder in full menu items array based on filtered items order
    const reorderedFiltered = arrayMove(filteredItems, oldIndex, newIndex);
    
    // Build new full array maintaining positions
    const reordered = menuItems.map((item) => {
      const filteredIdx = reorderedFiltered.findIndex((f) => f.id === item.id);
      if (filteredIdx !== -1) {
        return { ...item, display_order: filteredIdx };
      }
      return item;
    });
    
    setMenuItems(reordered);

    // Update display_order in database for filtered items
    const updates = reorderedFiltered.map((item, idx) => ({
      id: item.id,
      display_order: idx,
    }));

    for (const update of updates) {
      await supabase
        .from("menu_items")
        .update({ display_order: update.display_order })
        .eq("id", update.id);
    }

    toast({ title: "Success", description: "Item order updated" });
  };

  // Organize categories hierarchically for display
  const organizedCategories = useMemo(() => {
    const parentCategories = categories.filter(c => !c.parent_category_id);
    const result: Category[] = [];
    
    parentCategories.forEach(parent => {
      result.push(parent);
      const children = categories
        .filter(c => c.parent_category_id === parent.id)
        .sort((a, b) => a.display_order - b.display_order);
      result.push(...children);
    });
    
    return result;
  }, [categories]);

  // Memoized IDs for sortable context
  const categoryIds = useMemo(() => organizedCategories.map((c) => c.id), [organizedCategories]);
  const filteredItemIds = useMemo(() => filteredItems.map((i) => i.id), [filteredItems]);

  // Check if drag should be disabled (when filtering/searching)
  const isDragDisabled = searchTerm !== "" || categoryFilter !== "all";

  // Stats
  const totalItems = menuItems.length;
  const availableItems = menuItems.filter((i) => i.is_available).length;
  const totalCategories = categories.length;
  const avgPrice = menuItems.length > 0 
    ? (menuItems.reduce((sum, i) => sum + Number(i.price), 0) / menuItems.length).toFixed(2) 
    : "0.00";

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
                You don't have permission to access the admin dashboard.
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
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-gold hover:text-gold/80 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Admin
            </Link>
            <span className="inline-block px-4 py-2 rounded-full bg-gold/20 text-gold text-sm font-medium tracking-wide mb-6">
              Menu Management
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6">
              Food <span className="text-gold">Menu</span>
            </h1>
            <p className="text-cream/70 text-lg">
              Manage your menu categories and items.
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
                  <UtensilsCrossed className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Items</p>
                  <p className="text-2xl font-bold text-foreground">{totalItems}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Available</p>
                  <p className="text-2xl font-bold text-foreground">{availableItems}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Categories</p>
                  <p className="text-2xl font-bold text-foreground">{totalCategories}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Avg. Price</p>
                  <p className="text-2xl font-bold text-foreground">${avgPrice}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button onClick={() => openItemDialog()} className="gap-2 bg-gold text-forest hover:bg-gold/90">
              <Plus className="w-4 h-4" />
              Add Menu Item
            </Button>
            <Button onClick={() => openCategoryDialog()} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>

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
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchData} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>

          {/* Categories Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-semibold text-foreground">Categories</h2>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                <GripVertical className="w-3 h-3 inline mr-1" />
                Drag to reorder
              </span>
            </div>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleCategoryDragEnd}
                >
                  <SortableContext items={categoryIds} strategy={verticalListSortingStrategy}>
                    <TableBody>
                      {organizedCategories.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <FolderOpen className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No categories found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        organizedCategories.map((category) => (
                          <SortableCategoryRow
                            key={category.id}
                            category={category}
                            menuItems={menuItems}
                            getCategoryName={getCategoryName}
                            openCategoryDialog={openCategoryDialog}
                            confirmDelete={confirmDelete}
                          />
                        ))
                      )}
                    </TableBody>
                  </SortableContext>
                </DndContext>
              </Table>
            </div>
          </div>

          {/* Menu Items Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-foreground">Menu Items</h2>
                {!isDragDisabled && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    <GripVertical className="w-3 h-3 inline mr-1" />
                    Drag to reorder
                  </span>
                )}
                {isDragDisabled && (
                  <span className="text-xs text-yellow-600 bg-yellow-500/10 px-2 py-1 rounded">
                    Clear filters to reorder
                  </span>
                )}
              </div>
              {selectedItems.size > 0 && (
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2">
                  <span className="text-sm font-medium">{selectedItems.size} selected</span>
                  <div className="h-4 w-px bg-border" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => bulkToggleAvailability(true)}
                    className="gap-1 text-green-600 hover:text-green-700"
                  >
                    <Eye className="w-4 h-4" />
                    Enable
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => bulkToggleAvailability(false)}
                    className="gap-1 text-yellow-600 hover:text-yellow-700"
                  >
                    <EyeOff className="w-4 h-4" />
                    Disable
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBulkCategoryDialogOpen(true)}
                    className="gap-1"
                  >
                    <FolderInput className="w-4 h-4" />
                    Move
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBulkDeleteDialogOpen(true)}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                  <div className="h-4 w-px bg-border" />
                  <Button variant="ghost" size="sm" onClick={clearSelection}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={filteredItems.length > 0 && selectedItems.size === filteredItems.length}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleItemDragEnd}
                >
                  <SortableContext items={filteredItemIds} strategy={verticalListSortingStrategy}>
                    <TableBody>
                      {filteredItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8">
                            <UtensilsCrossed className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No menu items found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredItems.map((item) => (
                          <SortableMenuItemRow
                            key={item.id}
                            item={item}
                            isSelected={selectedItems.has(item.id)}
                            toggleSelectItem={toggleSelectItem}
                            getCategoryName={getCategoryName}
                            toggleItemAvailability={toggleItemAvailability}
                            openItemDialog={openItemDialog}
                            confirmDelete={confirmDelete}
                            duplicateItem={duplicateItem}
                            isDragDisabled={isDragDisabled}
                          />
                        ))
                      )}
                    </TableBody>
                  </SortableContext>
                </DndContext>
              </Table>
            </div>
          </div>
        </div>
      </section>

      {/* Item Dialog */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="item-name">Name *</Label>
              <Input
                id="item-name"
                value={itemForm.name}
                onChange={(e) => setItemForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Item name"
              />
            </div>
            <div>
              <Label htmlFor="item-description">Description</Label>
              <Textarea
                id="item-description"
                value={itemForm.description}
                onChange={(e) => setItemForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Item description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="item-price">Price *</Label>
                <Input
                  id="item-price"
                  type="number"
                  step="0.01"
                  value={itemForm.price}
                  onChange={(e) => setItemForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="item-order">Display Order</Label>
                <Input
                  id="item-order"
                  type="number"
                  value={itemForm.display_order}
                  onChange={(e) => setItemForm((f) => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="item-category">Category *</Label>
              <Select
                value={itemForm.category_id}
                onValueChange={(value) => setItemForm((f) => ({ ...f, category_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="item-image">Image URL</Label>
              <Input
                id="item-image"
                value={itemForm.image_url}
                onChange={(e) => setItemForm((f) => ({ ...f, image_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="item-available"
                checked={itemForm.is_available}
                onCheckedChange={(checked) => setItemForm((f) => ({ ...f, is_available: checked }))}
              />
              <Label htmlFor="item-available">Available for ordering</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveItem} className="bg-gold text-forest hover:bg-gold/90">
              {editingItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="category-name">Name *</Label>
              <Input
                id="category-name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Category name"
              />
            </div>
            <div>
              <Label htmlFor="category-parent">Parent Category</Label>
              <Select
                value={categoryForm.parent_category_id || "none"}
                onValueChange={(value) => setCategoryForm((f) => ({ ...f, parent_category_id: value === "none" ? "" : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None (top-level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (top-level)</SelectItem>
                  {getParentCategories()
                    .filter((c) => c.id !== editingCategory?.id)
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category-order">Display Order</Label>
              <Input
                id="category-order"
                type="number"
                value={categoryForm.display_order}
                onChange={(e) => setCategoryForm((f) => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveCategory} className="bg-gold text-forest hover:bg-gold/90">
              {editingCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.type === "item" ? "Menu Item" : "Category"}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedItems.size} items?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete these {selectedItems.size} menu items? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={bulkDelete} className="bg-destructive text-destructive-foreground">
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Category Change Dialog */}
      <Dialog open={bulkCategoryDialogOpen} onOpenChange={setBulkCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Move {selectedItems.size} items to category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="bulk-category">Select Category</Label>
            <Select value={bulkCategoryId} onValueChange={setBulkCategoryId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={bulkChangeCategory} className="bg-gold text-forest hover:bg-gold/90">
              Move Items
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminMenu;
