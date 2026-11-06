import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { RateLimitBannerComponent } from './shared/components/rate-limit-banner/rate-limit-banner.component';
import { RateLimitService } from './core/services/rate-limit.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        RateLimitBannerComponent
      ],
      providers: [
        RateLimitService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'GitHub Explorer'`, () => {
    expect(app.title).toEqual('GitHub Explorer');
  });

  it('should render brand text in sidebar and header', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-text')?.textContent).toContain('GitHub Explorer');
    expect(compiled.querySelector('.app-header-title')?.textContent).toContain('GitHub Explorer');
  });

  it('should toggle sidebar', () => {
    expect(app.sidebarOpen).toBeFalse();
    app.toggleSidebar();
    expect(app.sidebarOpen).toBeTrue();
    app.closeSidebar();
    expect(app.sidebarOpen).toBeFalse();
  });

  it('should toggle about modal', () => {
    expect(app.showAboutModal).toBeFalse();
    app.openAbout();
    expect(app.showAboutModal).toBeTrue();
    app.closeAbout();
    expect(app.showAboutModal).toBeFalse();
  });

  it('should display about modal in DOM when open', () => {
    app.openAbout();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.modal-card')).toBeTruthy();
    expect(compiled.querySelector('.modal-header h2')?.textContent).toContain('About GitHub Explorer');

    app.closeAbout();
    fixture.detectChanges();
    expect(compiled.querySelector('.modal-card')).toBeNull();
  });
});
