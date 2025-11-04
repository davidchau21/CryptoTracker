
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages?: number;
}

const PaginationControls = ({ currentPage, onPageChange, totalPages = 10 }: PaginationControlsProps) => {
  // Generate page numbers for pagination
  const renderPaginationItems = () => {
    const pageItems = [];
    
    // Always show first page
    pageItems.push(
      <PaginationItem key="page-1">
        <PaginationLink 
          isActive={currentPage === 1} 
          onClick={() => onPageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Calculate range of pages to show
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);
    
    // Add ellipsis if needed
    if (startPage > 2) {
      pageItems.push(
        <PaginationItem key="ellipsis-1">
          <span className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground">
            ...
          </span>
        </PaginationItem>
      );
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => onPageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      pageItems.push(
        <PaginationItem key="ellipsis-2">
          <span className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground">
            ...
          </span>
        </PaginationItem>
      );
    }
    
    // Always show last page
    pageItems.push(
      <PaginationItem key={`page-${totalPages}`}>
        <PaginationLink 
          isActive={currentPage === totalPages} 
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </PaginationLink>
      </PaginationItem>
    );
    
    return pageItems;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {currentPage === 1 ? (
            <span className={cn(
              "flex items-center gap-1 pl-2.5 h-10 px-4 py-2 cursor-not-allowed opacity-50",
              "text-sm rounded-md"
            )}>
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </span>
          ) : (
            <PaginationPrevious 
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            />
          )}
        </PaginationItem>
        
        {renderPaginationItems()}
        
        <PaginationItem>
          {currentPage === totalPages ? (
            <span className={cn(
              "flex items-center gap-1 pr-2.5 h-10 px-4 py-2 cursor-not-allowed opacity-50",
              "text-sm rounded-md"
            )}>
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </span>
          ) : (
            <PaginationNext 
              onClick={() => onPageChange(currentPage + 1)}
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationControls;
