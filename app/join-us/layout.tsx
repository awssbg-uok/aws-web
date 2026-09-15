import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Us",
  description:
    "Apply to become an official member of the AWS Student Builder Group at the University of Kelaniya. Gain access to cloud mentorship, workshops, and builder networking.",
  openGraph: {
    title: "Join Us | AWS Student Builder Group UOK",
    description:
      "Register to join the official AWS Student Builder Group at the University of Kelaniya and accelerate your cloud career.",
    url: "/join-us",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join Us | AWS Student Builder Group UOK",
    description:
      "Register to join the official AWS Student Builder Group at the University of Kelaniya and accelerate your cloud career.",
  },
};

export default function JoinUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
