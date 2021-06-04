import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.apiService.register(this.email, this.password).subscribe(
      data => {
        // Log in the user as well
        this.apiService.login(this.email, this.password).subscribe(
          data => {
            this.router.navigate(['']);
          },
          error => console.log(error)
        );
      },
      error => console.log(error)
    );
  }

}
