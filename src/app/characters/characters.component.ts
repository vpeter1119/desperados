import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

import { AuthService } from '../auth/auth.service';
import { CharactersService } from './characters.service';
import { Character } from './character.model';
import { CommonService } from '../common/common.service';

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
    private _common: CommonService,
    public router: Router,
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

  ViewCharacter(char) {
    const route = `my-characters/${char.index}`;
    this.router.navigate([route]);
  }

  DeleteCharacter(char) {
    this.charactersService.DeleteOneOfMyCharactersListener(char).subscribe(response => {
      if (response == "error") {
        // Handle error
      } else {
        // Remove character from array
        this.RemoveFromArray(char, this.characters);
      }
    })
  }

  ngOnDestroy(): void {
    this.charactersSubs.unsubscribe();
  }

  //Generic method to remove element from array by 'name'
  RemoveFromArray(element, array) {
    var index = array.map(function (e) { return e.index; }).indexOf(element.index);
    if (index > -1) {
      array.splice(index, 1);
    }
  }

}
