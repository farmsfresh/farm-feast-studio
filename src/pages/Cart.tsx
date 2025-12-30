import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft,
  CreditCard,
  User,
  Phone,
  Mail,
  MapPin,
  Clock
} from "lucide-react";
import { z } from "zod";

const checkoutSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email is too long"),
  phone: z.string().trim().min(10, "Phone number is required").max(20, "Phone number is too long"),
  address: z.string().trim().min(5, "Address is required").max(500, "Address is too long"),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  deliveryTime: z.string().min(1, "Delivery time is required"),
  notes: z.string().max(1000, "Notes are too long").optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    deliveryDate: "",
    deliveryTime: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const validatedData = checkoutSchema.parse(formData);
      
      // Simulate order submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: "Order Placed Successfully!",
        description: `Thank you, ${validatedData.name}! Your order for ${cartCount} item(s) totaling $${cartTotal.toFixed(2)} has been received. We'll contact you shortly to confirm.`,
      });
      
      clearCart();
      navigate("/order");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof CheckoutFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  if (cartCount === 0) {
    return (
      <Layout>
        <section className="pt-32 pb-20 min-h-screen bg-gradient-to-b from-forest to-forest-dark">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gold/20 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-gold" />
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream mb-6">
                Your Cart is Empty
              </h1>
              <p className="text-cream/70 text-lg mb-8">
                Looks like you haven't added any items to your cart yet. 
                Explore our delicious menu and start ordering!
              </p>
              <Button 
                variant="gold" 
                size="lg" 
                onClick={() => navigate("/order")}
                className="gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Browse Menu
              </Button>
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
            <span className="inline-block px-4 py-2 rounded-full bg-gold/20 text-gold text-sm font-medium tracking-wide mb-6">
              {cartCount} Item{cartCount !== 1 ? "s" : ""} in Cart
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6">
              Your <span className="text-gold">Cart</span>
            </h1>
            <p className="text-cream/70 text-lg">
              Review your order and proceed to checkout.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  Order Items
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/order")}
                  className="gap-2 text-muted-foreground"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Button>
              </div>

              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-card rounded-xl p-4 border border-border flex gap-4"
                >
                  {/* Item Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gold/20 to-forest/20 flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg font-semibold text-foreground truncate">
                      {item.name}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-1 mb-2">
                      {item.description}
                    </p>
                    <p className="text-gold font-bold">
                      ${Number(item.price).toFixed(2)} each
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => updateQuantity(item.id, 0)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-medium text-foreground w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center hover:bg-gold/30 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gold" />
                      </button>
                    </div>

                    <p className="font-bold text-foreground">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Checkout Form */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                  Checkout
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                      <User className="w-4 h-4 text-gold" />
                      Full Name
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p className="text-destructive text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gold" />
                      Email
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-destructive text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gold" />
                      Phone Number
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && (
                      <p className="text-destructive text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gold" />
                      Delivery Address
                    </label>
                    <Textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main St, City, State ZIP"
                      rows={2}
                      className={errors.address ? "border-destructive" : ""}
                    />
                    {errors.address && (
                      <p className="text-destructive text-xs mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gold" />
                        Date
                      </label>
                      <Input
                        name="deliveryDate"
                        type="date"
                        value={formData.deliveryDate}
                        onChange={handleInputChange}
                        min={today}
                        className={errors.deliveryDate ? "border-destructive" : ""}
                      />
                      {errors.deliveryDate && (
                        <p className="text-destructive text-xs mt-1">{errors.deliveryDate}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5">
                        Time
                      </label>
                      <Input
                        name="deliveryTime"
                        type="time"
                        value={formData.deliveryTime}
                        onChange={handleInputChange}
                        className={errors.deliveryTime ? "border-destructive" : ""}
                      />
                      {errors.deliveryTime && (
                        <p className="text-destructive text-xs mt-1">{errors.deliveryTime}</p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5">
                      Special Instructions (Optional)
                    </label>
                    <Textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any dietary requirements or special requests..."
                      rows={2}
                    />
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-border pt-4 mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span className="text-foreground">TBD</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold mt-4">
                      <span className="text-foreground">Total</span>
                      <span className="text-gold">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    className="w-full gap-2 mt-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Place Order
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
