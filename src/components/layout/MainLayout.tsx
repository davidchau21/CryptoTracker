
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
}

const MainLayout = ({ children, onSearch = () => {} }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={onSearch} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
