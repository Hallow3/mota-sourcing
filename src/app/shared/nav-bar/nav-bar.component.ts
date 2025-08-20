import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavbarComponent{
  menu: boolean = false;
  user: boolean = false;

  toggleMenu(){
    this.menu = !this.menu;
  }

  login(){
  }

  logout(){
  }

  profileManagement(){
  }

}
