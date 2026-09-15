import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Resources",
  description:
    "Access curated AWS learning roadmaps, certification guides, community presentation decks, and hands-on cloud tutorials tailored for university builders.",
  openGraph: {
    title: "Learning Resources | AWS Student Builder Group UOK",
    description:
      "Curated AWS learning roadmaps, certification guides, community presentation decks, and cloud tutorials.",
    url: "/resources",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learning Resources | AWS Student Builder Group UOK",
    description:
      "Curated AWS learning roadmaps, certification guides, community presentation decks, and cloud tutorials.",
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
