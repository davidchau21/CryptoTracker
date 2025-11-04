
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useCoinDetails } from "@/hooks/use-coin-details";
import { toast } from "sonner";

// Component imports
import CoinHeader from "@/components/coins/CoinHeader";
import ChartSection from "@/components/coins/ChartSection";
import MarketStats from "@/components/coins/MarketStats";
import PriceRange from "@/components/coins/PriceRange";
import TradingHistory from "@/components/coins/TradingHistory";
import CoinAbout from "@/components/coins/CoinAbout";

const CoinDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [errorDisplayed, setErrorDisplayed] = useState<boolean>(false);
  
  const {
    coinDetails,
    chartData,
    fullMarketData,
    timeRange,
    setTimeRange,
    isLoadingDetails,
    isLoadingChart,
    isLoadingFullMarket,
    error
  } = useCoinDetails(id);

  // For debugging
  useEffect(() => {
    if (coinDetails) {
      console.log("Coin details in component:", coinDetails);
    }
  }, [coinDetails]);

  // Show error toast if there's an issue with the data
  useEffect(() => {
    if (error && !errorDisplayed) {
      toast.error("Error loading data", {
        description: error.message || "Failed to load coin data. Please try again later.",
        duration: 5000
      });
      setErrorDisplayed(true);
    }
  }, [error, errorDisplayed]);

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Invalid Coin ID</h1>
          <p className="text-muted-foreground mb-6">The coin you're looking for does not exist.</p>
          <Button asChild>
            <Link to="/">Go back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error Loading Coin Data</h1>
          <p className="text-muted-foreground mb-6">{error.message || "Failed to load coin details. Please try again later."}</p>
          <Button asChild>
            <Link to="/">Go back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CoinHeader 
        coinDetails={coinDetails} 
        isLoading={isLoadingDetails} 
      />

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="markets">Markets</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <ChartSection 
            chartData={chartData} 
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            isLoading={isLoadingChart}
          />
          <MarketStats 
            coinDetails={coinDetails} 
            isLoading={isLoadingDetails} 
          />
          <PriceRange 
            coinDetails={coinDetails} 
            isLoading={isLoadingDetails} 
          />
        </TabsContent>

        <TabsContent value="markets" className="space-y-8">
          <TradingHistory 
            isLoading={isLoadingFullMarket} 
            marketData={fullMarketData}
          />
        </TabsContent>

        <TabsContent value="about" className="space-y-8">
          <CoinAbout 
            coinDetails={coinDetails} 
            isLoading={isLoadingDetails} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoinDetails;
