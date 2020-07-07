import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent {
  isLoading = false;

  constructor(public authService: AuthService) { }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    var username = form.value.username;
    var password = form.value.password;
    this.authService.createUser(form.value.email, username, form.value.password);
    setTimeout(() => {
      this.authService.login(username, password);
    }, 2000);
  }
}
