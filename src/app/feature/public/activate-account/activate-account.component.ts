import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './activate-account.component.html'
})
export class ActivateAccountComponent implements OnInit {
  isLoading = true;
  isSuccess = false;
  errorMessage = '';
  successMessage = '';
  token = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
    
    if (!this.token) {
      this.isLoading = false;
      this.errorMessage = 'Invalid activation link. No token provided.';
      return;
    }

    this.activateAccount();
  }

  private activateAccount(): void {
    this.authService.activateAccount(this.token).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.successMessage = response.message || 'Your account has been activated successfully!';
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.isSuccess = false;
        this.errorMessage = error.status === 400 ? 
          'Invalid or expired activation token.' : 
          'An error occurred during activation. Please try again.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  requestNewActivationLink(): void {
    this.router.navigate(['/login']);
  }
}