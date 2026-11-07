import { GithubOwner } from './github-repo.model';

export interface GithubCommitAuthor {
  name: string;
  email: string;
  date: string;
}

export interface GithubCommitDetail {
  author: GithubCommitAuthor;
  committer: GithubCommitAuthor;
  message: string;
  comment_count: number;
}

export interface GithubCommit {
  sha: string;
  node_id: string;
  commit: GithubCommitDetail;
  url: string;
  html_url: string;
  author: GithubOwner | null;
  committer: GithubOwner | null;
}

