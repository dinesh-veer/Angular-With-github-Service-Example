export interface RateLimitResource {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
  resource?: string;
}

export interface GithubRateLimit {
  resources: {
    core: RateLimitResource;
    search: RateLimitResource;
    graphql?: RateLimitResource;
    integration_manifest?: RateLimitResource;
  };
  rate: RateLimitResource;
}

export interface RateLimitStatus {
  limit: number;
  remaining: number;
  resetTime: Date;
  isExceeded: boolean;
  resource: 'core' | 'search';
}

