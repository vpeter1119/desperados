import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { CommonService } from '../../common/common.service';
import { TextService } from '../../common/text.service';
import { Character } from '../character.model';
import { CharactersService } from '../characters.service';

@Component({
  selector: 'app-character-create',
  templateUrl: './character-create.component.html',
  styleUrls: ['./character-create.component.css']
})
export class CharacterCreateComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  rules;
  rulesSub: Subscription;
  currentStep = 0;
  character: Partial<Character> = {};

  constructor(
    private _common: CommonService,
    public _text: TextService,
    private charactersService: CharactersService,
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.rulesSub = this._common.GetContentListener()
      .subscribe((response: { attributes: [], templates: [], skill: [], message: string }) => {
        if (!response.message) {
          this.rules = response;
          this.currentStep = 0;
        } else {
          //Handle error
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 300);
      })
  }

  SetStep(nr: number) {
    this.currentStep = nr;
  }

  NextStep() {
    this.currentStep++;
  }

  ChooseTemplate(template) {
    this.character.template = template;
    this.NextStep();
  }

  SaveGeneral(name: string, sex: string, age: string) {
    this.character = {
      name: name,
      sex: sex || "unknown",
      age: age || "unknown",
    };
    this.NextStep();
  }

  SaveToServer() {
    // Send current character data to the server
  }

  ngOnDestroy(): void {
    this.rulesSub.unsubscribe();
  }

}
