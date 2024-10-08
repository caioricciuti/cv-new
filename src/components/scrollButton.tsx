import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

function ScrollButton() {
  const [scrollingDown, setScrollingDown] = useState(true);

  const handleScroll = () => {
    if (scrollingDown) {
      window.scrollBy({
        top: window.innerHeight,
        behavior: "smooth",
      });
    } else {
      window.scrollBy({
        top: -window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  const checkScrollPosition = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 1) {
      setScrollingDown(false);
    } else if (scrollTop === 0) {
      setScrollingDown(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollPosition);
    return () => {
      window.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  return (
    <Button
      onClick={handleScroll}
      size="icon"
      className=" animate-bounce md:fixed z-50 bg-transparent text-gray-50 hover:bg-transparent hover:border bottom-4 left-1/2 transform -translate-x-1/2"
    >
      {scrollingDown ? <ChevronDown /> : <ChevronUp />}
    </Button>
  );
}

export default ScrollButton;
