
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { SortKey, SortState } from "@/types";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSort: (sortState: SortState) => void;
  currentSort: SortState;
}

const SearchBar = ({ onSearch, onSort, currentSort }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  const handleSort = (key: SortKey) => {
    const direction = currentSort.key === key && currentSort.direction === 'asc' ? 'desc' : 'asc';
    onSort({ key, direction });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <form onSubmit={handleSearch} className="relative flex-grow">
        <Input
          type="text"
          placeholder="Search by name or symbol..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 bg-secondary border-none"
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2 whitespace-nowrap">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Sort & Filter</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleSort('market_cap_rank')}>
            Rank {currentSort.key === 'market_cap_rank' && (currentSort.direction === 'asc' ? '↑' : '↓')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort('current_price')}>
            Price {currentSort.key === 'current_price' && (currentSort.direction === 'asc' ? '↑' : '↓')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort('price_change_percentage_24h')}>
            24h % {currentSort.key === 'price_change_percentage_24h' && (currentSort.direction === 'asc' ? '↑' : '↓')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort('market_cap')}>
            Market Cap {currentSort.key === 'market_cap' && (currentSort.direction === 'asc' ? '↑' : '↓')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort('total_volume')}>
            Volume {currentSort.key === 'total_volume' && (currentSort.direction === 'asc' ? '↑' : '↓')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SearchBar;
