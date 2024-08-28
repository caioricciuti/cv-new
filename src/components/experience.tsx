import {
  useState,
  useRef,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Database,
  TrendingUp,
  PieChart,
  Briefcase,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const getPeriodStringWithDays = (
  startYear: number,
  startMonth: number,
  endYear?: number,
  endMonth?: number
): string => {
  const startDate = new Date(startYear, startMonth - 1, 1);
  let endDate: Date;

  if (endYear && endMonth) {
    endDate = new Date(endYear, endMonth, 0);
  } else {
    endDate = new Date();
  }

  const differenceInTime = endDate.getTime() - startDate.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  return `${differenceInDays} days`;
};

const experienceData = [
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
    skills: [
      "Data Engineering",
      "GCP",
      "AWS",
      "Python",
      "NodeJS",
      "Docker",
      "CI/CD",
      "ETL",
      "Data Analysis",
      "Data Visualization",
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
      "Managed and enhanced marketing campaigns, focusing on data segmentation and personalization.",
      "Utilized cloud analytics to improve brand promotion and customer engagement across various platforms.",
      "Collaborated with cross-functional teams to align marketing initiatives with data-centric insights.",
    ],
    skills: [
      "Data Analysis",
      "Marketing Strategy",
      "Cloud Analytics",
      "Data Segmentation",
      "Cross-functional Collaboration",
      "Market Research",
      "Google Tag Manager",
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
    skills: [
      "Marketing Strategy",
      "Market Analysis",
      "Budget Management",
      "Multi-channel Campaigns",
      "Social Media Management",
      "Google Analytics",
      "AdWords",
      "Performance Analysis",
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
    skills: [
      "Business Strategy",
      "Consulting",
      "Project Scoping",
      "Budget Planning",
      "Financial Analysis",
      "Internationalization",
      "B2B Sales",
      "Market Research",
    ],
    icon: <Briefcase className="h-6 w-6 text-indigo-500" />,
  },
];

const ExperienceCard = ({ data }: { data: any }) => {
  // Ref to the skills container
  const skillsRef = useRef(null);

  // Function to scroll left
  const scrollLeft = () => {
    if (skillsRef.current) {
      (skillsRef.current as HTMLDivElement).scrollBy({
        left: -10000,
        behavior: "smooth",
      });
    }
  };

  // Function to scroll right
  const scrollRight = () => {
    if (skillsRef.current) {
      (skillsRef.current as HTMLDivElement).scrollBy({
        left: 10000,
        // scroll very slowly to the right
        behavior: "smooth",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center mb-2">
          {data.icon}
          <h3 className="text-2xl font-bold ml-2">{data.company}</h3>
        </div>
        <h4 className="text-xl mb-1">{data.position}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          {data.period}
        </p>
        <p className="text-xs text-primary/50 mb-4">{data.days}</p>
        <ul className="list-disc pl-5 space-y-1 mb-4 max-h-[40vh] overflow-y-auto">
          {data.description.map((item: string, index: number) => (
            <li key={index} className="text-sm">
              {item}
            </li>
          ))}
        </ul>
        <div className="relative flex items-center mt-4">
          {/* Left Scroll Button */}
          <Button
            variant="link"
            size="icon"
            onMouseEnter={scrollLeft}
            className="z-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Skills Container */}
          <div
            ref={skillsRef}
            className="flex gap-2 overflow-auto scrollbar-hide scroll-smooth mx-2"
          >
            {data.skills.map(
              (
                skill:
                  | string
                  | number
                  | boolean
                  | ReactElement<any, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | null
                  | undefined,
                index: Key | null | undefined
              ) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100 text-xs whitespace-nowrap"
                >
                  {skill}
                </Badge>
              )
            )}
          </div>

          {/* Right Scroll Button */}
          <Button
            variant="link"
            size="icon"
            onMouseEnter={scrollRight}
            className="z-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ExperienceSection = () => {
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
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <ExperienceCard data={experienceData[currentIndex]} />
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between w-full mt-4">
          <Button variant="outline" size="icon" onClick={handlePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection;
