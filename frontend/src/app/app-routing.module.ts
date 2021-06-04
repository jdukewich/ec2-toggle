import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginActivateGuard } from './login-activate.guard';
import { AddInstanceComponent } from './add-instance/add-instance.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'add-user', component: AddUserComponent, canActivate: [LoginActivateGuard] },
  { path: 'add-instance', component: AddInstanceComponent, canActivate: [LoginActivateGuard] },
  { path: '', component: HomeComponent, canActivate: [LoginActivateGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
