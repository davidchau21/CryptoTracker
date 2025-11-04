
import { Link } from "react-router-dom";

const NavbarLogo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="w-10 h-10 bg-gradient-to-br from-crypto-purple to-crypto-blue rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-xl">CT</span>
      </div>
      <span className="text-xl font-bold hidden sm:inline-block bg-gradient-to-r from-crypto-purple to-crypto-blue bg-clip-text text-transparent">
        CryptoTracker
      </span>
    </Link>
  );
};

export default NavbarLogo;
