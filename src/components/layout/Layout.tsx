import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ChatBot } from "@/components/chat/ChatBot";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatBot />
    </div>
  );
};
