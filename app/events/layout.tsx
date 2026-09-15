import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Workshops",
  description:
    "Discover upcoming hands-on cloud workshops, certification bootcamps, and hackathons hosted by the AWS Student Builder Group at the University of Kelaniya.",
  openGraph: {
    title: "Events & Workshops | AWS Student Builder Group UOK",
    description:
      "Explore upcoming technical sessions, virtual webinars, and cloud builder workshops hosted by AWS Student Builder Group at UOK.",
    url: "/events",
  },
  twitter: {
    card: "summary_large_image",
    title: "Events & Workshops | AWS Student Builder Group UOK",
    description:
      "Explore upcoming technical sessions, virtual webinars, and cloud builder workshops hosted by AWS Student Builder Group at UOK.",
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
