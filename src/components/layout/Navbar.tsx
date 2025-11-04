
import { useState } from "react";
import { Moon, Sun, Menu, X, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/ThemeProvider";
import { TrendingSections } from "@/components/home/TrendingSections";
import { useWallet } from "@/providers/WalletProvider";
import NavbarLogo from "./navigation/NavbarLogo";
import MainNavigationMenu from "./navigation/MainNavigationMenu";
import MobileMenu from "./navigation/MobileMenu";

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isConnected, address, connect } = useWallet();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleConnectWallet = () => {
    connect();
  };

  return (
    <>
      <nav className="bg-card py-4 px-6 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <NavbarLogo />
            </div>

            <div className="hidden md:flex items-center gap-4">
              <MainNavigationMenu />
              
              <Button 
                onClick={handleConnectWallet}
                className="bg-gradient-to-r from-crypto-purple to-crypto-blue text-white hover:opacity-90"
              >
                <Wallet className="mr-2 h-4 w-4" />
                {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect Wallet"}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <div className="md:hidden">
                <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>

          {isMobileMenuOpen && (
            <MobileMenu 
              isConnected={isConnected}
              address={address}
              onConnectWallet={handleConnectWallet}
            />
          )}
        </div>
      </nav>
      
      <div className="bg-card border-b border-border py-6 mb-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Today's Cryptocurrency Prices by Market Cap</h1>
          <p className="text-muted-foreground mb-6">
            The global crypto market cap is $1.74T, a 0.53% decrease over the last day.
            <Button variant="link" className="p-0 h-auto text-primary">Read More</Button>
          </p>
          
          <TrendingSections />
        </div>
      </div>
    </>
  );
};

export default Navbar;
