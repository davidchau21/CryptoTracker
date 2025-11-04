
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface MobileMenuProps {
  isConnected: boolean;
  address?: string;
  onConnectWallet: () => void;
}

const MobileMenu = ({ isConnected, address, onConnectWallet }: MobileMenuProps) => {
  return (
    <div className="md:hidden mt-4 pt-4 border-t border-border">
      <div className="flex flex-col space-y-2 mb-4">
        <Link to="/" className="px-2 py-1 hover:bg-secondary rounded">Cryptocurrencies</Link>
        <Link to="/" className="px-2 py-1 hover:bg-secondary rounded">Exchanges</Link>
        <Link to="/" className="px-2 py-1 hover:bg-secondary rounded">NFT</Link>
        <Link to="/" className="px-2 py-1 hover:bg-secondary rounded">Portfolio</Link>
        <Link to="/" className="px-2 py-1 hover:bg-secondary rounded">Watchlist</Link>
        <Link to="/" className="px-2 py-1 hover:bg-secondary rounded">Products</Link>
        <Link to="/" className="px-2 py-1 hover:bg-secondary rounded">Learn</Link>
        
        <Button 
          onClick={onConnectWallet}
          className="w-full bg-gradient-to-r from-crypto-purple to-crypto-blue text-white hover:opacity-90"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect Wallet"}
        </Button>
      </div>
    </div>
  );
};

export default MobileMenu;
