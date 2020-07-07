import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  isAuth = false;
  currentUser;
  authListenerSubs: Subscription;
  currentUserSubs: Subscription;

  constructor(
    public authService: AuthService,  
  ) { }

  ngOnInit(): void {
    this.isAuth = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.isAuth = isAuthenticated;
      });
    this.currentUserSubs = this.authService.getCurrentUser()
      .subscribe((userData) => {
        this.currentUser = userData;
      })
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
    this.currentUserSubs.unsubscribe();
  }

}
