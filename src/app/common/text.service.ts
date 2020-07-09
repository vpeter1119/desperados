import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextService {

  constructor() { }

  Capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

}
