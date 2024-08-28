import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";
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
  SearchSlash,
} from "lucide-react";
import useGithubStore from "@/store";
import { Input } from "./ui/input";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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

const GithubDashboard: React.FC = () => {
  const [username] = useState("caioricciuti");
  const { data, lastFetched, setData } = useGithubStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const chartConfig = {
    date: {
      label: "date",
    },
    count: {
      label: "count",
    },
  } satisfies ChartConfig;

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

  const activityChartData = useMemo(() => {
    const eventCounts = data?.events.reduce((acc, event) => {
      const date = new Date(event.created_at).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(eventCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data?.events]);

  const mostUsedLanguagesChartData = useMemo(() => {
    const languageCounts = data?.repos.reduce((acc, repo) => {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(languageCounts)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count);
  }, [data?.repos]);

  return (
    <div className="text-primary p-2 md:p-12 min-h-screen">
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
                  <h1 className="text-2xl font-bold flex items-center m-auto w-full">
                    Github stats <Github className="ml-4" />
                  </h1>
                </motion.div>
              )}
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">
                    <Layers className="w-4 h-4" />
                    <span className="hidden md:block ml-2">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="repos">
                    <Code className="w-4 h-4" />
                    <span className="hidden md:block ml-2">Repos</span>
                  </TabsTrigger>
                  <TabsTrigger value="activity">
                    <Activity className="w-4 h-4" />
                    <span className="hidden md:block ml-2">Activity</span>
                  </TabsTrigger>
                  <TabsTrigger value="visualization">
                    <PieChartIcon className="w-4 h-4" />
                    <span className="hidden md:block ml-2">Visualization</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 max-h-[60vh] overflow-auto">
                    {filteredRepos && filteredRepos.length > 0 ? (
                      filteredRepos.map((repo) => (
                        <Card key={repo.id}>
                          <CardHeader>
                            <p className="text-lg font-bold">
                              <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {repo.name}
                              </a>
                            </p>
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
                          <SearchSlash className="w-16 h-16 mx-auto mt-4" />
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="activity">
                  <Card>
                    <CardHeader>
                      <CardTitle>How active?</CardTitle>
                      <CardDescription>
                        A chart showing my activity on Github!
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        className="max-h-[50vh] w-full"
                        config={chartConfig}
                      >
                        <LineChart
                          accessibilityLayer
                          data={activityChartData}
                          margin={{
                            left: 12,
                            right: 12,
                          }}
                        >
                          <CartesianGrid vertical={true} />
                          <XAxis dataKey="date" tickMargin={8} />
                          <YAxis dataKey="count" tickMargin={8} />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                          />
                          <Line
                            dataKey="count"
                            type="monotone"
                            strokeWidth={3}
                          />
                        </LineChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="visualization">
                  <Card>
                    <CardHeader>
                      <CardTitle>Bar Chart</CardTitle>
                      <CardDescription></CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        className="max-h-[50vh] w-full"
                        config={chartConfig}
                      >
                        <BarChart
                          accessibilityLayer
                          data={mostUsedLanguagesChartData}
                        >
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey="language"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                          />
                          <YAxis
                            dataKey="count"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                          />
                          <ChartTooltip
                            cursor={false}
                            content={
                              <ChartTooltipContent
                                hideLabel
                                indicator="dashed"
                              />
                            }
                          />
                          <Bar dataKey="count" fill="#8884d8" radius={8} />
                        </BarChart>
                      </ChartContainer>
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
