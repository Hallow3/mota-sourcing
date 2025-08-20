import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RegisterRequest } from '../../../core/model/auth.models';
import { AuthService } from '../../../core/service/auth.service';
import { ValidationService } from '../../../core/service/validation.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  //styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showSuccessCard = false;
  passwordStrength: any = { strength: 0, label: 'Very Weak', color: 'bg-red-500' };
  showPassword = false;

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
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, this.nameValidator.bind(this)]],
      lastName: ['', [Validators.required, this.nameValidator.bind(this)]],
      email: ['', [Validators.required, this.emailValidator.bind(this)]],
      password: ['', [Validators.required, this.passwordValidator.bind(this)]],
      confirmPassword: ['', [Validators.required]],
      phone: ['', [Validators.required, this.phoneValidator.bind(this)]],
      userType: ['CLIENT', [Validators.required]],
      
      // Admin fields
      department: [''],
      adminLevel: [''],
      
      // Client fields
      company: [''],
      industry: [''],
      
      // Other fields
      category: [''],
      description: [''],
      
      termsAccepted: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });


    // Watch password changes for strength indicator
    this.registerForm.get('password')?.valueChanges.subscribe(password => {
      if (password) {
        this.passwordStrength = this.validationService.getPasswordStrength(password);
      }
    });
  }

  private nameValidator(control: any) {
    if (!control.value) return null;
    return this.validationService.validateName(control.value) ? null : { invalidName: true };
  }

  private emailValidator(control: any) {
    if (!control.value) return null;
    return this.validationService.validateEmail(control.value) ? null : { invalidEmail: true };
  }

  private phoneValidator(control: any) {
    if (!control.value) return null;
    return this.validationService.validatePhone(control.value) ? null : { invalidPhone: true };
  }

  private passwordValidator(control: any) {
    if (!control.value) return null;
    const validation = this.validationService.validatePassword(control.value);
    return validation.isValid ? null : { weakPassword: validation.errors };
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.registerForm.value;
      const registerRequest: RegisterRequest = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        password: formValue.password,
        phone: formValue.phone || undefined,
        userType: "CLIENT"
      };

      this.authService.register(registerRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.showSuccessCard = true;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = this.getErrorMessage(error);
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private getErrorMessage(error: any): string {
    if (error.error?.details) {
      return error.error.details.map((detail: any) => detail.message).join(', ');
    } else if (error.error?.message) {
      return error.error.message;
    } else {
      return 'An error occurred during registration. Please try again.';
    }
  }
}