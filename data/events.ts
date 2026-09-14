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
    id: 2,
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
