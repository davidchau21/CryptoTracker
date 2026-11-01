interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    isTrust?: boolean;
    providers?: any[];
    selectedAddress?: string;
    request: (request: { method: string; params?: any[] | Record<string, any> | any }) => Promise<any>;
    on: (eventName: string, callback: (...args: any[]) => void) => void;
    removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
    [key: string]: any;
  } | any;
  trustwallet?: any;
  global?: any;
}
