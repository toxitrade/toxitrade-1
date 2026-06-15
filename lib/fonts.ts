import { Inter } from 'next/font/google';

/**
 * Inter is the default font.
 * Font fetching disabled in this environment - using system fallback.
 */
export const inter = Inter({ 
  subsets: ['latin'],
  fallback: ['system-ui', 'sans-serif'],
  display: 'swap',
  // Disable external fetching
  preload: false,
  style: 'normal',
});

// All other fonts disabled due to network issues
export const FONT_CLASS_MAP: Record<string, string> = {
  Inter: inter.className,
};

declare const Roboto: any;
declare const Poppins: any;
declare const DM_Sans: any;
declare const Lato: any;
declare const Nunito: any;
declare const Open_Sans: any;
declare const Montserrat: any;
declare const Raleway: any;
declare const Source_Sans_3: any;
