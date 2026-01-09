import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

      const { data: categoriesData } = await supabase
        .from("menu_categories")
        .select("*")
        .order("display_order");

      const { data: itemsData } = await supabase
        .from("menu_items")
        .select("*")
        .order("display_order");

      if (categoriesData) {
        setCategories(categoriesData);
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

  // Get items for a category
  const getItemsForCategory = (categoryId: string) =>
    menuItems.filter(item => item.category_id === categoryId);

  // Render menu item card
  const renderMenuItem = (item: MenuItem) => (
    <div
      key={item.id}
      className="bg-card rounded-xl overflow-hidden border border-border hover:border-gold/30 hover:shadow-elegant transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gold/20 to-forest/20 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-gold font-bold text-lg">
            ${Number(item.price).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
          {item.name}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {cart[item.id] ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => removeFromCart(item.id)}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-destructive/10 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-medium text-foreground w-6 text-center">
                {cart[item.id]}
              </span>
              <button
                onClick={() => addToCart(item.id)}
                className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center hover:bg-gold/30 transition-colors"
              >
                <Plus className="w-4 h-4 text-gold" />
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => addToCart(item.id)}
              className="gap-2 w-full"
            >
              <Plus className="w-4 h-4" />
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );

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
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
          ) : parentCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No menu categories available yet.</p>
            </div>
          ) : (
            <Tabs defaultValue={parentCategories[0]?.id} className="w-full">
              <div className="relative mb-8">
                <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
                <TabsList className="w-full flex-wrap h-auto gap-0 bg-transparent justify-start relative z-10">
                  {parentCategories.map((category, index) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="relative px-6 py-3 text-sm font-medium rounded-t-lg border border-b-0 border-transparent transition-all duration-200
                        data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:text-gold data-[state=active]:shadow-sm
                        data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted data-[state=inactive]:hover:text-foreground
                        data-[state=active]:after:absolute data-[state=active]:after:bottom-[-1px] data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-px data-[state=active]:after:bg-background
                        -ml-px first:ml-0"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {parentCategories.map(parentCategory => {
                const subcategories = getSubcategories(parentCategory.id);
                const hasSubcategories = subcategories.length > 0;
                const directItems = getItemsForCategory(parentCategory.id);

                return (
                  <TabsContent key={parentCategory.id} value={parentCategory.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {hasSubcategories ? (
                        // Nested tabs for subcategories
                        <Tabs defaultValue={subcategories[0]?.id} className="w-full">
                          <div className="flex flex-wrap gap-2 mb-6">
                            {subcategories.map(subcat => (
                              <TabsTrigger
                                key={subcat.id}
                                value={subcat.id}
                                asChild
                              >
                                <button className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-border bg-card hover:bg-accent data-[state=active]:bg-forest data-[state=active]:text-cream data-[state=active]:border-forest">
                                  {subcat.name}
                                </button>
                              </TabsTrigger>
                            ))}
                          </div>

                          {subcategories.map(subcat => {
                            const subcatItems = getItemsForCategory(subcat.id);
                            return (
                              <TabsContent key={subcat.id} value={subcat.id}>
                                {subcatItems.length === 0 ? (
                                  <div className="text-center py-12">
                                    <p className="text-muted-foreground text-lg">
                                      No items available in {subcat.name} yet.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {subcatItems.map(renderMenuItem)}
                                  </div>
                                )}
                              </TabsContent>
                            );
                          })}
                        </Tabs>
                      ) : (
                        // Direct items for categories without subcategories
                        <>
                          {directItems.length === 0 ? (
                            <div className="text-center py-12">
                              <p className="text-muted-foreground text-lg">
                                No items available in {parentCategory.name} yet.
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {directItems.map(renderMenuItem)}
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </div>
      </section>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <Button
            variant="gold"
            size="lg"
            className="gap-3 shadow-lg"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">View Cart ({cartCount})</span>
            <span className="px-3 py-1 bg-forest-dark/20 rounded-full text-sm">
              ${cartTotal.toFixed(2)}
            </span>
          </Button>
        </motion.div>
      )}
    </Layout>
  );
};

export default Order;