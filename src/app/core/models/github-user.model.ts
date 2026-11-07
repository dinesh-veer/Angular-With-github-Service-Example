export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  type: string;
}

export interface GithubUserSearchResult {
  total_count: number;
  incomplete_results: boolean;
  items: GithubUserItem[];
}

export interface GithubUserItem {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: string;
  score?: number;
  site_admin?: boolean;
}

