import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { 
  User as UserIcon, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut, 
  Mail,
  Lock,
  Loader2,
  Shield
} from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Account = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  // Signup form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin status after auth change
        if (session?.user) {
          setTimeout(() => {
            checkAdminStatus(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin");
    
    setIsAdmin(data && data.length > 0);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginErrors({});

    try {
      const validated = loginSchema.parse({ email: loginEmail, password: loginPassword });

      const { error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome Back!",
          description: "You have successfully signed in.",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setLoginErrors(errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSignupErrors({});

    try {
      const validated = signupSchema.parse({
        firstName,
        lastName,
        email: signupEmail,
        password: signupPassword,
        confirmPassword,
      });

      const { error } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          emailRedirectTo: `${window.location.origin}/account`,
          data: {
            first_name: validated.firstName,
            last_name: validated.lastName,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Account Exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Account Created!",
          description: "Welcome to Farms Fresh Food!",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setSignupErrors(errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
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

  // Logged in view
  if (user) {
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
                {user.email}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Account Dashboard */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              {/* User Info Card */}
              <div className="bg-card rounded-xl p-8 border border-border mb-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center">
                    <UserIcon className="w-10 h-10 text-gold" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-serif text-2xl font-bold text-foreground">
                      {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                    </h2>
                    <p className="text-muted-foreground">{user.email}</p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-sm font-medium">
                        <Shield className="w-4 h-4" />
                        Administrator
                      </span>
                    )}
                  </div>
                  <Button variant="outline" onClick={handleLogout} className="gap-2">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link to="/order" className="block">
                  <div className="p-6 rounded-xl bg-card border border-border hover:border-gold/30 hover:shadow-elegant transition-all duration-300">
                    <ShoppingBag className="w-8 h-8 text-gold mb-4" />
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                      Order Food
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Browse our menu and place an order
                    </p>
                  </div>
                </Link>

                <Link to="/quote" className="block">
                  <div className="p-6 rounded-xl bg-card border border-border hover:border-gold/30 hover:shadow-elegant transition-all duration-300">
                    <Heart className="w-8 h-8 text-gold mb-4" />
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                      Get a Quote
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Request catering for your event
                    </p>
                  </div>
                </Link>

                <Link to="/contact" className="block">
                  <div className="p-6 rounded-xl bg-card border border-border hover:border-gold/30 hover:shadow-elegant transition-all duration-300">
                    <Settings className="w-8 h-8 text-gold mb-4" />
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                      Contact Us
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Get in touch with our team
                    </p>
                  </div>
                </Link>

                {isAdmin && (
                  <Link to="/admin" className="block">
                    <div className="p-6 rounded-xl bg-gold/10 border border-gold/30 hover:bg-gold/20 transition-all duration-300">
                      <Shield className="w-8 h-8 text-gold mb-4" />
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                        Admin Dashboard
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Manage orders and content
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  // Logged out view - Login/Signup forms
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
              Welcome
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6">
              My <span className="text-gold">Account</span>
            </h1>
            <p className="text-cream/70 text-lg">
              Sign in or create an account to manage your orders.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Auth Section */}
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
                      <UserIcon className="w-8 h-8 text-gold" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-foreground text-center mb-8">
                      Sign In to Your Account
                    </h2>
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div>
                        <Label htmlFor="loginEmail" className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gold" />
                          Email Address
                        </Label>
                        <Input 
                          id="loginEmail" 
                          type="email" 
                          placeholder="john@example.com" 
                          className={`mt-2 ${loginErrors.email ? "border-destructive" : ""}`}
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                        />
                        {loginErrors.email && (
                          <p className="text-destructive text-xs mt-1">{loginErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="loginPassword" className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-gold" />
                          Password
                        </Label>
                        <Input 
                          id="loginPassword" 
                          type="password" 
                          placeholder="••••••••" 
                          className={`mt-2 ${loginErrors.password ? "border-destructive" : ""}`}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        {loginErrors.password && (
                          <p className="text-destructive text-xs mt-1">{loginErrors.password}</p>
                        )}
                      </div>
                      <Button 
                        type="submit" 
                        variant="gold" 
                        size="lg" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Signing In...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </form>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="register">
                <div className="bg-card rounded-xl p-8 border border-border">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-6">
                      <UserIcon className="w-8 h-8 text-gold" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-foreground text-center mb-8">
                      Create an Account
                    </h2>
                    <form onSubmit={handleSignup} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            placeholder="John" 
                            className={`mt-2 ${signupErrors.firstName ? "border-destructive" : ""}`}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                          {signupErrors.firstName && (
                            <p className="text-destructive text-xs mt-1">{signupErrors.firstName}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            placeholder="Doe" 
                            className={`mt-2 ${signupErrors.lastName ? "border-destructive" : ""}`}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                          {signupErrors.lastName && (
                            <p className="text-destructive text-xs mt-1">{signupErrors.lastName}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="signupEmail" className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gold" />
                          Email Address
                        </Label>
                        <Input 
                          id="signupEmail" 
                          type="email" 
                          placeholder="john@example.com" 
                          className={`mt-2 ${signupErrors.email ? "border-destructive" : ""}`}
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                        />
                        {signupErrors.email && (
                          <p className="text-destructive text-xs mt-1">{signupErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="signupPassword" className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-gold" />
                          Password
                        </Label>
                        <Input 
                          id="signupPassword" 
                          type="password" 
                          placeholder="••••••••" 
                          className={`mt-2 ${signupErrors.password ? "border-destructive" : ""}`}
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                        />
                        {signupErrors.password && (
                          <p className="text-destructive text-xs mt-1">{signupErrors.password}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password" 
                          placeholder="••••••••" 
                          className={`mt-2 ${signupErrors.confirmPassword ? "border-destructive" : ""}`}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {signupErrors.confirmPassword && (
                          <p className="text-destructive text-xs mt-1">{signupErrors.confirmPassword}</p>
                        )}
                      </div>
                      <Button 
                        type="submit" 
                        variant="gold" 
                        size="lg" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Creating Account...
                          </>
                        ) : (
                          "Create Account"
                        )}
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
