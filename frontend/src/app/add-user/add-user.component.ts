import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  users: any[] = [];
  instances: any[] = [];
  userId: string = '';
  instance: string = '';
  userInstances: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getUsers();
    this.getInstances();
  }

  onSubmit(): void {
    this.userInstances.push(this.instance);
    this.userInstances = [...new Set(this.userInstances)];
    this.apiService.updateUser(this.userId, this.userInstances).subscribe(
      data => {},
      error => console.log(error)
    );
  }

  onChange(event: any): void {
    // Get the instances for the currently selected user from our list
    this.userInstances = this.users.find(user => user.id === this.userId).instances;
  }

  getUsers(): void {
    this.apiService.getUsers().subscribe(
      data => {
        this.users = data;
        this.onChange({});
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

  removeUserInstance(instance: string): void {
    let newInstances = this.userInstances.filter(id => id !== instance);
    this.apiService.updateUser(this.userId, newInstances).subscribe(
      data => {
        this.getUsers();
      },
      error => console.log(error)
    );
  }
}
