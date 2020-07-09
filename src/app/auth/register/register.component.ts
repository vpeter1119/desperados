import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {

  isLoading: boolean = false;
  errorMessage: string;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.isLoading = false;
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = "Invalid value entered!";
      return;
    }
    if (form.value.password != form.value.passwordConfirm) {
      this.errorMessage = "The passwords must match!";
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
