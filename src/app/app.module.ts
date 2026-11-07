import { BrowserModule } from '@angular/platform-browser';
import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { routes } from './app.routes';
import { AppComponent } from './app.component';

// Interceptors
import { GithubHeadersInterceptor } from './core/interceptors/github-headers.interceptor';
import { RateLimitInterceptor } from './core/interceptors/rate-limit.interceptor';

// Shared Components & Pipes
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from './shared/components/error-banner/error-banner.component';
import { EmptyStateComponent } from './shared/components/empty-state/empty-state.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { LanguageBadgeComponent } from './shared/components/language-badge/language-badge.component';
import { StatChipComponent } from './shared/components/stat-chip/stat-chip.component';
import { RateLimitBannerComponent } from './shared/components/rate-limit-banner/rate-limit-banner.component';
import { NumberFormatPipe } from './shared/pipes/number-format.pipe';
import { RelativeDatePipe } from './shared/pipes/relative-date.pipe';

// Feature Components
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { RepositorySearchComponent } from './features/repositories/repository-search/repository-search.component';
import { RepositoryDetailsComponent } from './features/repositories/repository-details/repository-details.component';
import { UserSearchComponent } from './features/users/user-search/user-search.component';
import { UserProfileComponent } from './features/users/user-profile/user-profile.component';
import { IssueExplorerComponent } from './features/issues/issue-explorer/issue-explorer.component';

@NgModule({
  declarations: [
    AppComponent,
    // Shared
    LoadingSpinnerComponent,
    ErrorBannerComponent,
    EmptyStateComponent,
    PaginationComponent,
    LanguageBadgeComponent,
    StatChipComponent,
    RateLimitBannerComponent,
    NumberFormatPipe,
    RelativeDatePipe,
    // Features
    DashboardComponent,
    RepositorySearchComponent,
    RepositoryDetailsComponent,
    UserSearchComponent,
    UserProfileComponent,
    IssueExplorerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GithubHeadersInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RateLimitInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
