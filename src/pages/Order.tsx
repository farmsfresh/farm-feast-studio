import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
interface Category {
  id: string;
  name: string;
  display_order: number;
  parent_category_id: string | null;
}
interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  image_url: string | null;
}
const Order = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const {
    cart,
    addToCart,
    removeFromCart,
    cartTotal,
    cartCount
  } = useCart();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch categories
      const {
        data: categoriesData
      } = await supabase.from("menu_categories").select("*").order("display_order");

      // Fetch menu items
      const {
        data: itemsData
      } = await supabase.from("menu_items").select("*").order("display_order");
      if (categoriesData) {
        setCategories(categoriesData);
        // Set first parent category (not subcategory) as active
        const parentCats = categoriesData.filter(c => !c.parent_category_id);
        if (parentCats.length > 0) {
          setActiveCategory(parentCats[0].id);
        }
      }
      if (itemsData) {
        setMenuItems(itemsData);
      }
      setLoading(false);
    };
    fetchData();
  }, []);
  // Get parent categories (those without parent_category_id)
  const parentCategories = categories.filter(c => !c.parent_category_id);
  
  // Get subcategories for a given parent
  const getSubcategories = (parentId: string) => 
    categories.filter(c => c.parent_category_id === parentId);
  
  // Check if active category is a parent with subcategories
  const activeSubcategories = getSubcategories(activeCategory);
  const hasSubcategories = activeSubcategories.length > 0;
  
  // Get items for active category (including subcategory items if viewing parent)
  const activeItems = hasSubcategories 
    ? [] // Don't show items directly for parent with subcategories
    : menuItems.filter(item => item.category_id === activeCategory);
  
  const activeCategoryName = categories.find(c => c.id === activeCategory)?.name || "";
  const activeParentCategory = categories.find(c => c.id === activeCategory);
  const parentOfActive = activeParentCategory?.parent_category_id 
    ? categories.find(c => c.id === activeParentCategory.parent_category_id)
    : null;
  return <Layout>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-forest to-forest-dark">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-gold/20 text-gold text-sm font-medium tracking-wide mb-6">
              Fresh & Delicious
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6">
              Order <span className="text-gold">Online</span>
            </h1>
            <p className="text-cream/70 text-lg">
              Explore our diverse menu featuring farm-fresh ingredients from around the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Menu */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {loading ? <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div> : <>
              {/* Parent Categories */}
              <div className="mb-6 overflow-x-auto pb-4">
                <div className="flex gap-2 min-w-max">
                  {parentCategories.map(category => {
                    const subcats = getSubcategories(category.id);
                    const isActive = activeCategory === category.id || subcats.some(s => s.id === activeCategory);
                    return (
                      <button 
                        key={category.id} 
                        onClick={() => setActiveCategory(category.id)} 
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                          isActive 
                            ? "bg-gold text-forest-dark" 
                            : "bg-secondary text-foreground hover:bg-gold/20"
                        }`}
                      >
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subcategories (if parent has subcategories) */}
              {hasSubcategories && (
                <div className="mb-8 overflow-x-auto pb-2">
                  <div className="flex gap-2 min-w-max">
                    {activeSubcategories.map(subcat => (
                      <button 
                        key={subcat.id} 
                        onClick={() => setActiveCategory(subcat.id)} 
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-forest/10 text-forest hover:bg-forest/20 border border-forest/20"
                      >
                        {subcat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Breadcrumb for subcategory */}
              {parentOfActive && (
                <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <button 
                    onClick={() => setActiveCategory(parentOfActive.id)}
                    className="hover:text-gold transition-colors"
                  >
                    {parentOfActive.name}
                  </button>
                  <span>/</span>
                  <span className="text-foreground font-medium">{activeCategoryName}</span>
                </div>
              )}

              {/* Menu Items */}
              <motion.div key={activeCategory} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.4
          }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeItems.length === 0 && !hasSubcategories ? <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      No items available in {activeCategoryName} yet.
                    </p>
                    <p className="text-muted-foreground/70 text-sm mt-2">
                      Check back soon for delicious options!
                    </p>
                  </div> : !hasSubcategories && activeItems.map(item => <div key={item.id} className="bg-card rounded-xl overflow-hidden border border-border hover:border-gold/30 hover:shadow-elegant transition-all duration-300">
                      {/* Menu Item Image */}
                      <div className="relative h-48 overflow-hidden">
                        {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" /> : <div className="w-full h-full bg-gradient-to-br from-gold/20 to-forest/20 flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">No image</span>
                          </div>}
                        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-gold font-bold text-lg">
                            ${Number(item.price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Menu Item Content */}
                      <div className="p-5">
                        <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                          {item.name}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          {cart[item.id] ? <div className="flex items-center gap-3">
                              <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-destructive/10 transition-colors">
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="font-medium text-foreground w-6 text-center">
                                {cart[item.id]}
                              </span>
                              <button onClick={() => addToCart(item.id)} className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center hover:bg-gold/30 transition-colors">
                                <Plus className="w-4 h-4 text-gold" />
                              </button>
                            </div> : <Button variant="outline" size="sm" onClick={() => addToCart(item.id)} className="gap-2 w-full">
                              <Plus className="w-4 h-4" />
                              Add to Cart
                            </Button>}
                        </div>
                      </div>
                    </div>)}
              </motion.div>
            </>}
        </div>
      </section>

      {/* Floating Cart */}
      {cartCount > 0 && <motion.div initial={{
      y: 100,
      opacity: 0
    }} animate={{
      y: 0,
      opacity: 1
    }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <Button variant="gold" size="lg" className="gap-3 shadow-lg" onClick={() => navigate("/cart")}>
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">View Cart ({cartCount})</span>
            <span className="px-3 py-1 bg-forest-dark/20 rounded-full text-sm">
              ${cartTotal.toFixed(2)}
            </span>
          </Button>
        </motion.div>}
    </Layout>;
};
export default Order;