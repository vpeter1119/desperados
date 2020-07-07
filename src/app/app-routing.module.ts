import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from "./auth/auth.guard";

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CharactersComponent } from './characters/characters.component';


const routes: Routes = [
  { path: '', redirectTo: '/my-characters', pathMatch: 'full' },
  { path: 'home', redirectTo: '/my-characters', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'characters', redirectTo: '/my-characters', pathMatch: 'full' },
  { path: 'my-characters', component: CharactersComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
