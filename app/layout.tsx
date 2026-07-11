import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { prisma } from "@/lib/prisma";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let isDark = true;
  let primaryColor = "oklch(0.55 0.18 250)";
  let secondaryColor = "oklch(0.60 0.18 280)";
  let accentColor = "oklch(0.65 0.15 200)";
  let borderRadius = "1.0rem";

  try {
    const appearance = await prisma.appearanceSetting.findUnique({
      where: { id: "default" },
    });
    if (appearance) {
      isDark = appearance.darkMode;
      primaryColor = appearance.primaryColor;
      secondaryColor = appearance.secondaryColor;
      accentColor = appearance.accentColor;
      borderRadius = appearance.borderRadius;
    }
  } catch (e) {
    console.error("Failed to load appearance settings in layout:", e);
  }

  const themeStyles = {
    "--primary": primaryColor,
    "--secondary": secondaryColor,
    "--accent": accentColor,
    "--radius": borderRadius,
  } as React.CSSProperties;

  return (
    <html
      lang="en"
      className={`${isDark ? "dark" : ""} ${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
      style={themeStyles}
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
