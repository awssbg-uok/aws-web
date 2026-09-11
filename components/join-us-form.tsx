"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
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
  emergencyContactPerson: z
    .string()
    .min(1, { message: "Person is requirred." }),
  emergencyContactNumber: z
    .string()
    .min(10, { message: "Contact number is requirred." }),
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
      emergencyContactPerson: "",
      emergencyContactNumber: "",
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
        <div className="flex flex-col gap-6 items-center justify-center py-8">
          <div className="text-green-600 text-lg font-medium text-center">
            {responseMessage}
          </div>
          <div className="bg-muted p-6 rounded-xl border max-w-md w-full text-center space-y-4">
            <h3 className="font-semibold text-lg">
              Join our WhatsApp Community
            </h3>
            <p className="text-sm text-muted-foreground">
              Get the latest updates, connect with other members, and stay
              informed about our events.
            </p>
            <Button
              asChild
              className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            >
              <a
                href="https://chat.whatsapp.com/LwH3BiTgyxQCcqQXYPvMhj"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join WhatsApp Group
              </a>
            </Button>
          </div>
          <div className="bg-muted p-6 rounded-xl border max-w-md w-full text-center space-y-4">
            <h3 className="font-semibold text-lg">Join our Meetup Group</h3>
            <p className="text-sm text-muted-foreground">
              We track RSVP to our upcoming in-person and virtual events on
              Meetup. All members must join the Meetup group to attend our
              events and stay updated.
            </p>
            <Button
              asChild
              className="w-full bg-[#F64060] hover:bg-[#F64060]/90 text-white"
            >
              <a
                href="https://www.meetup.com/aws-cloud-club-at-university-of-kelaniya/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join our Meetup Group
              </a>
            </Button>
          </div>
        </div>
      )}
      {!submitted && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="password"
                          className="pr-10"
                          autoComplete="new-password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Please remember this password. You will use it to log in
                      to the AWS UOK website.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input placeholder="PS/2020/001" {...field} />
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
                  <FormLabel>ContactNumber(Whatsapp)</FormLabel>
                  <FormControl>
                    <Input placeholder="+94*********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="faculty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faculty</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="science">
                        Faculty of Science
                      </SelectItem>
                      <SelectItem value="computing">
                        Faculty of Computing and Technology
                      </SelectItem>
                      <SelectItem value="business">
                        Faculty of Commerce & Management Studies
                      </SelectItem>
                      <SelectItem value="medicine">
                        Faculty of Medicine
                      </SelectItem>
                      <SelectItem value="humanities">
                        Faculty of Humanities and Social Sciences
                      </SelectItem>
                      <SelectItem value="graduate">
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
                  <FormLabel>Year of Study</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Home Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="emergencyContactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact Person</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Mother">Mother</SelectItem>
                      <SelectItem value="Father">Father</SelectItem>
                      <SelectItem value="Guardian">Guardian</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyContactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Person Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+94*********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="interests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Why do you want to join AWS Cloud Club UOK?
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your interests and what you hope to achieve..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.linkedin.com/in/..."
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
                  <FormLabel>GitHub Profile (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </form>
      )}
    </Form>
  );
}
