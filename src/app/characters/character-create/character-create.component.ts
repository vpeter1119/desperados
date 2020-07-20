import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs'; 7
import { Router } from "@angular/router";

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
  defaultSkills = [];
  availableSkills = [];
  maxSkills = 2;
  pickedSkills = 0;
  availableSpells = [];
  chosenSpellList: { name:string, desc:string }[] = [];
  maxSpells = 2;
  pickedSpells = 0;
  errorMessage: string;

  constructor(
    private _common: CommonService,
    public _text: TextService,
    private charactersService: CharactersService,
    public router: Router,
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
    if (this.currentStep == 3) {
      this.ListSkillsFromTemplate();
      this.character.special = this.character.template.specials;
    };
    if (this.currentStep == 4) {
      this.AddSkillsFromTemplate();
    };
    if (this.currentStep == 4 && this.character.template.name != "voodoo-priest") {
      this.CreateCharacter();
    };
    if (this.currentStep == 5) {
      this.SaveSpells();
      this.CreateCharacter();
    };
  }

  SaveGeneral(name: string, sex: string, age: string) {
    if (!name) {
      this.errorMessage = "Please enter a name for your character!";
      return;
    } else if (name.length > 30 || sex.length > 15 || age.length > 15) {
      this.errorMessage = "Maximum characters exceeded. Please shorten to continue.";
      return;
    }
    this.character = {
      name: name,
      sex: sex || "unknown",
      age: age || "unknown",
    };
    this.NextStep();
  }

  AddSkill(skill) {
    if (this.pickedSkills >= this.maxSkills) return;
    this.character.skills.push(skill);
    this.RemoveFromArray(skill, this.availableSkills);
    this.SortSkills(this.character.skills);
    this.pickedSkills++;
  }

  RemoveSkill(skill) {
    this.availableSkills.push(skill);
    this.RemoveFromArray(skill, this.character.skills);
    this.SortSkills(this.availableSkills);
    this.pickedSkills--;
  }

  AddSkillsFromTemplate() {
    this.character.template.skills.forEach(skill => {
      let skillToAdd = this.rules.o.skills[skill.name];
      this.character.skills.push(skillToAdd);
      this.SortSkills(this.character.skills);
    })
  }

  // This lists the default skills but does not add them to the character
  ListSkillsFromTemplate() {
    this.character.skills = [];
    this.defaultSkills = this.character.template.skills;
    this.availableSkills = this.rules.a.skill.filter(skill => this.defaultSkills.map(function (e) { return e.name; }).indexOf(skill.name) < 0);
    this.SortSkills(this.availableSkills);
  }

  ListSpells() {
    this.character.special = this.character.template.specials;
    this.availableSpells = this.rules.a.spells;
  }

  AddSpell(spell) {
    if (this.pickedSpells >= this.maxSpells) return;
    this.chosenSpellList.push(spell);
    this.character.special.push(spell);
    this.RemoveFromArray(spell, this.availableSpells);
    this.SortSkills(this.chosenSpellList);
    this.pickedSpells++;
  }

  RemoveSpell(spell) {
    this.availableSpells.push(spell);
    this.RemoveFromArray(spell, this.chosenSpellList);
    this.SortSkills(this.availableSpells);
    this.pickedSpells--;
  }

  SaveSpells() {
    this.character.special.concat(this.chosenSpellList);
  }

  SortSkills(array: {name: string}[]) {
    array.sort((a, b) => a.name.localeCompare(b.name));
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
    this.ListSpells();
    this.NextStep();
  }

  CreateCharacter() {
    var characterData = this.character;
    this.charactersService.CreateCharacter(characterData, (ok) => {
      if (ok) {
        // Handle success
        console.warn("Character successfully created.");
        this.router.navigate(["my-characters"]);
      } else {
        // Handle error
        console.warn("Could not create character");
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

  //Generic method to remove element from array by 'name'
  RemoveFromArray(element, array) {
    var index = array.map(function (e) { return e.name; }).indexOf(element.name);
    if (index > -1) {
      array.splice(index, 1);
    }
  }

}
