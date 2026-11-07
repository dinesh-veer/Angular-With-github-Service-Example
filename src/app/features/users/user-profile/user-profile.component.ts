import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GithubApiService } from '../../../core/services/github-api.service';
import { GithubUser, GithubUserItem } from '../../../core/models/github-user.model';
import { GithubRepo } from '../../../core/models/github-repo.model';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  username = '';
  user: GithubUser | null = null;
  repos: GithubRepo[] = [];
  followers: GithubUserItem[] = [];
  following: GithubUserItem[] = [];

  activeTab: 'repositories' | 'followers' | 'following' = 'repositories';

  isLoading = true;
  isLoadingSubTab = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private githubService: GithubApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params['username'];
      if (this.username) {
        this.loadProfile();
      }
    });
  }

  loadProfile(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      user: this.githubService.getUser(this.username),
      repos: this.githubService.getUserRepositories(this.username, 1, 30, 'updated').pipe(
        catchError(() => of({ data: [], links: {} }))
      )
    }).subscribe({
      next: (results) => {
        this.user = results.user;
        this.repos = results.repos.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.error = `User "${this.username}" was not found.`;
        } else if (err.status === 403) {
          this.error = 'GitHub API rate limit exceeded. Please try again later.';
        } else {
          this.error = 'Failed to load user profile. Please try again.';
        }
      }
    });
  }

  setTab(tab: 'repositories' | 'followers' | 'following'): void {
    this.activeTab = tab;
    if (tab === 'followers' && this.followers.length === 0) {
      this.loadFollowers();
    } else if (tab === 'following' && this.following.length === 0) {
      this.loadFollowing();
    }
  }

  loadFollowers(): void {
    this.isLoadingSubTab = true;
    this.githubService.getUserFollowers(this.username, 1, 30).subscribe({
      next: (res) => {
        this.followers = res.data;
        this.isLoadingSubTab = false;
      },
      error: () => {
        this.isLoadingSubTab = false;
      }
    });
  }

  loadFollowing(): void {
    this.isLoadingSubTab = true;
    this.githubService.getUserFollowing(this.username, 1, 30).subscribe({
      next: (res) => {
        this.following = res.data;
        this.isLoadingSubTab = false;
      },
      error: () => {
        this.isLoadingSubTab = false;
      }
    });
  }
}

