import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "react-hot-toast";
import { fontEmber, fontEmberMono } from "./fonts";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://aws-uok.com"),
  title: {
    default: "AWS Student Builder Group - University of Kelaniya",
    template: "%s | AWS Student Builder Group UOK",
  },
  description:
    "Official website of the AWS Student Builder Group at the University of Kelaniya — empowering university students with hands-on cloud skills, AWS certifications, and innovative builder projects.",
  openGraph: {
    title: "AWS Student Builder Group - University of Kelaniya",
    description:
      "Official community website of the AWS Student Builder Group at the University of Kelaniya. Join student cloud builders, workshops, and hackathons.",
    url: "https://aws-uok.com",
    siteName: "AWS Student Builder Group UOK",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AWS Student Builder Group UOK",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AWS Student Builder Group - University of Kelaniya",
    description:
      "Official community website of the AWS Student Builder Group at the University of Kelaniya.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/aws-sbg-icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        suppressHydrationWarning
        className={`${inter.className} ${fontEmber.variable} ${fontEmberMono.variable} flex flex-col min-h-screen bg-gray-50`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
