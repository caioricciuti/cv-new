import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
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

import logo from "@/assets/me.jpeg";

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
                  <img src={logo} className="max-h-52 m-auto" />
                </CarouselItem>
                <CarouselItem>
                  <img src={logo} className="max-h-52 m-auto" />
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
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
                  Write something nice, would you? 😊
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
        <div className="grid gap-4">
          <p>
            We are a family-owned business that has been serving the community
            for over 20 years. Our mission is to provide high-quality products
            and exceptional customer service.
          </p>
          <p>
            In addition to our retail location, we also offer online ordering
            and delivery options for your convenience. We proudly source our
            products from local and sustainable suppliers whenever possible.
          </p>
          <p>
            Thank you for considering us for your needs. We look forward to
            serving you!
          </p>
        </div>
      ),
    },
  },
];

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
          <p className="text-2xl md:text-3xl font-medium text-center text-white relative z-20 max-w-2xl mx-auto">
            {hasBeenHovered ? "Click to Reveal" : "Hover to Reveal"}
          </p>
        )}

        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <CanvasRevealEffect
                animationSpeed={5}
                containerClassName="bg-transparent"
                colors={[
                  [59, 130, 246],
                  [139, 92, 246],
                ]}
                opacities={[0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 1]}
                dotSize={2}
              />
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
