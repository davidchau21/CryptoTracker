import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const renderPageItems = () => {
    const items: React.ReactNode[] = [];

    // Always show first page
    items.push(
      <button
        key="page-1"
        onClick={() => onPageChange(1)}
        className={cn(
          "h-10 w-10 flex items-center justify-center rounded-xl font-medium transition-all duration-300 shadow-sm",
          currentPage === 1
            ? "bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-indigo-500/30 scale-105"
            : "glass-panel hover:bg-white/80 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300",
        )}
      >
        1
      </button>,
    );

    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    if (startPage > 2) {
      items.push(
        <span
          key="ellipsis-start"
          className="flex h-10 w-6 items-center justify-center text-gray-400"
        >
          ...
        </span>,
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <button
          key={`page-${i}`}
          onClick={() => onPageChange(i)}
          className={cn(
            "h-10 w-10 flex items-center justify-center rounded-xl font-medium transition-all duration-300 shadow-sm",
            currentPage === i
              ? "bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-indigo-500/30 scale-105"
              : "glass-panel hover:bg-white/80 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300",
          )}
        >
          {i}
        </button>,
      );
    }

    if (endPage < totalPages - 1) {
      items.push(
        <span
          key="ellipsis-end"
          className="flex h-10 w-6 items-center justify-center text-gray-400"
        >
          ...
        </span>,
      );
    }

    // Always show last page
    if (totalPages > 1) {
      items.push(
        <button
          key={`page-${totalPages}`}
          onClick={() => onPageChange(totalPages)}
          className={cn(
            "h-10 w-10 flex items-center justify-center rounded-xl font-medium transition-all duration-300 shadow-sm",
            currentPage === totalPages
              ? "bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-indigo-500/30 scale-105"
              : "glass-panel hover:bg-white/80 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300",
          )}
        >
          {totalPages}
        </button>,
      );
    }

    return items;
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-6 pb-4">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Prev Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={cn(
            "flex items-center justify-center gap-1 h-10 px-4 rounded-xl font-medium transition-all duration-300 shadow-sm",
            currentPage === 1
              ? "glass-panel opacity-50 cursor-not-allowed text-gray-400"
              : "glass-panel hover:bg-white/80 dark:hover:bg-gray-700/80 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:scale-105",
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 sm:gap-2">
          {renderPageItems()}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={cn(
            "flex items-center justify-center gap-1 h-10 px-4 rounded-xl font-medium transition-all duration-300 shadow-sm",
            currentPage === totalPages
              ? "glass-panel opacity-50 cursor-not-allowed text-gray-400"
              : "glass-panel hover:bg-white/80 dark:hover:bg-gray-700/80 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:scale-105",
          )}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3 text-sm text-brand-secondary">
        <span className="font-medium bg-white/40 dark:bg-black/20 px-3 py-1.5 rounded-lg border border-white/50 dark:border-white/10">
          Page{" "}
          <strong className="text-indigo-600 dark:text-indigo-400">
            {currentPage}
          </strong>{" "}
          of <strong>{totalPages}</strong>
        </span>
      </div>
    </div>
  );
};

export default PaginationControls;
