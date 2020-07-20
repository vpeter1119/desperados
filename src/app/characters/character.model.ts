export interface Character {
  index: string;
  name: string;
  age: string;
  sex: string;
  template: {
    name: string,
    desc: string,
    mods: { attribute: string, value: number }[],
    skills: { name: string }[],
    specials: [],

  };
  attributes: {};
  skills: { name: string }[];
  special: { name: string, desc: string }[];
  equipment: [];
}
