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
  attributeMinimums: any = {};
  attributePoints = 20;
  attributePointsMax = 20;

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

  SaveGeneral(name: string, sex: string, age: string) {
    this.character = {
      name: name,
      sex: sex || "unknown",
      age: age || "unknown",
    };
    this.NextStep();
  }

  ChooseTemplate(template) {
    this.character.template = template;
    this.character.attributes = {};
    this.rules.a.attributes.forEach(attr => {
      this.character.attributes[attr.name] = 1;
      this.attributeMinimums[attr.name] = 1;
    });
    template.mods.forEach(el => {
      this.character.attributes[el.attribute] = el.value + 1;
      this.attributeMinimums[el.attribute] = el.value + 1;
    });
    this.CalculateAttributePoints();
    this.NextStep();
  }

  CreateCharacter() {
    var characterData = {};
    this.charactersService.CreateCharacter(characterData, (ok) => {
      if (ok) {
        // Handle success
      } else {
        // Handle error
      }
    });
  }

  SetAttribute(name, value) {
    let a = value < this.attributeMinimums[name];
    let b = (value-this.character.attributes[name]) > this.attributePoints;
    if (a || b) return;
    this.character.attributes[name] = value;
    this.CalculateAttributePoints();
  }

  CalculateAttributePoints() {
    let spent = 0;
    this.rules.a.attributes.forEach(attr => {
      spent += this.character.attributes[attr.name];
    });
    this.attributePoints = this.attributePointsMax - spent + 2;
  }

  CalculateValues() {
    let attributes: any = this.character.attributes;
    const calculatedValues = {
      hp: parseInt(attributes.mettle),
      ds: parseInt(attributes.agility) + 10,
      son: parseInt(attributes.resolve)
    }
    return calculatedValues;
  }

  SaveToServer() {
    // Send current character data to the server
  }

  ngOnDestroy(): void {
    this.rulesSub.unsubscribe();
  }

}
