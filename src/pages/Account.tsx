import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ShoppingBag, Heart, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const Account = () => {
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
              Welcome Back
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6">
              My <span className="text-gold">Account</span>
            </h1>
            <p className="text-cream/70 text-lg">
              Manage your profile, orders, and preferences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Account Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Create Account</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <div className="bg-card rounded-xl p-8 border border-border">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-6">
                      <User className="w-8 h-8 text-gold" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-foreground text-center mb-8">
                      Sign In to Your Account
                    </h2>
                    <form className="space-y-6">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="john@example.com" className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="••••••••" className="mt-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                          <input type="checkbox" className="rounded border-border" />
                          Remember me
                        </label>
                        <a href="#" className="text-sm text-gold hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <Button variant="gold" size="lg" className="w-full">
                        Sign In
                      </Button>
                    </form>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="register">
                <div className="bg-card rounded-xl p-8 border border-border">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-6">
                      <User className="w-8 h-8 text-gold" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-foreground text-center mb-8">
                      Create an Account
                    </h2>
                    <form className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" placeholder="John" className="mt-2" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" placeholder="Doe" className="mt-2" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="registerEmail">Email Address</Label>
                        <Input id="registerEmail" type="email" placeholder="john@example.com" className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="registerPassword">Password</Label>
                        <Input id="registerPassword" type="password" placeholder="••••••••" className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" placeholder="••••••••" className="mt-2" />
                      </div>
                      <Button variant="gold" size="lg" className="w-full">
                        Create Account
                      </Button>
                    </form>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                { icon: ShoppingBag, title: "Order History", desc: "Track all your past orders" },
                { icon: Heart, title: "Favorites", desc: "Save your favorite dishes" },
                { icon: Settings, title: "Preferences", desc: "Customize your experience" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Account;
