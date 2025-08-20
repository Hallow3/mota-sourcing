import { Component, Input, OnInit } from '@angular/core';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/nav-bar/nav-bar.component';


@Component({
  selector: 'app-home',
  imports: [FooterComponent, NavbarComponent, CommonModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
