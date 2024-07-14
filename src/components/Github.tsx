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
import { Button } from "@/components/ui/button";
import {
  Github,
  Star,
  GitFork,
  Code,
  Users,
  Activity,
  Layers,
  PieChart as PieChartIcon,
  AlertCircleIcon,
} from "lucide-react";

import useGithubStore from "@/store"; // Adjust the path as necessary
import { Input } from "./ui/input";

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
  size: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
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

const renderActiveShape = (props: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: { name: string };
  percent: number;
  value: number;
}) => {
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
        fill="#8c8c8c"
        className="mb-2"
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

class CustomActiveShapePieChart extends PureComponent<
  { data: { name: string; value: number }[] },
  { activeIndex: number }
> {
  state = {
    activeIndex: 0,
  };

  onPieEnter = (_: any, index: number) => {
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
            activeShape={renderActiveShape as any}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={this.onPieEnter}
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
        <Tooltip labelClassName="text-gray-500" />
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

const GithubDashboard: React.FC = () => {
  const [username, setUsername] = useState("caioricciuti");
  const { data, lastFetched, setData, clearData } = useGithubStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

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
    const now = Date.now();
    const isDataExpired =
      !lastFetched || now - lastFetched > 24 * 60 * 60 * 1000;

    if (!data || isDataExpired) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [data, lastFetched, fetchData]);

  const filteredRepos = data?.repos
    .filter((repo) =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.stargazers_count - a.stargazers_count);

  return (
    <div className="text-primary p-2 md:p-12">
      <div className="m-auto h-full w-full">
        {error && (
          <Alert className="bg-red-500/20 text-red-500 border-red-400">
            <AlertCircleIcon className="text-red-500" />
            <AlertTitle className="text-red-500 ml-4">
              Something went wrong when fetching data for my Github profile...
              Sorry about that!
            </AlertTitle>
            <AlertDescription className="text-red-500 ml-4">
              {error} - for <i>{username}</i>
              <Button variant="link" onClick={() => fetchData()}>
                Retry
              </Button>
            </AlertDescription>
            <AlertDescription className="text-red-500 ml-4">
              Please try again later. - Or access my Github profile directly by{" "}
              <a
                className="font-bold "
                href="https://github.com/caioricciuti"
                target="_blank"
              >
                Clicking here
              </a>
            </AlertDescription>
          </Alert>
        )}
        {!error && (
          <Card>
            <CardHeader className="text-center">
              {isLoading ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 1 }}
                  animate={{ scale: 1.0, opacity: 1 }}
                  transition={{ duration: 2 }}
                >
                  <Github className="mx-auto" size={100} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 1 }}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
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
                  <div className="mb-4">
                    <Input
                      type="text"
                      placeholder="Search repositories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-4 border rounded mt-4 mb-2"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {filteredRepos && filteredRepos.length > 0 ? (
                      filteredRepos.map((repo) => (
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
                            <p className="text-sm">{repo.description}</p>
                            <div className="flex space-x-4 mt-2">
                              <span className="flex items-center">
                                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                                {repo.stargazers_count}
                              </span>
                              <span className="flex items-center">
                                <GitFork className="h-4 w-4 mr-1 text-blue-500" />
                                {repo.forks_count}
                              </span>
                              <span className="flex items-center">
                                <Activity className="h-4 w-4 mr-1 text-green-500" />
                                {repo.open_issues_count} issues
                              </span>
                            </div>
                            <div className="text-sm mt-2">
                              <div>Size: {repo.size} KB</div>
                              <div>
                                Created:{" "}
                                {new Date(repo.created_at).toLocaleDateString()}
                              </div>
                              <div>
                                Updated:{" "}
                                {new Date(repo.updated_at).toLocaleDateString()}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center col-span-full mt-6 border p-12 rounded-md">
                        <div>
                          <p>
                            No repositories found for the search term:{" "}
                            <strong>{searchTerm}</strong>
                          </p>
                        </div>
                      </div>
                    )}
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
