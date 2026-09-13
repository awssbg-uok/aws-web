"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/addMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        form.setError("message", { type: "manual", message: data.message });
        setIsSubmitting(false); // stop spinner
        return; // stop execution
      }

      // toast({
      //   title: "Message sent successfully!",
      //   description: "We will get back to you as soon as possible.",
      // });
      form.reset();
      setResponseMessage(
        "You're message has reached us. We will get back to you as soon as possible."
      );
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 text-xs font-medium">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
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
        </div>
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 text-xs font-medium">Subject</FormLabel>
              <FormControl>
                <Input
                  placeholder="What would you like to ask or discuss?"
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
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 text-xs font-medium">Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your message here..."
                  className="min-h-[140px] rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.12] text-white placeholder:text-gray-500 focus-visible:border-[#AD5CFF] shadow-none transition-colors duration-200"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {responseMessage && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-[0_4px_12px_rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {responseMessage}
          </div>
        )}
        <Button
          type="submit"
          className="w-full bg-[#AD5CFF] hover:bg-[#9d4eed] text-white font-bold h-11 rounded-xl shadow-none border border-transparent transition-colors duration-200 disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Message...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>
    </Form>
  );
}
