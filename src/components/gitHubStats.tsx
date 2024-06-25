import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type WorldType = (props: any) => JSX.Element;

export default function GitHubComponent() {
  const [World, setWorld] = useState<WorldType | null>(null);

  useEffect(() => {
    import("@/components/ui/globe").then((mod) => setWorld(() => mod.World));
  }, []);

  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#123123",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 0, lng: 0 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  return (
    <div className="min-h-screen h-screen items-center">
      <div className="relative overflow-hidden h-full">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="div"
        ></motion.div>
        <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none from-transparent dark:to-black to-white z-40" />
        <div className="absolute w-full h-full cursor-pointer">
          {World && <World data={{}} globeConfig={globeConfig} />}
        </div>
      </div>
    </div>
  );
}
