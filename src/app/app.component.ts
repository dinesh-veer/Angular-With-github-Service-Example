import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GitHub Explorer';
  sidebarOpen = false;
  showAboutModal = false;

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  openAbout(): void {
    this.showAboutModal = true;
  }

  closeAbout(): void {
    this.showAboutModal = false;
  }
}
