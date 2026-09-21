import type { Metadata, Viewport } from "next";
import { Geist_Mono, Host_Grotesk } from "next/font/google";
import { ContactMenuProvider } from "@/components/ContactMenu";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SiteLoader } from "@/components/SiteLoader";
import { site } from "@/content/site";
import "./globals.css";

const host = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host",
  display: "swap",
});

// Labels, meta and numbers: the technical register.
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
  display: "swap",
});

// Marks the session as seen before first paint, so repeat loads never flash the curtain.
const ENTRY_SCRIPT =
  "try{if(sessionStorage.getItem('lovelace-entry'))document.documentElement.dataset.entry='seen'}catch(e){}";

export const metadata: Metadata = {
  // TODO: set to the production domain.
  metadataBase: new URL("https://lovelacetechnologies.com"),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f1113",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${host.variable} ${mono.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: ENTRY_SCRIPT }} />
        <SiteLoader />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="column-rules" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <SmoothScroll>
          <ContactMenuProvider>
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </ContactMenuProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
