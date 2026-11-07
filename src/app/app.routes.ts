import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { RepositorySearchComponent } from './features/repositories/repository-search/repository-search.component';
import { RepositoryDetailsComponent } from './features/repositories/repository-details/repository-details.component';
import { UserSearchComponent } from './features/users/user-search/user-search.component';
import { UserProfileComponent } from './features/users/user-profile/user-profile.component';
import { IssueExplorerComponent } from './features/issues/issue-explorer/issue-explorer.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'repositories', component: RepositorySearchComponent },
  { path: 'repositories/:owner/:repo', component: RepositoryDetailsComponent },
  { path: 'users', component: UserSearchComponent },
  { path: 'users/:username', component: UserProfileComponent },
  { path: 'issues', component: IssueExplorerComponent },
  { path: '**', redirectTo: '' }
];

