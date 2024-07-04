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
  Briefcase,
  Database,
  PieChart,
  TrendingUp,
} from "lucide-react";

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
    position: "Team Leader & Data Engineer",
    period: "February 2021 - Present",
    days: `${getPeriodStringWithDays(2021, 2)} and counting...`,
    description: [
      "Lead and manage data engineering projects, ensuring efficient team collaboration and timely delivery.",
      "Develop and optimize robust data pipelines using GCP services (Cloud Functions, Pub/Sub, BigQuery).",
      "Design and implement data lake solutions on Google Cloud Platform for efficient data storage and retrieval.",
      "Create and maintain ETL processes for seamless data transformation and loading.",
      "Develop applications using NodeJS and Python for data processing and analysis.",
      "Implement and manage Docker containerization for improved application deployment and scalability.",
      "Utilize AWS services (S3, CloudFront) for cost-effective file storage and content delivery.",
      "Set up and maintain CI/CD pipelines using GitLab CI/CD for streamlined development processes.",
      "Perform in-depth data analysis using Python libraries (Pandas, Matplotlib, Seaborn) to extract actionable insights.",
      "Create comprehensive data visualizations using Looker Studio for stakeholder presentations.",
      "Conduct advanced analysis of user behavior, focusing on key metrics such as LTV, CAC, and other relevant KPIs.",
      "Optimize API integrations to enhance data flow and improve system interoperability.",
    ],
    icon: <Database className="h-6 w-6 text-indigo-500" />,
  },
  {
    company: "Synatix GmbH",
    position: "Marketing Manager & Data Analyst",
    period: "February 2021 - 2022",
    days: `${getPeriodStringWithDays(2021, 2, 2022, 12)}`,
    description: [
      "Developed data-driven marketing strategies by leveraging advanced analytics and market research.",
      "Optimized data flows and storage solutions in the cloud to support scalable and efficient data processing.",
      "Managed and enhanced email marketing campaigns, focusing on data segmentation and personalization.",
      "Utilized cloud analytics to improve brand promotion and customer engagement across various platforms.",
      "Collaborated with cross-functional teams to align marketing initiatives with data-centric insights.",
    ],
    icon: <TrendingUp className="h-6 w-6 text-indigo-500" />,
  },
  {
    company: "Logitravel Group",
    position: "Marketer / Data Analyst",
    period: "February 2018 - January 2021",
    days: `${getPeriodStringWithDays(
      2018,
      2,
      2021,
      1
    )} - A journey of growth and insights!`,
    description: [
      "Developed and executed strategic marketing plans for Portuguese and Brazilian markets.",
      "Conducted comprehensive market analysis to identify trends and opportunities.",
      "Managed budgets effectively, ensuring optimal resource allocation for marketing initiatives.",
      "Planned and executed multi-channel marketing campaigns to drive user acquisition and engagement.",
      "Managed social media presence, enhancing brand visibility and customer interaction.",
      "Utilized Google Tools (Analytics, Search Console, AdWords) for data-driven decision making.",
      "Implemented technical solutions including UTMs, custom parameters, and product feeds for improved tracking and performance analysis.",
      "Analyzed user behavior and campaign performance to optimize marketing strategies.",
    ],
    icon: <PieChart className="h-6 w-6 text-indigo-500" />,
  },
  {
    company: "Consulor",
    position: "Freelance Business/Corporate Strategist",
    period: "June 2014 - January 2018",
    days: `${getPeriodStringWithDays(
      2014,
      6,
      2018,
      1
    )} - Diverse experiences shaping business futures!`,
    description: [
      "Provided expert consulting to help businesses achieve strategic goals and overcome challenges.",
      "Worked closely with clients to understand their unique needs and define comprehensive project scopes.",
      "Focused on results-oriented strategies and long-term planning for sustainable business growth.",
      "Conducted in-depth budget planning and analysis to optimize financial performance.",
      "Assisted clients with business internationalization and expansion strategies.",
      "Engaged in B2B sales, developing strong client relationships and driving business development.",
      "Applied analytical skills to develop targeted strategies informed by market research and data analysis.",
    ],
    icon: <Briefcase className="h-6 w-6 text-indigo-500" />,
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

        <ul className="list-disc pl-5 space-y-1 max-h-[50vh] overflow-auto">
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
