"use client";

import { motion } from "framer-motion";
import JoinUsForm from "@/components/join-us-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, GraduationCap, Users, Award } from "lucide-react";

export default function JoinUs() {
  return (
    <div className="bg-gray-50 min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Join AWS Student Builder Group UOK</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take your first step towards becoming a cloud computing expert
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Membership Registration 2026</CardTitle>
                <h5 className="font-semibold text-green-600 my-2">Open Now.</h5>
                <div className="space-y-4 text-sm mt-4">
                  <div>
                    <span className="font-semibold">STEP 1:</span> Join our
                    members only whatsapp group.
                    <div className="mt-1">
                      <a
                        href="https://chat.whatsapp.com/LwH3BiTgyxQCcqQXYPvMhj"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Click here to join WhatsApp Group
                      </a>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold">STEP 2:</span> Join the
                    official meetup page for AWS Student Builder Group UOK.
                    <div className="mt-1">
                      <a
                        href="https://www.meetup.com/aws-cloud-club-at-university-of-kelaniya/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Click here to join Meetup Group
                      </a>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold">
                      STEP 3 (FOR NEW MEMBERS):
                    </span>
                    Submit the registration form shown below.
                  </div>
                  <div>
                    <span className="font-semibold">
                      STEP 3 (FOR EXISTING MEMBERS):
                    </span>
                    Login to renew your membership for the year 2026.
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <JoinUsForm />
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-8">
              <h2 className="text-2xl font-bold mb-6">Why Join Us?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    icon: GraduationCap,
                    title: "Learning",
                    description:
                      "Access to AWS training and certification resources",
                  },
                  {
                    icon: Users,
                    title: "Community",
                    description: "Connect with like-minded cloud enthusiasts",
                  },
                  {
                    icon: Briefcase,
                    title: "Career",
                    description: "Job opportunities and industry connections",
                  },
                  {
                    icon: Award,
                    title: "Recognition",
                    description: "AWS certifications and achievements",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="card-hover">
                      <CardContent className="p-6">
                        <div className="rounded-full bg-[#FF9900]/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                          <item.icon className="w-6 h-6 text-[#FF9900]" />
                        </div>
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
