import type { Metadata, Viewport } from "next";
import { Host_Grotesk } from "next/font/google";
import { ContactMenuProvider } from "@/components/ContactMenu";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { site } from "@/content/site";
import "./globals.css";

const host = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host",
  display: "swap",
});

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
    <html lang="en" className={host.variable}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
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
