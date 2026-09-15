import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about the AWS Student Builder Group at the University of Kelaniya — our mission, vision, and how we empower university builders with cloud knowledge and career opportunities.",
  openGraph: {
    title: "About Us | AWS Student Builder Group UOK",
    description:
      "Learn about our mission, vision, and how we empower students at the University of Kelaniya with hands-on cloud skills.",
    url: "/about-us",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | AWS Student Builder Group UOK",
    description:
      "Learn about our mission, vision, and how we empower students at the University of Kelaniya with hands-on cloud skills.",
  },
};

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
