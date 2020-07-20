import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Character } from '../character.model';
import { CharactersService } from '../characters.service';
import { TextService } from '../../common/text.service';
import { CommonService } from '../../common/common.service';

@Component({
  selector: 'app-character-view',
  templateUrl: './character-view.component.html',
  styleUrls: ['./character-view.component.css']
})
export class CharacterViewComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  character;
  requestedCharacterSub: Subscription;
  rules;
  rulesSub: Subscription;
  physical;
  mental;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private charactersService: CharactersService,
    public _text: TextService,
    private _common: CommonService,
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.rulesSub = this._common.GetContentListener()
      .subscribe((response: { attributes: [], templates: [], skill: [], message: string }) => {
        if (!response.message) {
          this.rules = response;
        } else {
          //Handle error
        }
      })
    const index = this.route.snapshot.paramMap.get('index');
    this.requestedCharacterSub = this.charactersService.GetOneOfMyCharactersListener(index)
      .subscribe(character => {
        this.character = character;
        this.physical = [
          { name: "brawn", value: this.character.attributes.brawn },
          { name: "agility", value: this.character.attributes.agility },
          { name: "mettle", value: this.character.attributes.mettle },
        ];
        console.warn(this.physical);
        this.mental = [
          { name: "insight", value: this.character.attributes.insight },
          { name: "wits", value: this.character.attributes.wits },
          { name: "resolve", value: this.character.attributes.resolve },
        ];
        console.warn(this.mental);
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
    this.rulesSub.unsubscribe();
  }

}
