import { GithubOwner } from './github-repo.model';

export interface GithubLabel {
  id: number;
  name: string;
  color: string;
  description: string | null;
  default?: boolean;
}

export interface GithubPullRequestRef {
  url: string;
  html_url: string;
  diff_url?: string;
  patch_url?: string;
}

export interface GithubIssue {
  id: number;
  number: number;
  title: string;
  user: GithubOwner;
  labels: GithubLabel[];
  state: 'open' | 'closed';
  locked: boolean;
  assignee: GithubOwner | null;
  assignees?: GithubOwner[];
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  body: string | null;
  html_url: string;
  pull_request?: GithubPullRequestRef;
}

