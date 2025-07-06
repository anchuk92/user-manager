import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="container">
      <h4>Page Not Found</h4>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <button mat-raised-button color="primary" (click)="navigateHome()">
        <mat-icon>home</mat-icon>
        Home
      </button>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    button {
      margin-top: 8px;
    }
  `]
})
export class PageNotFoundComponent {
  private readonly router = inject(Router);

  navigateHome() {
    this.router.navigate(['/']);
  }
}
