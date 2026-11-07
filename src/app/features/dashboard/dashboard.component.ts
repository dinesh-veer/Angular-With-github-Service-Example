import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GithubApiService } from '../../core/services/github-api.service';
import { GithubRepo } from '../../core/models/github-repo.model';

interface CuratedRepo {
  owner: string;
  repo: string;
  logo: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  searchQuery = '';
  searchScope: 'repositories' | 'users' | 'issues' = 'repositories';

  popularRepos: GithubRepo[] = [];
  isLoading = false;
  error: string | null = null;

  curatedList: CuratedRepo[] = [
    { owner: 'angular', repo: 'angular', logo: 'A', color: '#dd0031' },
    { owner: 'facebook', repo: 'react', logo: '⚛', color: '#61dafb' },
    { owner: 'spring-projects', repo: 'spring-boot', logo: '🍃', color: '#6db33f' },
    { owner: 'tensorflow', repo: 'tensorflow', logo: '🟧', color: '#ff6f00' },
    { owner: 'microsoft', repo: 'vscode', logo: '🟦', color: '#007acc' },
    { owner: 'docker', repo: 'docker-ce', logo: '🐋', color: '#2496ed' }
  ];

  constructor(
    private githubService: GithubApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPopularRepos();
  }

  onSearch(): void {
    const q = this.searchQuery.trim();
    if (!q) return;

    if (this.searchScope === 'repositories') {
      this.router.navigate(['/repositories'], { queryParams: { q } });
    } else if (this.searchScope === 'users') {
      this.router.navigate(['/users'], { queryParams: { q } });
    } else {
      this.router.navigate(['/issues'], { queryParams: { repo: q } });
    }
  }

  setScope(scope: 'repositories' | 'users' | 'issues'): void {
    this.searchScope = scope;
  }

  loadPopularRepos(): void {
    this.isLoading = true;
    this.error = null;

    // Search top starred repositories for a dynamic, live list
    this.githubService.searchRepositories({
      query: 'stars:>50000',
      sort: 'stars',
      order: 'desc',
      page: 1,
      perPage: 6
    }).subscribe({
      next: (result) => {
        this.popularRepos = result.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Unable to load popular repositories right now.';
        this.isLoading = false;
      }
    });
  }

  getCuratedLogo(fullName: string): { logo: string; color: string } {
    const matched = this.curatedList.find(c => `${c.owner}/${c.repo}`.toLowerCase() === fullName.toLowerCase());
    if (matched) {
      return { logo: matched.logo, color: matched.color };
    }
    return { logo: '📦', color: '#0969da' };
  }
}

