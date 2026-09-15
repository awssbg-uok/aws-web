import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the AWS Student Builder Group leadership team at the University of Kelaniya for partnerships, speaking engagements, sponsorships, or general inquiries.",
  openGraph: {
    title: "Contact Us | AWS Student Builder Group UOK",
    description:
      "Get in touch with the AWS Student Builder Group leadership team at the University of Kelaniya for collaborations, partnerships, or community questions.",
    url: "/contact-us",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | AWS Student Builder Group UOK",
    description:
      "Get in touch with the AWS Student Builder Group leadership team at the University of Kelaniya for collaborations, partnerships, or community questions.",
  },
};

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
