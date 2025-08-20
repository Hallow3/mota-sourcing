import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ResetPasswordRequest } from '../../../core/model/auth.models';
import { AuthService } from '../../../core/service/auth.service';
import { ValidationService } from '../../../core/service/validation.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  //styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  token = '';
  passwordStrength: any = { strength: 0, label: 'Very Weak', color: 'bg-red-500' };
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private validationService: ValidationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';
    if (!this.token) {
      this.errorMessage = 'Invalid reset token.';
      return;
    }
    this.initForm();
  }

  private initForm(): void {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, this.passwordValidator.bind(this)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Watch password changes for strength indicator
    this.resetPasswordForm.get('newPassword')?.valueChanges.subscribe(password => {
      if (password) {
        this.passwordStrength = this.validationService.getPasswordStrength(password);
      }
    });
  }

  private passwordValidator(control: any) {
    if (!control.value) return null;
    const validation = this.validationService.validatePassword(control.value);
    return validation.isValid ? null : { weakPassword: validation.errors };
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && this.token) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const request: ResetPasswordRequest = {
        token: this.token,
        newPassword: this.resetPasswordForm.value.newPassword
      };

      this.authService.resetPassword(request).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Password reset successful! You can now login with your new password.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.status === 400 ? 
            'Invalid or expired reset token.' : 
            'An error occurred. Please try again.';
        }
      });
    }
  }
}