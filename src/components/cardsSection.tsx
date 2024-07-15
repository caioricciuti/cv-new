import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPinIcon,
  MailOpenIcon,
  RocketIcon,
  Telescope,
  Linkedin,
  GithubIcon,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { ScrollArea } from "@/components/ui/scroll-area";

import mallorca from "/mallorca.jpg";
import mallorca4 from "/mallorca4.jpg";
import mallorca2 from "/mallorca2.jpg";
import mallorca3 from "/mallorca3.jpg";

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  dialogContent: {
    title: string;
    description: string;
    content: React.ReactNode;
  };
}

const cardsData: CardProps[] = [
  {
    title: "Location",
    description: "Palma de Mallorca, Spain",
    icon: <MapPinIcon className="h-6 w-6" />,
    dialogContent: {
      title: "Location",
      description:
        "I'm based in Spain, more specifically in Palma de Mallorca! 🌴",
      content: (
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <MapPinIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">Palma de Mallorca</p>
              <p className="text-sm text-muted-foreground">Spain 🇪🇸</p>
            </div>
          </div>
          <div className="m-auto">
            <Carousel>
              <CarouselContent>
                <CarouselItem>
                  <img src={mallorca} className="rounded-md" />
                </CarouselItem>
                <CarouselItem>
                  <img src={mallorca2} className="rounded-md" />
                </CarouselItem>
                <CarouselItem>
                  <img src={mallorca3} className="rounded-md" />
                </CarouselItem>
                <CarouselItem>
                  <img src={mallorca4} className="rounded-md" />
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      ),
    },
  },
  {
    title: "Get in Touch",
    description: "I'd love to hear from you!",
    icon: <RocketIcon className="h-6 w-6" />,
    dialogContent: {
      title: "Let's talk!",
      description: "Let's connect and discuss how we can work together! 🚀",
      content: (
        <div className="flex flex-col">
          <a
            href="mailto:caio.ricciuti@outlook.com"
            className="font-semibold text-lg flex items-center border p-2 gap-4 rounded-md mb-2 hover:bg-accent transition-colors duration-200"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground border">
              <MailOpenIcon />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Waiting for your message! 😊
              </p>
            </div>
          </a>
          <a
            href="https://www.linkedin.com/in/caioricciuti/"
            target="_blank"
            className="font-semibold text-lg flex items-center border p-2 gap-4 rounded-md mb-2 hover:bg-accent transition-colors duration-200"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground border">
              <Linkedin />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Let's connect on LinkedIn! 👋
              </p>
            </div>
          </a>
          <a
            href="https://github.com/caioricciuti"
            target="_blank"
            className="font-semibold text-lg flex items-center border p-2 gap-4 rounded-md mb-2 hover:bg-accent transition-colors duration-200"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground border">
              <GithubIcon />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Check out my GitHub! 🚀
              </p>
            </div>
          </a>
        </div>
      ),
    },
  },
  {
    title: "About Me",
    description: "Why meee?!",
    icon: <Telescope className="h-6 w-6" />,
    dialogContent: {
      title: "A little bit about me",
      description: "Overview of my professional journey! 🚀",
      content: (
        <div className="grid gap-4 max-h-[80vh]">
          <ScrollArea className="h-[60vh] w-full p-2">
            <p className="mb-4">
              I'm a Data Engineer and Team Leader at Synatix GmbH, where I've
              been driving innovation since February 2021. With a career
              spanning {new Date().getFullYear() - 2014}+ years, I've cultivated
              a unique blend of expertise in data engineering, cloud
              technologies, and marketing technology. My passion lies in
              harnessing the power of data and cutting-edge tech to fuel
              data-driven decision-making and business growth.
            </p>
            <p className="mb-4">
              My technical prowess centers on developing and optimizing robust
              data pipelines and applications. I'm highly proficient in Google
              Cloud Platform (GCP), where I leverage services like BigQuery,
              Cloud Storage, Cloud Functions, and App Engine to architect
              scalable, efficient data solutions. My experience extends to
              Amazon Web Services (AWS), particularly S3 and CloudFront,
              enabling me to design comprehensive cloud-native ecosystems for
              data storage, processing, and delivery.
            </p>
            <p className="mb-4">
              In my current leadership role, I spearhead projects that involve
              complex API integrations, containerization strategies using Docker
              and Docker Compose, and the implementation of streamlined CI/CD
              pipelines via GitLab CI/CD. I'm deeply committed to data analysis
              and visualization, employing Python libraries such as Pandas,
              Matplotlib, and Seaborn, alongside Looker Studio, to transform raw
              data into actionable insights and compelling visual narratives.
            </p>
            <p className="mb-4">
              One of my core strengths lies in conducting in-depth analyses of
              user behavior and market trends. I focus on critical metrics like
              Lifetime Value (LTV), Customer Acquisition Cost (CAC), and other
              pivotal KPIs to drive strategic decision-making. This analytical
              acumen, combined with my background in psychology and marketing,
              allows me to bridge the gap between technical implementations and
              business strategies, delivering solutions that not only process
              data efficiently but also yield meaningful business impact.
            </p>
            <p className="mb-4">
              Throughout my career, I've consistently embraced a digital-first
              approach, staying ahead of market curves through advanced
              competitive analysis and consumer trend methodologies. My
              experience spans from marketing management to business strategy
              consulting, equipping me with a holistic understanding of how data
              engineering can revolutionize business operations across various
              sectors.
            </p>
            <p>
              As a multilingual professional fluent in English, Spanish, and
              Portuguese, with basic French and Italian skills, I bring a global
              perspective to my work. I'm always eager to tackle new challenges,
              learn emerging technologies, and collaborate with diverse teams to
              create innovative, data-driven solutions that propel businesses
              forward in the digital age.
            </p>
          </ScrollArea>
        </div>
      ),
    },
  },
];

const InteractiveRevealComponent = () => {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black">
      <div className="relative min-h-screen flex flex-col items-center justify-center w-full p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="w-full max-w-4xl z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cardsData.map((card, index) => (
              <Card
                key={index}
                onClick={() => setActiveDialog(card.title)}
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors duration-200 bg-opacity-80 backdrop-blur-sm"
              >
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {cardsData.map((card, index) => (
        <Dialog
          key={index}
          open={activeDialog === card.title}
          onOpenChange={(open) => setActiveDialog(open ? card.title : null)}
        >
          <DialogContent className="rounded-sm max-w-[90%] md:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{card.dialogContent.title}</DialogTitle>
              <DialogDescription>
                {card.dialogContent.description}
              </DialogDescription>
            </DialogHeader>
            <div>{card.dialogContent.content}</div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setActiveDialog(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};

export default InteractiveRevealComponent;
