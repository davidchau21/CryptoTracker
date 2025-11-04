
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  onRefresh: () => void;
}

const PageHeader = ({ onRefresh }: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <p className="text-muted-foreground">
          Track prices, market cap, and trading volume for the top cryptocurrencies
        </p>
      </div>
      <Button onClick={onRefresh} variant="outline">
        Refresh Prices
      </Button>
    </div>
  );
};

export default PageHeader;
