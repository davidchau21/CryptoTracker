/* eslint-disable @typescript-eslint/no-explicit-any */
// Polyfill for Node.js globals needed by Moralis and other libraries
declare global {
  interface Window {
    process?: any;
    global?: any;
    Buffer?: any;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

if (typeof window !== 'undefined') {
  // Polyfill process
  if (typeof window.process === 'undefined') {
    window.process = {
      env: {},
      browser: true,
    };
  }

  // Polyfill global
  if (typeof window.global === 'undefined') {
    window.global = window;
  }
}
