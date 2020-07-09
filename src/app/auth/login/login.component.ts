import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {

  isLoading: boolean = false;
  errorMessage: string;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.isLoading = false;
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = "Missing username or password.";
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.username, form.value.password);
  }
}
