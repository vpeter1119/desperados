import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";

import { AuthService } from '../auth/auth.service';
import { CharactersService } from './characters.service';
import { Character } from './character.model';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;
  currentUser;
  characters: Character[];
  charactersSubs: Subscription;

  constructor(
    private authService: AuthService,
    private charactersService: CharactersService,
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.currentUser = this.authService.getCurrentUserRaw();
    this.charactersSubs = this.charactersService.GetMyCharactersListener().subscribe((characters: Character[]) => {
      console.warn(characters);
      this.characters = characters;
      setTimeout(() => {
        this.isLoading = false;
      }, 300);
    })
  }

  ngOnDestroy(): void {
    this.charactersSubs.unsubscribe();
  }

}
