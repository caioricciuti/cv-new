import create from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

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

interface GithubState {
  data: GithubData | null;
  lastFetched: number | null;
  setData: (data: GithubData) => void;
  clearData: () => void;
}

type MyPersistOptions = PersistOptions<GithubState>;

const useGithubStore = create<GithubState>(
  (persist as any)(
    (set: any) => ({
      data: null,
      lastFetched: null,
      setData: (data: GithubData) => set({ data, lastFetched: Date.now() }),
      clearData: () => set({ data: null, lastFetched: null }),
    }),
    {
      name: "github-data",
      getStorage: () => localStorage,
    } as MyPersistOptions
  )
);

export default useGithubStore;
