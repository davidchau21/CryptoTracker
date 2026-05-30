import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useCoinDetails } from "@/hooks/use-coin-details";

// Layout & Components
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CoinHeader from "@/components/coins/CoinHeader";
import MarketStats from "@/components/coins/MarketStats";
import ChartSection from "@/components/coins/ChartSection";
import CoinAbout from "@/components/coins/CoinAbout";
import RightSidebarDetail from "@/components/coin-detail/RightSidebarDetail";

const CoinDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [errorDisplayed, setErrorDisplayed] = useState<boolean>(false);

  const {
    coinDetails,
    chartData,
    timeRange,
    setTimeRange,
    isLoadingDetails,
    isLoadingChart,
    error,
  } = useCoinDetails(id);

  // Show error toast if there's an issue with the data
  useEffect(() => {
    if (error && !errorDisplayed) {
      toast.error("Error loading data", {
        description:
          error.message || "Failed to load coin data. Please try again later.",
        duration: 5000,
      });
      setErrorDisplayed(true);
    }
  }, [error, errorDisplayed]);

  return (
    <DashboardLayout hideSidebar={true}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Main Content Area (Left Side) */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-8">
          {error ? (
            <div className="glass-panel p-8 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-900/10 text-center">
              <span className="material-symbols-outlined text-4xl text-rose-500 mb-4 block">
                error_outline
              </span>
              <h2 className="text-xl font-bold text-[#0d121c] dark:text-white mb-2">
                Error Loading Coin Data
              </h2>
              <p className="text-rose-600 dark:text-rose-400">
                {error.message ||
                  "Failed to load coin details. Please try again later."}
              </p>
            </div>
          ) : (
            <>
              {/* Top Header Section */}
              <CoinHeader
                coinDetails={coinDetails}
                isLoading={isLoadingDetails}
              />

              {/* Four Statistic Cards */}
              <MarketStats
                coinDetails={coinDetails}
                isLoading={isLoadingDetails}
              />

              {/* Chart Section */}
              <ChartSection
                chartData={chartData}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
                isLoading={isLoadingChart}
                symbol={coinDetails?.symbol}
              />

              {/* About & Price Today Section */}
              <CoinAbout
                coinDetails={coinDetails}
                isLoading={isLoadingDetails}
              />
            </>
          )}
        </div>

        {/* Right Sidebar Area */}
        <div className="lg:col-span-4 xl:col-span-3">
          <RightSidebarDetail />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoinDetails;
