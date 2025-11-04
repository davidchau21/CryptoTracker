
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";

const MainNavigationMenu = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList className="space-x-1">
        <NavigationMenuItem>
          <NavigationMenuLink 
            className="text-foreground hover:text-primary font-medium px-4 py-2 rounded-md transition-colors"
            href="/"
          >
            Cryptocurrencies
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>Exchanges</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[400px] gap-3 p-4">
              <div className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-crypto-purple/10 to-crypto-blue/10 p-4 hover:bg-accent hover:text-accent-foreground no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Top Crypto Exchanges
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Compare all cryptocurrency exchanges, ranked by volume, users and traffic.
                    </p>
                  </a>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuLink 
            className="text-foreground hover:text-primary font-medium px-4 py-2 rounded-md transition-colors"
            href="/"
          >
            NFT
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuLink 
            className="text-foreground hover:text-primary font-medium px-4 py-2 rounded-md transition-colors"
            href="/swap"
          >
            Swap
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuLink 
            className="text-foreground hover:text-primary font-medium px-4 py-2 rounded-md transition-colors"
            href="/"
          >
            Portfolio
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[400px] gap-3 p-4">
              <div className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-crypto-purple/10 to-crypto-blue/10 p-4 hover:bg-accent hover:text-accent-foreground no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Products
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Explore our full suite of crypto market products and services.
                    </p>
                  </a>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuLink 
            className="text-foreground hover:text-primary font-medium px-4 py-2 rounded-md transition-colors"
            href="/"
          >
            Learn
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigationMenu;
