import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Character } from '../character.model';
import { CharactersService } from '../characters.service';

@Component({
  selector: 'app-character-view',
  templateUrl: './character-view.component.html',
  styleUrls: ['./character-view.component.css']
})
export class CharacterViewComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  character;
  requestedCharacterSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private charactersService: CharactersService,
  ) { }

  ngOnInit() {
    this.isLoading = true;    
    const index = this.route.snapshot.paramMap.get('index');
    this.requestedCharacterSub = this.charactersService.GetOneOfMyCharactersListener(index)
      .subscribe(character => {
        this.character = character;
        setTimeout(() => {
          this.isLoading = false;
        }, 300);
      })
  }

  CalculateValues(attributes) {
    const calculatedValues = {
      hp: parseInt(attributes.mettle),
      ds: parseInt(attributes.agility) + 10,
      son: parseInt(attributes.resolve)
    }
    return calculatedValues;
  }

  ngOnDestroy() {
    this.requestedCharacterSub.unsubscribe();
  }

}
