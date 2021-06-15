import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-add-instance',
  templateUrl: './add-instance.component.html',
  styleUrls: ['./add-instance.component.css']
})
export class AddInstanceComponent implements OnInit {

  id: string = '';
  instances: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getInstances();
  }

  onSubmit(): void {
    this.apiService.addInstance(this.id).subscribe(
      data => {
        this.id = '';
        this.getInstances();
      },
      error => console.log(error)
    );
  }

  getInstances(): void {
    this.apiService.getInstances().subscribe(
      data => {
        this.instances = data;
      },
      error => console.log(error)
    );
  }

  removeInstance(id: string): void {
    this.apiService.deleteInstance(id).subscribe(
      data => {
        this.getInstances();
      },
      error => console.log(error)
    );
  }

}
