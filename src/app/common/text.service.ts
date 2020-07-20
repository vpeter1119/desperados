import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextService {

  constructor() { }

  Capitalize(string: string) {
    // Make first letter capital
    var capitalizedString = string.charAt(0).toUpperCase() + string.slice(1);
    // Replace dashes with spaces
    var spaceAddedString = capitalizedString.replace(/-/g, ' ');
    return spaceAddedString;
  }

}
