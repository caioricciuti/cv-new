import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  BarChart2,
  Globe,
  PieChart,
} from "lucide-react";
import "tailwindcss/tailwind.css";

const getPeriodStringWithDays = (
  startYear: number,
  startMonth: number,
  endYear?: number,
  endMonth?: number
): string => {
  const startDate = new Date(startYear, startMonth - 1, 1); // Month is 0-indexed
  let endDate: Date;

  if (endYear && endMonth) {
    // If end year and month are provided, use the last day of that month
    endDate = new Date(endYear, endMonth, 0); // This gives the last day of the previous month
  } else {
    // Otherwise, use the current date
    endDate = new Date();
  }

  // Calculate the difference in time
  const differenceInTime = endDate.getTime() - startDate.getTime();
  // Calculate the difference in days
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  return `${differenceInDays} days`;
};

extend({ OrbitControls });

interface ExperienceData {
  company: string;
  position: string;
  days?: string;
  period: string;
  description: string[];
  icon: JSX.Element;
}

const experienceData: ExperienceData[] = [
  {
    company: "Synatix GmbH",
    position: "Marketing Technologist / Data Engineer",
    period: `February 2021 - Present`,
    days: `${getPeriodStringWithDays(2021, 2)} and counting...`,
    description: [
      "Develop and maintain applications (NodeJS).",
      "GCP - Big Query, GCS, Cloud fuctions, app engine...",
      "API integration.",
      "Docker and Docker Compose for containerization.",
      "Leverage AWS (S3, CloudFront) for file storage and content delivery.",
      "Implement CI/CD pipelines (Gitlab CI/CD).",
      "Data analysis and visualization using Python (Pandas, Matplotlib, Seaborn).",
      "Looker Studio for data visualization and analysis.",
      "Deep Analisis of user behavior, LTV, CAC, and other KPIs.",
    ],
    icon: <Globe className="h-6 w-6 text-indigo-500" />,
  },
  {
    company: "Logitravel Group",
    position: "Marketing Manager PT/BR",
    period: `February 2019 - January 2021`,
    days: `${getPeriodStringWithDays(2019, 1, 2021, 1)} - Yep, I stick around!`,
    description: [
      "Develop and execute strategic marketing plans for Portuguese and Brazilian markets",
      "Conduct market analysis",
      "Plan and manage budgets",
      "Plan and execute campaigns",
      "Manage social media",
      "Utilize Google Tools (Analytics, Search Console, AdWords)",
      "Implement technical solutions (UTMs, parameters, product feeds)",
    ],
    icon: <PieChart className="h-6 w-6 text-indigo-500" />,
  },
  {
    company: "Consulor, Freelance",
    position: "Business/Corporate Strategist",
    period: `June 2014 - January 2019`,
    days: `${getPeriodStringWithDays(
      2014,
      6,
      2019,
      1
    )} - 4 years and 7 months!`,
    description: [
      "Provide expertise to help businesses achieve goals and solve problems",
      "Work with clients to understand needs and define project scope",
      "Focus on results orientation and long-term planning",
      "Plan and analyze budgets",
      "Assist with business internationalization and expansion",
      "Engage in B2B sales",
    ],
    icon: <BarChart2 className="h-6 w-6 text-indigo-500" />,
  },
];

const GlobeComponent = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const geoRef = useRef<THREE.BufferGeometry>(null!);

  useEffect(() => {
    const geometry = new THREE.IcosahedronGeometry(1, 15);
    const vertices = geometry.attributes.position.array as Float32Array;
    const newVertices = new Float32Array(vertices.length);

    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      const z = vertices[i + 2];

      const length = Math.sqrt(x * x + y * y + z * z);
      const randomOffset = (Math.random() - 0.5) * 0.05;

      newVertices[i] = (x / length) * (1 + randomOffset);
      newVertices[i + 1] = (y / length) * (1 + randomOffset);
      newVertices[i + 2] = (z / length) * (1 + randomOffset);
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(newVertices, 3)
    );
    geoRef.current = geometry;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = time * 0.1;

    if (geoRef.current) {
      const vertices = geoRef.current.attributes.position.array as Float32Array;
      for (let i = 0; i < vertices.length; i += 3) {
        vertices[i + 1] += Math.sin(time + vertices[i] * 10) * 0.002;
      }
      geoRef.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef}>
      <bufferGeometry ref={geoRef} />
      <meshStandardMaterial color="#4B0082" wireframe />
    </mesh>
  );
};

const ExperienceCard: React.FC<{
  data: ExperienceData;
  onPrev: () => void;
  onNext: () => void;
}> = ({ data, onPrev, onNext }) => {
  return (
    <Card className="w-full max-w-4xl bg-white/10 backdrop-blur-md relative">
      <CardContent className="p-6">
        <div className="flex items-center mb-2">
          {data.icon}
          <h3 className="text-2xl font-bold ml-2">{data.company}</h3>
        </div>
        <h4 className="text-xl mb-1">{data.position}</h4>
        <p className="text-sm text-gray-400 mb-2">{data.period}</p>
        <p className="text-xs text-primary/50 mb-4">{data.days}</p>
        <ul className="list-disc pl-5 space-y-1">
          {data.description.map((item, index) => (
            <li key={index} className="text-sm">
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
      <div className="flex justify-between">
        <div className="p-2">
          <Button variant="outline" size="icon" onClick={onPrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-2">
          <Button variant="outline" size="icon" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const ExperienceSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : experienceData.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < experienceData.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <div className="h-screen w-full dark:bg-black dark:text-white relative overflow-hidden">
      <Canvas className="absolute inset-0">
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
        />
        <GlobeComponent />
      </Canvas>

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.1 }}
          className="w-full max-w-4xl px-4"
        >
          <ExperienceCard
            data={experienceData[currentIndex]}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ExperienceSection;
