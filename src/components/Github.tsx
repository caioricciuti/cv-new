import React, { useState, useEffect, useCallback, PureComponent } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Pie,
  PieChart,
  Sector,
} from "recharts";
import {
  Github,
  Star,
  GitFork,
  Code,
  Users,
  Activity,
  Box,
  Layers,
  PieChart as PieChartIcon,
  AlertCircleIcon,
} from "lucide-react";

import useGithubStore from "@/store"; // Adjust the path as necessary

interface GithubUser {
  name: string;
  bio: string;
  avatar_url: string;
  followers: number;
  following: number;
  public_repos: number;
}

interface GithubRepo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  language: string;
}

interface GithubEvent {
  created_at: string;
  type: string;
}

interface GithubData {
  user: GithubUser;
  repos: GithubRepo[];
  events: GithubEvent[];
}

const fetchGithubData = async (username: string): Promise<GithubData> => {
  const userRes = await fetch(`https://api.github.com/users/${username}`);
  if (!userRes.ok) throw new Error("Failed to fetch user data");
  const userData: GithubUser = await userRes.json();

  const reposRes = await fetch(
    `https://api.github.com/users/${username}/repos`
  );
  if (!reposRes.ok) throw new Error("Failed to fetch repos data");
  const reposData: GithubRepo[] = await reposRes.json();

  const eventsRes = await fetch(
    `https://api.github.com/users/${username}/events`
  );
  if (!eventsRes.ok) throw new Error("Failed to fetch events data");
  const eventsData: GithubEvent[] = await eventsRes.json();

  return { user: userData, repos: reposData, events: eventsData };
};

interface RepoIconProps {
  size: number;
  color: string;
  starCount: number;
  maxStars: number;
}

const RepoIcon: React.FC<RepoIconProps> = ({
  size,
  color,
  starCount,
  maxStars,
}) => {
  const scale = 0.5 + (starCount / maxStars) * 0.5;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Box
        size={size}
        color={color}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <Star
        size={size * 0.5}
        color={color}
        fill={color}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      />
    </div>
  );
};

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >
        {payload.name}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

class CustomActiveShapePieChart extends PureComponent {
  state = {
    activeIndex: 0,
  };

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  render() {
    const { data } = this.props;
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart width={400} height={400}>
          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={this.onPieEnter}
            className="text-white"
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}

const GithubVisualization: React.FC<{ data: GithubData }> = ({ data }) => {
  const languageData = data.repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(languageData).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="flex flex-col items-center">
      <CustomActiveShapePieChart data={pieData} />
    </div>
  );
};

const ActivityGraph: React.FC<{ events: GithubEvent[] }> = ({ events }) => {
  const processedData = events.reduce((acc, event) => {
    const date = new Date(event.created_at).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(processedData).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

const GithubDashboard: React.FC = () => {
  const [username, setUsername] = useState("caioricciuti");
  const { data, setData } = useGithubStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchGithubData(username);
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [username, setData]);

  useEffect(() => {
    if (!data) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [data, fetchData]);

  return (
    <div className="text-primary p-12">
      <div className="mx-auto">
        {error && (
          <Alert className="bg-red-500/20 text-red-500 border-red-400">
            <AlertCircleIcon className="text-red-500" />
            <AlertTitle className="text-red-500 ml-4">
              Something went wrong when fetching data.
            </AlertTitle>
            <AlertDescription className="text-red-500 ml-4">
              {error} - for <i>{username}</i>
            </AlertDescription>
          </Alert>
        )}
        {!error && (
          <Card className="max-h-screen">
            <CardHeader className="text-center">
              {isLoading ? (
                <motion.div
                  initial={{ scale: 0.4, opacity: 1 }}
                  animate={{ scale: 1.0, opacity: 1 }}
                  transition={{ duration: 2 }}
                >
                  <Github className="mx-auto" size={100} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.4, opacity: 1 }}
                  animate={{ scale: 1.0, opacity: 1 }}
                  transition={{ duration: 2 }}
                >
                  <img
                    src={data?.user.avatar_url}
                    alt={`${data?.user.name}'s avatar`}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h1 className="text-3xl font-bold">{data?.user.name}</h1>
                  <p>{data?.user.bio}</p>
                </motion.div>
              )}
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">
                    <Layers className="w-4 h-4 mr-2" />
                    <span className="hidden md:block">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="repos">
                    <Code className="w-4 h-4 mr-2" />
                    <span className="hidden md:block">Repos</span>
                  </TabsTrigger>
                  <TabsTrigger value="activity">
                    <Activity className="w-4 h-4 mr-2" />
                    <span className="hidden md:block">Activity</span>
                  </TabsTrigger>
                  <TabsTrigger value="visualization">
                    <PieChartIcon className="w-4 h-4 mr-2" />
                    <span className="hidden md:block">Visualization</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium">Followers</h3>
                        <Users className="h-4 w-4" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {data?.user.followers}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium">Following</h3>
                        <Users className="h-4 w-4" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {data?.user.following}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium">Public Repos</h3>
                        <Code className="h-4 w-4" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {data?.user.public_repos}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium">Total Stars</h3>
                        <Star className="h-4 w-4" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {data?.repos.reduce(
                            (acc, repo) => acc + repo.stargazers_count,
                            0
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="repos">
                  <div className="space-y-4 mt-4">
                    {data?.repos.slice(0, 5).map((repo) => (
                      <Card key={repo.id}>
                        <CardHeader>
                          <h3 className="text-lg font-semibold">
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {repo.name}
                            </a>
                          </h3>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm ">{repo.description}</p>
                          <div className="flex space-x-4 mt-2">
                            <span className="flex items-center">
                              <Star className="h-4 w-4 mr-1 text-yellow-500" />
                              {repo.stargazers_count}
                            </span>
                            <span className="flex items-center">
                              <GitFork className="h-4 w-4 mr-1 text-blue-500" />
                              {repo.forks_count}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="activity">
                  <Card className="mt-4">
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Recent Activity</h3>
                    </CardHeader>
                    <CardContent>
                      {data && <ActivityGraph events={data.events} />}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="visualization">
                  <Card className="mt-4">
                    <CardHeader>
                      <h3 className="text-lg font-semibold">
                        Repository Language Distribution
                      </h3>
                    </CardHeader>
                    <CardContent>
                      {data && <GithubVisualization data={data} />}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GithubDashboard;
