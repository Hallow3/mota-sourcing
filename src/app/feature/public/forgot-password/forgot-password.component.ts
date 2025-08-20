import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ForgotPasswordRequest } from '../../../core/model/auth.models';
import { AuthService } from '../../../core/service/auth.service';
import { ValidationService } from '../../../core/service/validation.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  //styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private validationService: ValidationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, this.emailValidator.bind(this)]]
    });
  }

  private emailValidator(control: any) {
    if (!control.value) return null;
    return this.validationService.validateEmail(control.value) ? null : { invalidEmail: true };
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const request: ForgotPasswordRequest = {
        email: this.forgotPasswordForm.value.email
      };

      this.authService.forgotPassword(request).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Password reset instructions have been sent to your email.';
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.status === 404 ? 
            'No account found with this email address.' : 
            'An error occurred. Please try again.';
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }
}