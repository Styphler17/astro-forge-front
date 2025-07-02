/// <reference types="vite/client" />

declare global {
  interface Window {
    gsap: {
      to: (target: string | Element, vars: Record<string, unknown>) => void;
      from: (target: string | Element, vars: Record<string, unknown>) => void;
      timeline: () => unknown;
    };
  }
}

export {};
