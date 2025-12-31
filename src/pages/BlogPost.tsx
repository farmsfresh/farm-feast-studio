import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Calendar, User, ArrowLeft } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  author: string;
  published_at: string | null;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (data) {
        setPost(data);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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

  if (notFound || !post) {
    return (
      <Layout>
        <section className="pt-32 pb-20 min-h-screen bg-gradient-to-b from-forest to-forest-dark">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto text-center"
            >
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream mb-6">
                Post Not Found
              </h1>
              <p className="text-cream/70 text-lg mb-8">
                Sorry, we couldn't find the blog post you're looking for.
              </p>
              <Link to="/blog">
                <Button variant="gold" size="lg" className="gap-2">
                  <ArrowLeft className="w-5 h-5" />
                  Back to Blog
                </Button>
              </Link>
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
            className="max-w-4xl mx-auto"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-cream/70 hover:text-gold transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-cream mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-cream/70">
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold" />
                {formatDate(post.published_at)}
              </span>
              <span className="flex items-center gap-2">
                <User className="w-5 h-5 text-gold" />
                {post.author}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {post.image_url && (
        <section className="bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto -mt-6"
            >
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-xl shadow-elegant"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <div className="prose prose-lg prose-stone dark:prose-invert max-w-none">
              {post.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-foreground/80 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Share & Navigation */}
            <div className="mt-12 pt-8 border-t border-border">
              <Link to="/blog">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to All Posts
                </Button>
              </Link>
            </div>
          </motion.article>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
