/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg' {
  import React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '@grrr/utils' {
  export function debounce<T extends (...args: any[]) => any>(fn: T, wait: number): T;
}

declare module '@grrr/utils' {
  export function parseJson(jsonString: string | null): any;
}

declare module 'dompurify' {
  const DOMPurify: {
    sanitize: (dirty: string, config?: any) => string;
  };
  export default DOMPurify;
}
