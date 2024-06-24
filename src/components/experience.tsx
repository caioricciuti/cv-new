import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

extend({ OrbitControls });

interface ExperienceData {
  company: string;
  position: string;
  period: string;
  description: string[];
}

const experienceData: ExperienceData[] = [
  {
    company: "Synatix GmbH",
    position: "Marketing Technologist",
    period: "January 2021 - Present",
    description: [
      "Develop and maintain applications and services",
      "Manage servers hosting services and apps",
      "Utilize Google Cloud Platform services",
      "Implement Google Tag Manager (client-side and server-side)",
      "Integrate APIs into applications",
      "Create data visualizations using Google Data Studio",
      "Use Docker and Docker Compose for containerization",
      "Leverage AWS (S3, CloudFront) for file storage and content delivery",
    ],
  },
  {
    company: "Logitravel Group",
    position: "Marketing Manager PT/BR",
    period: "February 2019 - January 2021",
    description: [
      "Develop and execute strategic marketing plans for Portuguese and Brazilian markets",
      "Conduct market analysis",
      "Plan and manage budgets",
      "Plan and execute campaigns",
      "Manage social media",
      "Utilize Google Tools (Analytics, Search Console, AdWords)",
      "Implement technical solutions (UTMs, parameters, product feeds)",
    ],
  },
  {
    company: "Consulor, Freelance",
    position: "Business/Corporate Strategist",
    period: "June 2014 - January 2019",
    description: [
      "Provide expertise to help businesses achieve goals and solve problems",
      "Work with clients to understand needs and define project scope",
      "Focus on results orientation and long-term planning",
      "Plan and analyze budgets",
      "Assist with business internationalization and expansion",
      "Engage in B2B sales",
    ],
  },
];

const Globe = () => {
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
        <h3 className="text-2xl font-bold mb-2">{data.company}</h3>
        <h4 className="text-xl mb-1">{data.position}</h4>
        <p className="text-sm text-gray-400 mb-4">{data.period}</p>
        <ul className="list-disc pl-5 space-y-1">
          {data.description.map((item, index) => (
            <li key={index} className="text-sm">
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full"
        onClick={onPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full"
        onClick={onNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
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
        <Globe />
      </Canvas>

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
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
