import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  apiUrl = "https://mcrpc-server-pr-14.herokuapp.com/api/desperados";
  content;
  contentListener = new Subject();

  constructor(
    private http: HttpClient,
  ) { }

  GetContent() {
    const url = `${this.apiUrl}/rules`;
    this.http.get<{
      ok: boolean,
      result: {
        attributes: [],
        templates: [],
        skill: [],
        spells: [],
      }
    }>(url)
      .subscribe(response => {
        if (response.ok) {
          console.warn(response);
          this.content = {
            a: response.result,
            o: this.MapRulesData(response.result)
          };
          console.warn(this.content);
          this.contentListener.next(this.content);
        } else {
          this.contentListener.next({message: "Error: could not retrieve rulebook content."});
        }
      })
  }

  GetContentListener() {
    this.GetContent();
    return this.contentListener.asObservable();
  }

  MapRulesData(obj) {
    let attributes = {};
    let templates = {};
    let skills = {};
    let spells = {};
    obj.attributes.forEach(el => {
      attributes[el.name] = el;
    });
    obj.templates.forEach(el => {
      templates[el.name] = el;
    });
    obj.skill.forEach(el => {
      skills[el.name] = el;
    });
    obj.spells.forEach(el => {
      spells[el.name] = el;
    });
    const mappedData = {
      attributes: attributes,
      templates: templates,
      skills: skills,
      spells: spells,
    };
    return mappedData;
  }

}
