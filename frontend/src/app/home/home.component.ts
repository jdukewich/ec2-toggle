import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { startWith, switchMap } from "rxjs/operators";
import { ApiService } from '../api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  myInstances: any[] = [];
  intervalId: any = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getMyInstances();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  getMyInstances(): void {
    this.apiService.getMyInstances().subscribe(
      data => {
        this.myInstances = data;
      },
      error => console.log(error)
    );
  }

  pollInstanceState(id: string, index: number, target: string): void {
    let loading = document.getElementById('loading' + index);
    let toggle = document.getElementById('toggle' + index);

    this.intervalId = setInterval((async () => {
      this.apiService.getInstanceState(id).subscribe(
        data => {
          if (data === target) {
            // Get new states
            this.getMyInstances();
            // Remove spinner and add back toggle button here
            if (toggle && loading) {
              toggle.style.display = "inline-block";
              loading.style.display = "none";
            }
            // Destroy timer
            this.clearPoll();
          }
          return data;
        },
        error => console.log(error)
      );
    }).bind(this), 5000);
  }

  clearPoll(): void {
    clearInterval(this.intervalId);
  }

  toggleInstance(id: string, oldState: string, index: number): void {
    let loading = document.getElementById('loading' + index);
    let toggle = document.getElementById('toggle' + index);
    // Remove button and add loading spinner
    if (toggle && loading) {
      toggle.style.display = "none";
      loading.style.display = "inline-block";
    }

    this.apiService.toggleInstance(id).subscribe(
      data => {
        // Loop until the state changes
        let target = 'running';
        if (oldState === 'running') {
          target = 'stopped';
        }

        // Start the timer
        this.pollInstanceState(id, index, target);
      },
      error => console.log(error)
    );
  }

}
