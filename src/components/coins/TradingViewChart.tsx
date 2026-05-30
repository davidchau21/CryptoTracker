import { useEffect, useRef } from "react";

interface TradingViewChartProps {
  symbol: string;
  theme: "dark" | "light";
}

let tvScriptLoadingPromise: Promise<void> | null = null;

const TradingViewChart = ({ symbol, theme }: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onLoadScriptRef = useRef<(() => void) | null>(null);

  // Format symbol to Binance pair
  const cleanSymbol = symbol.toUpperCase();
  const tvSymbol = `BINANCE:${cleanSymbol}USDT`;

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = () => resolve();
        script.onerror = () => resolve(); // Avoid blocking if script fails to load
        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => {
      if (onLoadScriptRef.current) {
        onLoadScriptRef.current();
      }
    });

    return () => {
      onLoadScriptRef.current = null;
    };

    function createWidget() {
      // Ensure the element still exists and window.TradingView is defined
      if (
        containerRef.current &&
        document.getElementById("tradingview_chart_container") &&
        (window as any).TradingView
      ) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: "D",
          timezone: "Etc/UTC",
          theme: theme,
          style: "1",
          locale: "vi",
          toolbar_bg: theme === "dark" ? "#0F1623" : "#f1f3f6",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: "tradingview_chart_container",
          studies: ["RSI@tv-basicstudies", "MASimple@tv-basicstudies"],
          loading_screen: {
            backgroundColor: theme === "dark" ? "#090d16" : "#ffffff",
          },
        });
      }
    }
  }, [tvSymbol, theme]);

  return (
    <div
      className="tradingview-widget-container w-full h-full"
      ref={containerRef}
    >
      <div
        id="tradingview_chart_container"
        className="w-full h-full"
        style={{ minHeight: "410px" }}
      />
    </div>
  );
};

export default TradingViewChart;
