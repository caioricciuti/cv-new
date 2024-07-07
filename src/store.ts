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
  setData: (data: GithubData) => void;
  clearData: () => void;
}

type MyPersistOptions = PersistOptions<GithubState>;

const useGithubStore = create<GithubState>(
  (persist as any)(
    (set: any) => ({
      data: null,
      setData: (data: GithubData) => set({ data }),
      clearData: () => set({ data: null }),
    }),
    {
      name: "github-data",
      getStorage: () => localStorage,
    } as MyPersistOptions
  )
);

export default useGithubStore;
