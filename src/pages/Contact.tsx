import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  subject: z.string().min(1, "Please select a subject"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const CONTACT_INFO = [
  {
    icon: Mail,
    title: "Email",
    value: "techpriceke@gmail.com",
    description: "We'll respond within 24 hours",
    href: "mailto:techpriceke@gmail.com",
  },
  {
    icon: Phone,
    title: "WhatsApp",
    value: "0700 129 827",
    description: "Chat with us on WhatsApp",
    href: "https://api.whatsapp.com/send?phone=254700129827&text=Hello%20TechPrice%20Support",
  },
  {
    icon: MapPin,
    title: "Office",
    value: "Nairobi, Kenya",
    description: "East Africa",
  },
  {
    icon: Clock,
    title: "Business Hours",
    value: "9:00 AM - 6:00 PM",
    description: "Monday - Friday (EAT)",
  },
];

const SUBJECTS = [
  { value: "general", label: "General Inquiry" },
  { value: "support", label: "Technical Support" },
  { value: "billing", label: "Billing Question" },
  { value: "vendor", label: "Vendor Partnership" },
  { value: "feedback", label: "Feedback & Suggestions" },
  { value: "bug", label: "Report a Bug" },
  { value: "other", label: "Other" },
];

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Contact form submitted:", {
      name: data.name,
      email: data.email,
      subject: data.subject,
      messageLength: data.message.length,
    });

    setIsSubmitting(false);
    setIsSubmitted(true);

    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar showBackButton backTo="/" />

      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Contact Information
              </h2>
              {CONTACT_INFO.map((info) => {
                const content = (
                  <Card key={info.title} className={`bg-card border-border ${info.href ? 'hover:border-primary/50 transition-colors cursor-pointer' : ''}`}>
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <info.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {info.title}
                        </h3>
                        <p className="text-foreground">{info.value}</p>
                        <p className="text-sm text-muted-foreground">
                          {info.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
                
                return info.href ? (
                  <a key={info.title} href={info.href} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                ) : (
                  <div key={info.title}>{content}</div>
                );
              })}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
                        <CheckCircle className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Thank you for reaching out!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        We've received your message and will get back to you
                        within 24 hours.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsSubmitted(false);
                          form.reset();
                        }}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your name"
                                    className="bg-background"
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
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="bg-background"
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
                              <FormLabel>Subject</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Select a subject" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {SUBJECTS.map((subject) => (
                                    <SelectItem
                                      key={subject.value}
                                      value={subject.value}
                                    >
                                      {subject.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="How can we help you?"
                                  className="min-h-[150px] bg-background resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full gap-2"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
