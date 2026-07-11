import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Jabbar Khan | App and Web Developer",
    template: "%s | Jabbar Khan",
  },
  description:
    "Premium portfolio website for Jabbar Khan, a modern App and Web Developer focused on high-converting digital experiences.",
  keywords: [
    "portfolio",
    "App and Web Developer",
    "App Developer",
    "Web Developer",
    "next.js",
    "typescript",
    "tailwind css",
  ],
  openGraph: {
    title: "Jabbar Khan | App and Web Developer",
    description:
      "Premium portfolio website for Jabbar Khan, a modern frontend engineer and product designer focused on high-converting digital experiences.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jabbar Khan | App and Web Developer",
    description:
      "Premium portfolio website for Jabbar Khan, a modern App and Web Developer focused on high-converting digital experiences.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-primary overflow-x-hidden scroll-smooth"
        suppressHydrationWarning={true}
      >
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
