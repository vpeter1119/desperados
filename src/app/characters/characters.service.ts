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
  requestedCharacter;
  requestedCharacterListener = new Subject<Character>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
  ) { }

  // Create a new character
  CreateCharacter(characterData: Partial<Character>, HandleOutCome) {
    let res: boolean;
    this.currentUser = this.authService.getCurrentUserRaw();
    let id = this.currentUser.id;
    const url = `${this.apiUrl}/users/${id}/characters`;
    this.http.post<{ok: boolean, result: Character}>(url, characterData).subscribe(response => {
      // Handle response
      if (response.ok) {
        this.router.navigate["my-characters"]; // TO DO: Redirect to character page using index
        HandleOutCome(true);
      } else {
        // Handle error
        res = false;
        HandleOutCome(false);
      }
    });
  }

  // Get data for all characters of current user
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
          this.authService.logout();
          this.router.navigate(['login']);
        }
      });
  }
  GetMyCharactersListener() {
    this.GetMyCharacters();
    return this.charactersListener.asObservable();
  }

  // Get data for the current user's character, specified by character index
  GetOneOfMyCharacters(index) {
    this.currentUser = this.authService.getCurrentUserRaw();
    let id = this.currentUser.id;
    const url = `${this.apiUrl}/users/${id}/characters/${index}`;
    this.http.get<{ ok: boolean, result: Character[] }>(url)
      .subscribe(response => {
        if (response.ok && response.result) {
          this.requestedCharacter = response.result;
          this.requestedCharacterListener.next(this.requestedCharacter);          
        } else {
          // Handle error
          window.alert("Error! Please try again later.");
          this.authService.logout();
          this.router.navigate(['login']);
        }
      });
  }
  GetOneOfMyCharactersListener(index) {
    this.GetOneOfMyCharacters(index);
    return this.requestedCharacterListener.asObservable();
  }

  // Update character data with current values
  SaveCharacterData(characterData) {
    // Make a PUT request using the whole character data (updated with new values)
  }

}
