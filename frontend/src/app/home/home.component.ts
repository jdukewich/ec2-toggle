import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  myInstances: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getMyInstances();
  }

  getMyInstances(): void {
    this.apiService.getMyInstances().subscribe(
      data => {
        this.myInstances = data;
      },
      error => console.log(error)
    );
  }

  toggleInstance(id: string): void {
    let loading = document.getElementById('loading');
    let toggle = document.getElementById('toggle');
    // Remove button and add loading spinner
    if (toggle && loading) {
      toggle.style.display = "none";
      loading.style.display = "inline-block";
    }

    this.apiService.toggleInstance(id).subscribe(
      data => {
        // Get new states
        this.getMyInstances();
        // Remove spinner and add back toggle button here
        if (toggle && loading) {
          toggle.style.display = "inline-block";
          loading.style.display = "none";
        }
      },
      error => console.log(error)
    );
  }

}
