import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, HelpCircle, ShoppingCart, Bell, Users, Shield, CreditCard, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const HELP_CATEGORIES = [
  {
    icon: ShoppingCart,
    title: "Shopping & Orders",
    description: "Browse products, compare prices, and track orders",
  },
  {
    icon: Bell,
    title: "Price Alerts",
    description: "Set up and manage price drop notifications",
  },
  {
    icon: Users,
    title: "Account & Profile",
    description: "Manage your account settings and preferences",
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Your data protection and account security",
  },
  {
    icon: CreditCard,
    title: "Vendors & Sellers",
    description: "Information for vendors and sellers",
  },
  {
    icon: MessageCircle,
    title: "Support",
    description: "Get help from our support team",
  },
];

const FAQS = [
  {
    category: "general",
    question: "What is TechPrice?",
    answer: "TechPrice is a price comparison platform that helps you find the best deals on tech products from multiple vendors. Compare prices, set alerts for price drops, and make informed purchasing decisions.",
  },
  {
    category: "general",
    question: "How do I create an account?",
    answer: "Click the 'Sign In' button in the top right corner, then select 'Sign Up'. You can register using your email address or sign in with Google.",
  },
  {
    category: "alerts",
    question: "How do price alerts work?",
    answer: "When viewing a product, click the 'Set Price Alert' button. You can set a target price, and we'll notify you via email when the price drops to or below your target.",
  },
  {
    category: "alerts",
    question: "How do I manage my price alerts?",
    answer: "Go to the 'My Alerts' page from your account menu to view, edit, or delete your active price alerts.",
  },
  {
    category: "comparison",
    question: "How do I compare products?",
    answer: "While browsing, click the 'Add to Compare' button on any product. Once you've selected 2-4 products, click 'Compare' in the comparison bar at the bottom to see a detailed side-by-side comparison.",
  },
  {
    category: "comparison",
    question: "Can I compare products from different categories?",
    answer: "Yes, you can compare any products regardless of category. However, for the most meaningful comparison, we recommend comparing similar products.",
  },
  {
    category: "vendors",
    question: "How do I become a vendor?",
    answer: "Click on 'Become a Vendor' in the navigation menu or go to the Vendor Onboarding page. Fill out the application form with your business details, and our team will review your application.",
  },
  {
    category: "vendors",
    question: "How long does vendor approval take?",
    answer: "Vendor applications are typically reviewed within 2-3 business days. You'll receive an email notification once your application is approved.",
  },
  {
    category: "account",
    question: "How do I update my profile information?",
    answer: "Go to Settings from your account menu to update your profile information, including your name, email, and notification preferences.",
  },
  {
    category: "account",
    question: "How do I reset my password?",
    answer: "On the sign-in page, click 'Forgot Password' and enter your email address. We'll send you a link to reset your password.",
  },
];

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFAQs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <NavBar showBackButton backTo="/" />

      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Search our help center or browse categories below
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-card border-border"
            />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HELP_CATEGORIES.map((category) => (
              <Card
                key={category.title}
                className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group"
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-foreground">
                      {category.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-12 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>
          {filteredFAQs.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left text-foreground hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No results found for "{searchQuery}"
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Still need help?
          </h2>
          <p className="text-muted-foreground mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Link to="/contact">
            <Button size="lg" className="gap-2">
              <MessageCircle className="w-5 h-5" />
              Contact Support
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;
