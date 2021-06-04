import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: any = {};

  constructor(private apiService: ApiService, private router: Router) { 
    router.events.subscribe((val) => {
      if(val instanceof NavigationEnd) {
        this.getMe();
      }
    });
  }

  ngOnInit(): void {
    this.getMe();
  }

  getMe(): void {
    this.apiService.getMe().subscribe(
      data => this.user = data,
      error => console.log(error)
    );
  }

  logout(): void {
    this.apiService.logout().subscribe(
      data => {
        this.user = {};
        this.router.navigate(['login']);
      },
      error => console.log(error)
    );
  }

}
