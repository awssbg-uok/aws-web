export type EventStatus = "open" | "closed" | "opening-soon" | "ended" | "past";

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  category: string;
  status: EventStatus;
  registrationLink: string;
  registrationLinkText: string;
}

export const events: Event[] = [
  {
    id: 1,
    title: "CloudSpark – An Introduction to Cloud Computing and AWS",
    date: "September 30, 2026",
    time: "4:00 PM – 6:00 PM",
    location: "Faculty Board Room, Faculty of Science, University of Kelaniya",
    description:
      "An introductory session on cloud computing and AWS fundamentals featuring guest speaker Mr. Ravindu Nirmal Fernando (Vice President of Engineering, Emojot). Covering cloud computing essentials, core AWS services, real-world applications, industry insights, and an open Q&A session. Open exclusively for University of Kelaniya students.",
    image: "/cloudspark-event.png",
    category: "Technical Session",
    status: "open",
    registrationLink:
      "https://www.meetup.com/aws-sbg-at-university-of-kelaniya/events/316721574/?eventOrigin=group_upcoming_events",
    registrationLinkText: "Register on Meetup",
  },
  {
    id: 2,
    title: "AWS Student Community Day Sri Lanka 2026",
    date: "25 April 2026",
    time: "8 am - 6 pm",
    location: "A8 Auditorium, Faculty of Science,University of Kelaniya",
    description:
      "Get ready for the first AWS Student Community Day in Sri Lanka. Join us for a day filled with insightful sessions, hands on workshops, and networking opportunities with AWS experts and fellow cloud enthusiasts.",
    image: "/event-1.png",
    category: "Conference",
    status: "ended",
    registrationLink: "#",
    registrationLinkText: "Event Ended",
  },
  {
    id: 3,
    title: "Annual General Meeting 2026",
    date: "30 April 2026",
    time: "12:00 PM - 1:00 PM",
    location: "A7 406, Faculty of Science, University of Kelaniya",
    description:
      "Join us for our annual general meeting where we'll discuss the year's achievements, plan for the coming year, and elect the new board members.",
    image: "/event-2.png",
    category: "Meeting",
    status: "ended",
    registrationLink: "#",
    registrationLinkText: "Event Ended",
  },
];
