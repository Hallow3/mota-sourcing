import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginRequest } from '../../../core/model/auth.models';
import { AuthService } from '../../../core/service/auth.service';
import { ValidationService } from '../../../core/service/validation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  //styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  rememberMe = false;

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
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, this.emailValidator.bind(this)]],
      password: ['', [Validators.required]]
    });
  }

  private emailValidator(control: any) {
    if (!control.value) return null;
    return this.validationService.validateEmail(control.value) ? null : { invalidEmail: true };
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginRequest: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          const redirectUrl = this.authService.getRedirectUrl();
          this.router.navigate([redirectUrl]);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = this.getErrorMessage(error);
        }
      });
    }
  }

  private getErrorMessage(error: any): string {
    if (error.status === 400) {
      return 'Invalid email or password';
    } else if (error.status === 401) {
      return 'Please verify your email before logging in';
    } else {
      return 'An error occurred. Please try again.';
    }
  }

  toggleRememberMe(): void {
    this.rememberMe = !this.rememberMe;
  }
}