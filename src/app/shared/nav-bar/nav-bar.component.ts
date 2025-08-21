import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavbarComponent implements OnInit {
  menu: boolean = false;
  isAuthenticated: boolean = false;

  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
  }

  toggleMenu(){
    this.menu = !this.menu;
  }

  login(){
    this.router.navigate(['/login']);
  }

  register(){
    this.router.navigate(['/register']);
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/']);
  }

  profileManagement(){
  }

}
