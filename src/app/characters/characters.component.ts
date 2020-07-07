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

  currentUser;
  characters: Character[];
  charactersSubs: Subscription;

  constructor(
    private authService: AuthService,
    private charactersService: CharactersService,
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUserRaw();
    this.charactersSubs = this.charactersService.GetMyCharactersListener().subscribe((characters: Character[]) => {
      console.warn(characters);
      this.characters = characters;
    })
  }

  ngOnDestroy(): void {
    this.charactersSubs.unsubscribe();
  }

}
