import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from "./auth/auth.guard";

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CharactersComponent } from './characters/characters.component';
import { CharacterViewComponent } from './characters/character-view/character-view.component';
import { CharacterCreateComponent } from './characters/character-create/character-create.component';


const routes: Routes = [
  { path: '', redirectTo: '/my-characters', pathMatch: 'full' },
  { path: 'home', redirectTo: '/my-characters', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'characters', redirectTo: '/my-characters', pathMatch: 'full' },
  { path: 'my-characters', component: CharactersComponent, canActivate: [AuthGuard], pathMatch: 'full' },
  { path: 'my-characters/create', component: CharacterCreateComponent, canActivate: [AuthGuard] },
  { path: 'my-characters/:index', component: CharacterViewComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
