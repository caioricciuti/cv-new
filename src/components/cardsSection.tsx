import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import THREE from "three";
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
  RefreshCw,
  RocketIcon,
  Telescope,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { ScrollArea } from "@/components/ui/scroll-area";

import mallorca from "/mallorca.jpg";
import mallorca2 from "/mallorca2.jpg";
import mallorca3 from "/mallorca3.jpg";
import mallorca4 from "/mallorca4.jpg";

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
      description:
        "I'm sure you're thinking, who in the world still uses email? 🤔... Try me!",
      content: (
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <MailOpenIcon className="h-6 w-6" />
            </div>
            <div>
              <a
                href="mailto:caio.ricciuti@outlook.com"
                className="font-semibold"
              >
                <p className="text-sm text-muted-foreground">
                  Waiting for your message! 😊
                </p>
              </a>
            </div>
          </div>
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
      description: "Learn more about our business and services.",
      content: (
        <div className="grid gap-4 max-h-[80vh]">
          <ScrollArea className="h-[60vh] w-full">
            <p>
              I'm a Marketing Technologist and Data Engineer currently working
              at Synatix GmbH since February 2021. With a carrer of{" "}
              {new Date().getFullYear() - 2014} + years of experience, I've
              developed a strong foundation in both marketing technology and
              data engineering, I love to work with data and technology to drive
              business decisions.
            </p>
            <p>
              My expertise lies in developing and maintaining applications, with
              a focus on leveraging cloud technologies. I'm proficient in Google
              Cloud Platform (GCP), utilizing services like BigQuery, Cloud
              Storage, Cloud Functions, and App Engine. I also have experience
              with AWS, particularly S3 and CloudFront for efficient file
              storage and content delivery.
            </p>
            <p>
              In my current role, I've been deeply involved in API integrations,
              containerization using Docker and Docker Compose, and implementing
              CI/CD pipelines with Gitlab CI/CD. I'm passionate about data
              analysis and visualization, using Python libraries such as Pandas,
              Matplotlib, and Seaborn, as well as Looker Studio for creating
              insightful dashboards.
            </p>
            <p>
              One of my key strengths is conducting deep analysis of user
              behavior, focusing on crucial metrics like Lifetime Value (LTV),
              Customer Acquisition Cost (CAC), and other important KPIs. This
              analytical approach allows me to provide valuable insights that
              drive marketing strategies and business decisions.
            </p>
          </ScrollArea>
        </div>
      ),
    },
  },
];

const Sphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.4;
    }
  });

  return (
    <mesh ref={meshRef} scale={2}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="hotpink" wireframe />
    </mesh>
  );
};

const InteractiveRevealComponent = () => {
  const [revealed, setRevealed] = useState(false);
  const [hasBeenHovered, setHasBeenHovered] = useState(false);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const handleMouseEnter = () => {
    if (!hasBeenHovered) {
      setTimeout(() => {
        setRevealed(true);
        setHasBeenHovered(true);
      }, 100);
    }
  };

  const handleReset = () => {
    setRevealed(false);
  };

  const handleClick = () => {
    if (hasBeenHovered) {
      setRevealed(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        className="min-h-screen flex flex-col items-center justify-center w-full relative p-4 sm:p-6 md:p-8 lg:p-12"
      >
        {revealed ? (
          <>
            <Button
              size="icon"
              variant="outline"
              className="absolute top-4 right-4 z-30"
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
            >
              <RefreshCw size={24} />
            </Button>
            <div className="w-full max-w-4xl z-20 relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cardsData.map((card, index) => (
                  <Card
                    key={index}
                    onClick={() => setActiveDialog(card.title)}
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
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
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-20 text-center"
          >
            <motion.p
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {hasBeenHovered ? "See again?!" : "There is more to see!"}
            </motion.p>
            <motion.div
              className="flex justify-center items-center space-x-8 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: 1.1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.span
                className="text-5xl mt-4"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              >
                🎉
              </motion.span>
              <motion.span
                className="text-5xl mt-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
              >
                🚀
              </motion.span>
              <motion.span
                className="text-5xl mt-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
              >
                🌟
              </motion.span>
            </motion.div>
          </motion.div>
        )}

        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <Canvas className="w-full h-full">
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Sphere />
                <OrbitControls enableZoom={false} />
              </Canvas>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 [mask-image:radial-gradient(600px_at_center,white,transparent)] bg-black/50 dark:bg-black/90" />
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
