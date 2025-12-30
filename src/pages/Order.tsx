import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";

const categories = [
  "Breakfast",
  "Salad",
  "Sandwiches",
  "Power Bowls",
  "Mediterranean",
  "Italian",
  "Thai",
  "Indian",
  "Latin",
  "Jamaican",
  "Appetizers",
  "Desserts",
  "Beverages",
];

const menuItems: Record<string, Array<{ id: number; name: string; description: string; price: number }>> = {
  Breakfast: [
    { id: 1, name: "Farm Fresh Eggs Benedict", description: "Poached eggs with hollandaise on artisan bread", price: 14.99 },
    { id: 2, name: "Avocado Toast", description: "Smashed avocado, cherry tomatoes, microgreens", price: 12.99 },
    { id: 3, name: "Açaí Bowl", description: "Organic açaí, granola, fresh berries, honey", price: 13.99 },
    { id: 4, name: "Belgian Waffles", description: "Crispy waffles with maple syrup and berries", price: 11.99 },
  ],
  Salad: [
    { id: 5, name: "Garden Harvest Salad", description: "Mixed greens, seasonal vegetables, balsamic", price: 11.99 },
    { id: 6, name: "Caesar Salad", description: "Romaine, parmesan, croutons, house dressing", price: 12.99 },
    { id: 7, name: "Quinoa Power Salad", description: "Quinoa, kale, chickpeas, lemon tahini", price: 14.99 },
  ],
  Sandwiches: [
    { id: 8, name: "Turkey Club", description: "Roasted turkey, bacon, avocado, sourdough", price: 13.99 },
    { id: 9, name: "Grilled Veggie Panini", description: "Zucchini, peppers, goat cheese, pesto", price: 12.99 },
    { id: 10, name: "Pulled Pork Sandwich", description: "Slow-cooked pork, coleslaw, BBQ sauce", price: 14.99 },
  ],
  "Power Bowls": [
    { id: 11, name: "Protein Power Bowl", description: "Grilled chicken, quinoa, roasted vegetables", price: 15.99 },
    { id: 12, name: "Buddha Bowl", description: "Tofu, brown rice, edamame, tahini drizzle", price: 14.99 },
    { id: 13, name: "Salmon Poke Bowl", description: "Fresh salmon, sushi rice, avocado, sesame", price: 17.99 },
  ],
  Mediterranean: [
    { id: 14, name: "Lamb Kofta Plate", description: "Spiced lamb, hummus, tabbouleh, pita", price: 18.99 },
    { id: 15, name: "Falafel Wrap", description: "Crispy falafel, tahini, pickled vegetables", price: 13.99 },
    { id: 16, name: "Greek Moussaka", description: "Layered eggplant, beef, béchamel", price: 16.99 },
  ],
  Italian: [
    { id: 17, name: "Truffle Risotto", description: "Arborio rice, black truffle, parmesan", price: 19.99 },
    { id: 18, name: "Margherita Pizza", description: "San Marzano tomatoes, mozzarella, basil", price: 15.99 },
    { id: 19, name: "Chicken Parmigiana", description: "Breaded chicken, marinara, melted cheese", price: 17.99 },
  ],
  Thai: [
    { id: 20, name: "Pad Thai", description: "Rice noodles, shrimp, tamarind, peanuts", price: 15.99 },
    { id: 21, name: "Green Curry", description: "Coconut curry, vegetables, jasmine rice", price: 14.99 },
    { id: 22, name: "Tom Yum Soup", description: "Spicy lemongrass broth, shrimp, mushrooms", price: 12.99 },
  ],
  Indian: [
    { id: 23, name: "Butter Chicken", description: "Creamy tomato curry, basmati rice, naan", price: 16.99 },
    { id: 24, name: "Vegetable Biryani", description: "Aromatic rice, mixed vegetables, raita", price: 14.99 },
    { id: 25, name: "Lamb Vindaloo", description: "Spicy potato curry, tender lamb", price: 18.99 },
  ],
  Latin: [
    { id: 26, name: "Carne Asada Tacos", description: "Grilled steak, cilantro, onions, salsa verde", price: 14.99 },
    { id: 27, name: "Chicken Burrito Bowl", description: "Rice, beans, guacamole, pico de gallo", price: 13.99 },
    { id: 28, name: "Cuban Sandwich", description: "Roasted pork, ham, swiss, pickles, mustard", price: 14.99 },
  ],
  Jamaican: [
    { id: 29, name: "Jerk Chicken", description: "Spicy grilled chicken, rice and peas", price: 15.99 },
    { id: 30, name: "Curry Goat", description: "Slow-cooked goat, scotch bonnet, potatoes", price: 17.99 },
    { id: 31, name: "Ackee and Saltfish", description: "Traditional breakfast with fried plantains", price: 14.99 },
  ],
  Appetizers: [
    { id: 32, name: "Bruschetta Trio", description: "Tomato basil, olive tapenade, ricotta honey", price: 11.99 },
    { id: 33, name: "Coconut Shrimp", description: "Crispy shrimp, sweet chili dipping sauce", price: 13.99 },
    { id: 34, name: "Spinach Artichoke Dip", description: "Creamy dip with pita chips", price: 10.99 },
  ],
  Desserts: [
    { id: 35, name: "Tiramisu", description: "Classic Italian coffee-soaked dessert", price: 8.99 },
    { id: 36, name: "Crème Brûlée", description: "Vanilla custard, caramelized sugar top", price: 9.99 },
    { id: 37, name: "Chocolate Lava Cake", description: "Warm cake with molten center, ice cream", price: 10.99 },
  ],
  Beverages: [
    { id: 38, name: "Fresh Pressed Juice", description: "Orange, apple, or green blend", price: 5.99 },
    { id: 39, name: "Artisan Coffee", description: "Espresso, latte, or cappuccino", price: 4.99 },
    { id: 40, name: "Herbal Infusions", description: "Chamomile, peppermint, or green tea", price: 3.99 },
  ],
};

const Order = () => {
  const [activeCategory, setActiveCategory] = useState("Breakfast");
  const [cart, setCart] = useState<Record<number, number>>({});

  const addToCart = (id: number) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id]--;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  const cartTotal = Object.entries(cart).reduce((total, [id, qty]) => {
    const item = Object.values(menuItems).flat().find((i) => i.id === Number(id));
    return total + (item?.price || 0) * qty;
  }, 0);

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

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
          {/* Categories */}
          <div className="mb-10 overflow-x-auto pb-4">
            <div className="flex gap-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-gold text-forest-dark"
                      : "bg-secondary text-foreground hover:bg-gold/20"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {menuItems[activeCategory]?.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-xl p-6 border border-border hover:border-gold/30 hover:shadow-elegant transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                      {item.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-gold font-bold text-lg ml-4">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
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
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add to Cart
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <Button variant="gold" size="lg" className="gap-3 shadow-lg">
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
