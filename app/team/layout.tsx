import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the executive board, technical leads, and coordinators driving builder initiatives, workshops, and community programs for AWS Student Builder Group at the University of Kelaniya.",
  openGraph: {
    title: "Our Team | AWS Student Builder Group UOK",
    description:
      "Meet the student leaders, technical coordinators, and executive team behind the AWS Student Builder Group at UOK.",
    url: "/team",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Team | AWS Student Builder Group UOK",
    description:
      "Meet the student leaders, technical coordinators, and executive team behind the AWS Student Builder Group at UOK.",
  },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
