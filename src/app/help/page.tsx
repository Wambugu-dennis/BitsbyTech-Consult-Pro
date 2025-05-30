
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, Search, BookOpen, Video, MessageCircleQuestion, Users, Info, FileText } from "lucide-react"; // Corrected icon
import { useLocalization } from '@/context/localization-provider';
import type { LanguagePack } from '@/lib/i18n-config';

const faqData = [
  {
    id: "faq1",
    questionKey: "How do I reset my password?",
    answerKey: "You can reset your password by clicking the 'Forgot Password' link on the login page. Follow the instructions sent to your email address. If you still face issues, contact support.",
  },
  {
    id: "faq2",
    questionKey: "Where can I find project reports?",
    answerKey: "Project-specific reports can be found within each project's detail page under the 'Reports' tab. General business reports are available in the main 'Reports' section from the sidebar.",
  },
  {
    id: "faq3",
    questionKey: "How do I add a new client?",
    answerKey: "Navigate to the 'Clients' section from the sidebar and click the 'Add Client' button. Fill in the required details in the dialog that appears. More details can be added later from the client's profile page.",
  },
  {
    id: "faq4",
    questionKey: "Can I customize my dashboard view?",
    answerKey: "Yes, dashboard customization is a planned feature. You will be able to arrange widgets and select KPIs to display. This functionality is currently under development and will be available in a future update.",
  },
];

export default function HelpPage() {
  const { toast } = useToast();
  const { t } = useLocalization();

  const handlePlaceholderAction = (titleKey: keyof LanguagePack['translations'], descriptionKey?: keyof LanguagePack['translations']) => {
    toast({
      title: t(titleKey),
      description: descriptionKey ? t(descriptionKey) : t("This feature is currently under development and will be available soon."),
      duration: 3000,
    });
  };

  return (
    <div className="space-y-8">
      <header className="pb-4 border-b">
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">{t('Help & Support Center')}</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          {t('Find answers to your questions, access documentation, and get assistance with Consult Vista.')}
        </p>
      </header>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Search className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">{t('Search Knowledge Base')}</CardTitle>
          </div>
          <CardDescription>{t('Quickly find answers to your questions by searching our help articles and FAQs.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-lg items-center space-x-2">
            <Input type="text" placeholder={t("Type your question here (e.g., 'how to create invoice')...")} className="flex-1" />
            <Button type="submit" onClick={() => handlePlaceholderAction("Search Initiated", "Full search functionality is under development.")}>
              <Search className="mr-2 h-4 w-4" /> {t('Search')}
            </Button>
          </div>
           <p className="text-xs text-muted-foreground mt-2">{t('Live search functionality is coming soon.')}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <MessageCircleQuestion className="h-7 w-7 text-primary" />
              <CardTitle className="text-xl">{t('Frequently Asked Questions (FAQs)')}</CardTitle>
            </div>
            <CardDescription>{t('Find answers to common questions about using Consult Vista.')}</CardDescription>
          </CardHeader>
          <CardContent>
            {faqData.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq) => (
                  <AccordionItem value={faq.id} key={faq.id}>
                    <AccordionTrigger className="text-sm text-left hover:no-underline">{t(faq.questionKey as keyof LanguagePack['translations'])}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {t(faq.answerKey as keyof LanguagePack['translations'])}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-sm text-muted-foreground">{t('No FAQs available at the moment.')}</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BookOpen className="h-7 w-7 text-primary" />
              <CardTitle className="text-xl">{t('User Documentation & Guides')}
              </CardTitle>
            </div>
             <CardDescription>{t('Access comprehensive guides and articles for all Consult Vista features.')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t('Our detailed documentation covers everything from basic setup to advanced feature configuration. Explore step-by-step guides, best practices, and troubleshooting tips.')}
            </p>
            <Button variant="outline" className="w-full" onClick={() => handlePlaceholderAction("Browse Full Documentation Clicked", "A dedicated documentation portal is planned.")}>
              <BookOpen className="mr-2 h-4 w-4" /> {t('Browse Full Documentation (Coming Soon)')}
            </Button>
             <div className="text-xs text-muted-foreground space-y-1 pt-2">
                <p>{t('Topics will include:')}</p>
                <ul className="list-disc list-inside pl-4">
                    <li>{t('Getting Started with Consult Vista')}</li>
                    <li>{t('Managing Clients & Projects')}</li>
                    <li>{t('Financial Tracking & Invoicing')}</li>
                    <li>{t('Using Advanced Analytics')}</li>
                    <li>{t('Administering User Accounts & Settings')}</li>
                </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader>
             <div className="flex items-center gap-3">
                <Video className="h-7 w-7 text-primary" />
                <CardTitle className="text-lg">{t('Interactive Tutorials')}</CardTitle>
            </div>
            <CardDescription>{t('Learn how to use Consult Vista effectively with guided video tutorials.')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {t('Visual learners will appreciate our upcoming library of interactive tutorials and video guides covering key functionalities and workflows.')}
            </p>
            <Button variant="outline" className="w-full" onClick={() => handlePlaceholderAction("Access Tutorials Clicked", "Video tutorial library is under development.")}>
              <Video className="mr-2 h-4 w-4" /> {t('Explore Tutorials (Coming Soon)')}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
                <MessageCircleQuestion className="h-7 w-7 text-primary" /> 
                <CardTitle className="text-lg">{t('Contact Support')}</CardTitle>
            </div>
            <CardDescription>{t('Get direct assistance from our support team.')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("If you can't find an answer in our FAQs or documentation, our support team is here to help.")}
            </p>
            <div className="text-sm">
              <p><strong>{t('Email')}:</strong> <a href="mailto:support@consultvista.example.com" className="text-primary hover:underline">support@consultvista.example.com</a></p>
              <p><strong>{t('Phone')}:</strong> {t('+1-555-HELP-NOW (Feature Coming Soon)')}</p>
            </div>
            <Button className="w-full" onClick={() => handlePlaceholderAction("Submit Support Ticket Clicked", "This would open a support ticket submission form or integrate with a helpdesk system.")}>
              <MessageCircleQuestion className="mr-2 h-4 w-4" /> 
              {t('Submit Support Ticket')}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
                <Users className="h-7 w-7 text-primary" />
                <CardTitle className="text-lg">{t('Community Forums')}</CardTitle>
            </div>
            <CardDescription>{t('Connect with other Consult Vista users, share tips, and ask questions.')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {t('Join our community forums to learn from peers, share your experiences, and contribute to the Consult Vista ecosystem.')}
            </p>
            <Button variant="outline" className="w-full" onClick={() => handlePlaceholderAction("Visit Community Forums Clicked", "The community forum platform is planned.")}>
              <Users className="mr-2 h-4 w-4" /> {t('Go to Forums (Coming Soon)')}
            </Button>
          </CardContent>
        </Card>
      </div>

       <Card className="mt-8 border-t pt-6 bg-card/50">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
             <FileText className="h-6 w-6 text-muted-foreground" /> {t('Additional Resources')}
          </CardTitle>
          <CardDescription>{t('Quick links to other useful information.')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
            <Button variant="link" className="p-0 h-auto justify-start" onClick={() => handlePlaceholderAction("View Release Notes")}>{t('Release Notes & Updates')}</Button>
            <Button variant="link" className="p-0 h-auto justify-start" onClick={() => handlePlaceholderAction("View System Status")}>{t('System Status Page')}</Button>
            <Button variant="link" className="p-0 h-auto justify-start" onClick={() => handlePlaceholderAction("Provide Feedback")}>{t('Provide Product Feedback')}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
