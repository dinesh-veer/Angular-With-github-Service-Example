export interface GithubOwner {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: string;
  site_admin?: boolean;
}

export interface GithubLicense {
  key: string;
  name: string;
  spdx_id: string;
  url?: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: GithubOwner;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  license: GithubLicense | null;
  topics: string[];
  default_branch: string;
  subscribers_count?: number;
  network_count?: number;
}

export interface GithubRepoSearchResult {
  total_count: number;
  incomplete_results: boolean;
  items: GithubRepo[];
}

export interface GithubContributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

export interface GithubLanguages {
  [language: string]: number;
}

export interface GithubReadme {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content?: string;
  encoding?: string;
}

