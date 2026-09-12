export interface TeamMember {
  name: string;
  position: string;
  image: string;
  category: "Executive Board" | "Leads & Coordinators" | "Committee";
  linkedin?: string;
  github?: string;
  bio?: string;
  responsibilities?: string[];
  links?: {
    linkedin?: string;
    github?: string;
    builderProfile?: string;
  };
}

export const teamMembers: TeamMember[] = [
  {
    name: "Rusiru Randika",
    position: "President",
    image: "/rusiru.png",
    category: "Executive Board",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    bio: "Passionate about cloud architecture and student leadership, driving cloud computing innovation across University of Kelaniya.",
    responsibilities: [
      "Provides overall vision and strategic direction",
      "Represents the group in high-level university and external engagements",
      "Oversees major decisions and approvals",
      "Leads execution of all ongoing activities",
    ],
    links: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      builderProfile: "https://builder.aws.com",
    },
  },
  {
    name: "Mevindu Basnayake",
    position: "Vice President",
    image: "/mevindu.png",
    category: "Executive Board",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    bio: "Dedicated to collaborative execution and operational excellence, ensuring community milestones and deadlines are achieved.",
    responsibilities: [
      "Leads execution of all ongoing activities in the absence of president",
      "Coordinates between all teams and ensures deadlines are met",
      "Monitors performance of each department",
      "Steps in for President when required",
    ],
    links: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    name: "Thiviru Perera",
    position: "Secretary",
    image: "/thiviru.png",
    category: "Executive Board",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    responsibilities: [
      "Maintains key records and final documentation",
      "Oversees official communications",
    ],
    links: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    name: "Sarani Piyumali",
    position: "Vice Secretary",
    image: "/sarani.png",
    category: "Executive Board",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    responsibilities: [
      "Steps in for secretary when required",
      "Manages meeting schedules, notes, and follow-ups",
      "Handles internal communications and updates",
      "Tracks tasks and ensures completion across teams",
    ],
    links: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    name: "Isharaka Weerasooriya",
    position: "Tech Lead",
    image: "/isharaka.png",
    category: "Leads & Coordinators",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    bio: "Full-stack developer and cloud architect enthusiast, leading the technical foundation and web platforms of the student community.",
    responsibilities: [
      "Guides team on technical implementation",
      "Manages and maintains the official website of the community",
      "Provides technical support for events (registrations, platforms, troubleshooting)",
      "Oversees technical setup for future events (online and physical)",
    ],
    links: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      builderProfile: "https://builder.aws.com",
    },
  },
  {
    name: "Hansaja Wimalasuriya",
    position: "PR Coordinator",
    image: "/hansaja.png",
    category: "Leads & Coordinators",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    responsibilities: [
      "Manages public relations and external communication",
      "Builds partnerships with organizations and sponsors",
      "Oversees and grows the group's social media presence",
      "Plans and schedules posts using a PR tracker",
      "Coordinates with Designing Head and Content Writing Head to deliver timely, high-quality content",
    ],
    links: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    name: "Nethmi Navodya",
    position: "Head of Content Writing",
    image: "/navodya.png",
    category: "Leads & Coordinators",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    responsibilities: [
      "Creates written content for posts and announcements",
      "Manages captions, blogs, and documentation",
      "Writes and manages articles for the official website",
      "Ensures consistent communication tone across all platforms",
      "Works closely with PR Coordinator and Designing Head for content alignment",
    ],
    links: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    name: "Adhithya Fernando",
    position: "Head of Designing",
    image: "/ayodhya.png",
    category: "Leads & Coordinators",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    responsibilities: [
      "Creates visual content for events and promotions",
      "Designs posters, banners, and social media creatives",
      "Maintains brand consistency across all platforms",
      "Works with content team to produce engaging visuals",
      "Supports media coverage for events (photos, videos, reels)",
    ],
    links: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    name: "Pavithra Sewwandi",
    position: "Membership Coordinator",
    image: "/pavithra.png",
    category: "Leads & Coordinators",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    responsibilities: [
      "Manages member registrations and onboarding",
      "Engages with community members",
      "Tracks participation and growth",
    ],
    links: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    name: "Sushan Fernando",
    position: "Junior Treasurer",
    image: "/sushan.png",
    category: "Leads & Coordinators",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    responsibilities: [
      "Handles day-to-day financial tracking (income/expenses)",
      "Maintains transaction records and reports",
      "Prepares event budgets and cost breakdowns",
      "Assists in sponsorship fund management",
    ],
    links: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    name: "Chamaka Piyushan",
    position: "Finance Coordinator",
    image: "/chamaka.png",
    category: "Leads & Coordinators",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    responsibilities: [
      "Handles day-to-day financial tracking (income/expenses)",
      "Maintains transaction records and reports",
      "Prepares event budgets and cost breakdowns",
      "Assists in sponsorship fund management",
    ],
    links: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    name: "Dhanuk Nuwanka",
    position: "1st Year Committee Member (FOS)",
    image: "/dhanuk.png",
    category: "Committee",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    responsibilities: [
      "Act as the main contact point between students of their year/faculty and the board",
      "Promote events and initiatives within their faculty and batch",
      "Encourage student participation and community growth",
      "Assist in onboarding new members",
    ],
    links: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    name: "Ruchira Bandaranayake",
    position: "2nd Year Committee Member (FOS)",
    image: "/ruchira.png",
    category: "Committee",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    responsibilities: [
      "Act as the main contact point between students of their year/faculty and the board",
      "Promote events and initiatives within their faculty and batch",
      "Encourage student participation and community growth",
      "Assist in onboarding new members",
    ],
    links: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    name: "Samuduni",
    position: "3rd Year Committee Member (FOS)",
    image: "/samuduni.png",
    category: "Committee",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    responsibilities: [
      "Act as the main contact point between students of their year/faculty and the board",
      "Promote events and initiatives within their faculty and batch",
      "Encourage student participation and community growth",
      "Assist in onboarding new members",
    ],
    links: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    name: "Poojitha Bandara",
    position: "1st Year Committee Member (FCT)",
    image: "/poojitha.png",
    category: "Committee",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    responsibilities: [
      "Act as the main contact point between students of their year/faculty and the board",
      "Promote events and initiatives within their faculty and batch",
      "Encourage student participation and community growth",
      "Assist in onboarding new members",
    ],
    links: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    name: "Chamath Kanishka",
    position: "2nd Year Committee Member (FCT)",
    image: "/chamath.png",
    category: "Committee",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    responsibilities: [
      "Act as the main contact point between students of their year/faculty and the board",
      "Promote events and initiatives within their faculty and batch",
      "Encourage student participation and community growth",
      "Assist in onboarding new members",
    ],
    links: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    name: "Sandeepa",
    position: "3rd Year Committee Member (FCT)",
    image: "/sandeepa.png",
    category: "Committee",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    responsibilities: [
      "Act as the main contact point between students of their year/faculty and the board",
      "Promote events and initiatives within their faculty and batch",
      "Encourage student participation and community growth",
      "Assist in onboarding new members",
    ],
    links: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
];