"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().trim().toLowerCase().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "8 characters password" }),
  studentId: z.string().trim().toUpperCase().min(5, { message: "Student ID is required." }),
  faculty: z.string().min(1, { message: "Please select your faculty." }),
  year: z.string().min(1, { message: "Please select your year." }),
  contactNumber: z
    .string()
    .min(10, { message: "Contact number is requirred." }),
  address: z.string().min(10, { message: "Address is requirred." }),
  interests: z.string().min(10, {
    message: "Please tell us about your interests (min 10 characters).",
  }),
  linkedin: z
    .string()
    .trim()
    .refine(
      (val) => {
        if (!val) return true;
        const url = val.startsWith("http://") || val.startsWith("https://") ? val : `https://${val}`;
        try { new URL(url); return true; } catch { return false; }
      },
      { message: "Please enter a valid LinkedIn URL." }
    )
    .optional()
    .or(z.literal("")),
  github: z
    .string()
    .trim()
    .refine(
      (val) => {
        if (!val) return true;
        const url = val.startsWith("http://") || val.startsWith("https://") ? val : `https://${val}`;
        try { new URL(url); return true; } catch { return false; }
      },
      { message: "Please enter a valid GitHub URL." }
    )
    .optional()
    .or(z.literal("")),
});

export default function JoinUsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      studentId: "",
      faculty: "",
      year: "",
      contactNumber: "",
      address: "",
      interests: "",
      linkedin: "",
      github: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsSubmitting(true);

    const formatUrl = (url?: string) => {
      if (!url || !url.trim()) return "";
      const trimmed = url.trim();
      return trimmed.startsWith("http://") || trimmed.startsWith("https://") ? trimmed : `https://${trimmed}`;
    };

    const payload = {
      ...values,
      email: values.email.trim().toLowerCase(),
      studentId: values.studentId.trim().toUpperCase(),
      linkedin: formatUrl(values.linkedin),
      github: formatUrl(values.github),
    };

    try {
      const check = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/check-if-exists`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
      if (!check.ok) throw new Error("Failed to submit application");
      //Access body of the response
      const checkData = await check.json();
      if (checkData.exists) {
        toast.error(checkData.message, {
          duration: 5000,
          position: "top-center",
        });
        if (checkData.message?.toLowerCase().includes("student id")) {
          form.setError("studentId", {
            type: "manual",
            message: checkData.message,
          });
        } else if (checkData.message?.toLowerCase().includes("email")) {
          form.setError("email", {
            type: "manual",
            message: checkData.message,
          });
        }
        return;
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) throw new Error("Failed to submit application");

      toast.success("Application submitted successfully!", {
        duration: 2000,
        position: "top-center",
      });
      setSubmitted(true);
      setResponseMessage("Your registration has been completed successfully.");
      form.reset();
    } catch (error) {
      toast.error(
        "There was a problem submitting your application. Please try again.",
        {
          duration: 2000,
          position: "top-center",
        },
      );

      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      {responseMessage && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col gap-6 items-center justify-center py-8"
        >
          <div className="text-center space-y-3 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold shadow-[0_4px_12px_rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {responseMessage}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your application is now pending review by our team. You&apos;ll receive a welcome email once approved, and can log in to your dashboard after that.
            </p>
          </div>
          
          <motion.div 
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative group overflow-hidden bg-gradient-to-b from-white/[0.06] to-transparent bg-[#0c1220]/90 p-6 rounded-2xl border border-white/[0.12] max-w-md w-full text-center space-y-4 shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)]"
          >
            <div className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl" />
            <h3 className="font-bold text-lg text-white">
              Join our WhatsApp Community
            </h3>
            <p className="text-sm text-gray-400">
              Get the latest updates, connect with other members, and stay
              informed about our events.
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold h-11 rounded-xl shadow-[0_8px_20px_-4px_rgba(16,185,129,0.4),inset_0_1px_1px_rgba(255,255,255,0.35)] border border-emerald-300/30 transition-all duration-200"
              >
                <a
                  href="https://chat.whatsapp.com/LwH3BiTgyxQCcqQXYPvMhj"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join WhatsApp Group
                </a>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative group overflow-hidden bg-gradient-to-b from-white/[0.06] to-transparent bg-[#0c1220]/90 p-6 rounded-2xl border border-white/[0.12] max-w-md w-full text-center space-y-4 shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)]"
          >
            <div className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 bg-rose-500/15 rounded-full blur-2xl" />
            <h3 className="font-bold text-lg text-white">Join our Meetup Group</h3>
            <p className="text-sm text-gray-400">
              We track RSVP to our upcoming in person and virtual events on
              Meetup. All members must join the Meetup group to attend our
              events and stay updated.
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-semibold h-11 rounded-xl shadow-[0_8px_20px_-4px_rgba(244,63,94,0.4),inset_0_1px_1px_rgba(255,255,255,0.35)] border border-rose-300/30 transition-all duration-200"
              >
                <a
                  href="https://www.meetup.com/aws-cloud-club-at-university-of-kelaniya/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join our Meetup Group
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
      {!submitted && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Account Info */}
          <div className="flex items-center gap-3 pt-2 pb-1">
            <div className="h-2 w-2 rounded-full bg-[#AD5CFF]" />
            <span className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
              Account Info
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/[0.12] via-white/[0.04] to-transparent"></div>
          </div>

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 text-xs font-medium">Full Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. John Doe" 
                    className="h-11 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.12] text-white placeholder:text-gray-500 focus-visible:border-[#AD5CFF] shadow-none transition-colors duration-200"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 text-xs font-medium">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      className="h-11 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.12] text-white placeholder:text-gray-500 focus-visible:border-[#AD5CFF] shadow-none transition-colors duration-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-xs font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="At least 8 characters"
                          className="pr-10 h-11 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.12] text-white placeholder:text-gray-500 focus-visible:border-[#AD5CFF] shadow-none transition-colors duration-200"
                          autoComplete="new-password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white hover:bg-white/[0.08] rounded-lg h-8 w-8 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription className="text-gray-500 text-[11px]">
                      Used to log in to the AWS UOK website.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          {/* Section 2: University Details */}
          <div className="flex items-center gap-3 pt-4 pb-1">
            <div className="h-2 w-2 rounded-full bg-[#AD5CFF]" />
            <span className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
              University Details
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/[0.12] via-white/[0.04] to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 text-xs font-medium">Student ID</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="PS/2020/001" 
                      className="h-11 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.12] text-white placeholder:text-gray-500 focus-visible:border-[#AD5CFF] shadow-none transition-colors duration-200"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 text-xs font-medium">Contact Number (WhatsApp)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="+94 7X XXX XXXX" 
                      className="h-11 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.12] text-white placeholder:text-gray-500 focus-visible:border-[#AD5CFF] shadow-none transition-colors duration-200"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="faculty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 text-xs font-medium">Faculty</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.12] text-white focus:ring-0 focus:border-[#AD5CFF] shadow-none [&>span]:text-gray-300 transition-colors duration-200">
                        <SelectValue placeholder="Select Faculty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border border-white/[0.12] bg-[#0c1220]/95 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)]">
                      <SelectItem className="rounded-lg text-gray-200 hover:text-white focus:bg-[#AD5CFF]/20 focus:text-white transition-colors cursor-pointer" value="science">
                        Faculty of Science
                      </SelectItem>
                      <SelectItem className="rounded-lg text-gray-200 hover:text-white focus:bg-[#AD5CFF]/20 focus:text-white transition-colors cursor-pointer" value="computing">
                        Faculty of Computing and Technology
                      </SelectItem>
                      <SelectItem className="rounded-lg text-gray-200 hover:text-white focus:bg-[#AD5CFF]/20 focus:text-white transition-colors cursor-pointer" value="business">
                        Faculty of Commerce & Management Studies
                      </SelectItem>
                      <SelectItem className="rounded-lg text-gray-200 hover:text-white focus:bg-[#AD5CFF]/20 focus:text-white transition-colors cursor-pointer" value="medicine">
                        Faculty of Medicine
                      </SelectItem>
                      <SelectItem className="rounded-lg text-gray-200 hover:text-white focus:bg-[#AD5CFF]/20 focus:text-white transition-colors cursor-pointer" value="humanities">
                        Faculty of Humanities and Social Sciences
                      </SelectItem>
                      <SelectItem className="rounded-lg text-gray-200 hover:text-white focus:bg-[#AD5CFF]/20 focus:text-white transition-colors cursor-pointer" value="graduate">
                        Faculty of Graduate Studies
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 text-xs font-medium">Year of Study</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.12] text-white focus:ring-0 focus:border-[#AD5CFF] shadow-none [&>span]:text-gray-300 transition-colors duration-200">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border border-white/[0.12] bg-[#0c1220]/95 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)]">
                      <SelectItem className="rounded-lg text-gray-200 hover:text-white focus:bg-[#AD5CFF]/20 focus:text-white transition-colors cursor-pointer" value="1">1st Year</SelectItem>
                      <SelectItem className="rounded-lg text-gray-200 hover:text-white focus:bg-[#AD5CFF]/20 focus:text-white transition-colors cursor-pointer" value="2">2nd Year</SelectItem>
                      <SelectItem className="rounded-lg text-gray-200 hover:text-white focus:bg-[#AD5CFF]/20 focus:text-white transition-colors cursor-pointer" value="3">3rd Year</SelectItem>
                      <SelectItem className="rounded-lg text-gray-200 hover:text-white focus:bg-[#AD5CFF]/20 focus:text-white transition-colors cursor-pointer" value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section 3: Personal Info */}
          <div className="flex items-center gap-3 pt-4 pb-1">
            <div className="h-2 w-2 rounded-full bg-[#AD5CFF]" />
            <span className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
              Personal Info
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/[0.12] via-white/[0.04] to-transparent"></div>
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 text-xs font-medium">Home Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your home address" 
                    className="h-11 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.12] text-white placeholder:text-gray-500 focus-visible:border-[#AD5CFF] shadow-none transition-colors duration-200"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Section 4: Interests & Links */}
          <div className="flex items-center gap-3 pt-4 pb-1">
            <div className="h-2 w-2 rounded-full bg-[#AD5CFF]" />
            <span className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
              Interests & Links
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/[0.12] via-white/[0.04] to-transparent"></div>
          </div>

          <FormField
            control={form.control}
            name="interests"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 text-xs font-medium">
                  Why do you want to join AWS Student Builder Group UOK?
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your technical interests, cloud experience, and what you hope to achieve..."
                    className="min-h-[110px] rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.12] text-white placeholder:text-gray-500 focus-visible:border-[#AD5CFF] shadow-none transition-colors duration-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 text-xs font-medium">LinkedIn Profile (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/username"
                      className="h-11 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.12] text-white placeholder:text-gray-500 focus-visible:border-[#AD5CFF] shadow-none transition-colors duration-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 text-xs font-medium">GitHub Profile (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://github.com/username" 
                      className="h-11 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.12] text-white placeholder:text-gray-500 focus-visible:border-[#AD5CFF] shadow-none transition-colors duration-200"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Solid Accent Purple Submit Button */}
          <div className="pt-3">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button 
                type="submit" 
                className="w-full rounded-xl bg-[#AD5CFF] hover:bg-[#9d4eed] text-white font-bold h-12 text-base shadow-none border border-transparent transition-colors duration-200 cursor-pointer disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Submit Application
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </motion.div>
          </div>
        </form>
      )}
    </Form>
  );
}
