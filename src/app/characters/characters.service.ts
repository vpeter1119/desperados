import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { AuthService } from '../auth/auth.service';
import { Character } from './character.model';

@Injectable({ providedIn: "root" })
export class CharactersService {

  apiUrl = "https://mcrpc-server-pr-14.herokuapp.com/api/desperados";
  currentUser;
  characters;
  charactersListener = new Subject<Character[]>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
  ) { }

  GetMyCharacters() {
    this.currentUser = this.authService.getCurrentUserRaw();
    let id = this.currentUser.id;
    const url = `${this.apiUrl}/users/${id}/characters`;
    this.http.get<{ ok: boolean, result: Character[] }>(url)
      .subscribe(response => {
        if (response.ok && response.result) {
          if (response.result.length) {
            this.characters = response.result;
            this.charactersListener.next([...this.characters]);
          } else {
            this.characters = null;
            this.charactersListener.next(this.characters);
          }          
        } else {
          // Handle error
          window.alert("Error! Please try again later.");
          this.router.navigate(['login']);
        }
      });
  }

  GetMyCharactersListener() {
    this.GetMyCharacters();
    return this.charactersListener.asObservable();
  }

}
