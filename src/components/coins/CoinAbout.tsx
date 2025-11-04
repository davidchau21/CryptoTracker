
import { CoinDetails } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Globe, Github, Twitter, Facebook } from "lucide-react";

interface CoinAboutProps {
  coinDetails: CoinDetails | null;
  isLoading: boolean;
}

const CoinAbout = ({ coinDetails, isLoading }: CoinAboutProps) => {
  return (
    <>
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold mb-6">About {coinDetails?.name}</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: coinDetails?.description?.en || 'No description available.' }}
          />
        )}
      </div>

      {!isLoading && coinDetails?.links && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-6">Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coinDetails.links.homepage[0] && (
              <a 
                href={coinDetails.links.homepage[0]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
              >
                <Globe className="h-4 w-4" />
                <span>Website</span>
                <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            )}
            
            {coinDetails.links.repos_url.github[0] && (
              <a 
                href={coinDetails.links.repos_url.github[0]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
                <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            )}
            
            {coinDetails.links.twitter_screen_name && (
              <a 
                href={`https://twitter.com/${coinDetails.links.twitter_screen_name}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-4 w-4" />
                <span>Twitter</span>
                <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            )}
            
            {coinDetails.links.facebook_username && (
              <a 
                href={`https://facebook.com/${coinDetails.links.facebook_username}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
              >
                <Facebook className="h-4 w-4" />
                <span>Facebook</span>
                <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CoinAbout;
